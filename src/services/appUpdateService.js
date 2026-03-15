import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import {
  AppUpdate,
  AppUpdateAvailability,
  AppUpdateResultCode,
  FlexibleUpdateInstallStatus,
} from '@capawesome/capacitor-app-update'
import { Dialog, Notify } from 'quasar'
import i18n from 'src/i18n'

const UPDATE_CHECK_INTERVAL_MS = 5 * 60 * 1000
const RESUME_CHECK_DELAY_MS = 1200
const IMMEDIATE_PRIORITY_THRESHOLD = 4
const IMMEDIATE_STALENESS_THRESHOLD_DAYS = 7

export const APP_UPDATE_MODES = Object.freeze({
  FLEXIBLE: 'flexible',
  IMMEDIATE: 'immediate',
  SMART: 'smart',
})

let initialized = false
let lastCheckedAt = 0
let checkInFlight = null
let downloadedNotice = null
let lastFlexiblePromptVersion = null

function t(key, params) {
  return i18n.global.t(key, params)
}

function isAndroidNative() {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android'
}

function getVersionLabel(info) {
  return (
    info.availableVersionName ||
    info.availableVersionCode ||
    info.currentVersionName ||
    info.currentVersionCode ||
    'latest'
  )
}

function getVersionKey(info) {
  return `${info.availableVersionCode || ''}:${info.availableVersionName || ''}`
}

function shouldThrottleCheck(force) {
  return !force && Date.now() - lastCheckedAt < UPDATE_CHECK_INTERVAL_MS
}

function shouldUseImmediateUpdate(info, mode) {
  if (!info.immediateUpdateAllowed) return false
  if (mode === APP_UPDATE_MODES.IMMEDIATE) return true
  if (mode === APP_UPDATE_MODES.FLEXIBLE) return false

  const updatePriority = Number(info.updatePriority ?? 0)
  const stalenessDays = Number(info.clientVersionStalenessDays ?? 0)

  return (
    updatePriority >= IMMEDIATE_PRIORITY_THRESHOLD ||
    stalenessDays >= IMMEDIATE_STALENESS_THRESHOLD_DAYS
  )
}

function showDownloadedNotice() {
  if (typeof downloadedNotice === 'function') {
    downloadedNotice()
  }

  downloadedNotice = Notify.create({
    group: false,
    timeout: 0,
    type: 'positive',
    message: t('appUpdate.completeMessage'),
    actions: [
      {
        label: t('appUpdate.completeAction'),
        color: 'white',
        handler: () => {
          void completeFlexibleUpdate()
        },
      },
      {
        label: t('appUpdate.later'),
        color: 'white',
      },
    ],
  })
}

function notifyUpdateResult(code) {
  if (code === AppUpdateResultCode.CANCELED) {
    Notify.create({ type: 'warning', message: t('appUpdate.canceled') })
    return
  }

  if (code === AppUpdateResultCode.NOT_ALLOWED) {
    Notify.create({ type: 'warning', message: t('appUpdate.unavailable') })
    return
  }

  if (code === AppUpdateResultCode.FAILED || code === AppUpdateResultCode.INFO_MISSING) {
    Notify.create({ type: 'negative', message: t('appUpdate.failed') })
  }
}

async function openPlayStoreFallback() {
  try {
    await AppUpdate.openAppStore()
  } catch (error) {
    console.error('[AppUpdate] Failed to open Play Store', error)
  }
}

async function performImmediateUpdateFlow() {
  try {
    const result = await AppUpdate.performImmediateUpdate()

    if (result.code !== AppUpdateResultCode.OK) {
      notifyUpdateResult(result.code)

      if (
        result.code === AppUpdateResultCode.CANCELED ||
        result.code === AppUpdateResultCode.FAILED
      ) {
        Dialog.create({
          title: t('appUpdate.immediateTitle'),
          message: t('appUpdate.failed'),
          persistent: true,
          ok: { label: t('appUpdate.retry'), color: 'primary' },
          cancel: { label: t('appUpdate.openStore'), flat: true },
        })
          .onOk(() => {
            void performImmediateUpdateFlow()
          })
          .onCancel(() => {
            void openPlayStoreFallback()
          })
      }
    }

    return result
  } catch (error) {
    console.error('[AppUpdate] Immediate update failed', error)
    Notify.create({ type: 'negative', message: t('appUpdate.failed') })
    return null
  }
}

async function startFlexibleUpdateFlow(info) {
  const versionKey = getVersionKey(info)
  if (versionKey && lastFlexiblePromptVersion === versionKey) return null

  lastFlexiblePromptVersion = versionKey

  return new Promise((resolve) => {
    Dialog.create({
      title: t('appUpdate.flexibleTitle'),
      message: t('appUpdate.flexibleMessage', { version: getVersionLabel(info) }),
      ok: { label: t('appUpdate.downloadNow'), color: 'primary' },
      cancel: { label: t('appUpdate.later'), flat: true },
    })
      .onOk(async () => {
        try {
          const result = await AppUpdate.startFlexibleUpdate()
          notifyUpdateResult(result.code)
          resolve(result)
        } catch (error) {
          console.error('[AppUpdate] Flexible update failed', error)
          Notify.create({ type: 'negative', message: t('appUpdate.failed') })
          resolve(null)
        }
      })
      .onCancel(() => {
        resolve(null)
      })
  })
}

async function handleFlexibleInstallState(state) {
  switch (state.installStatus) {
    case FlexibleUpdateInstallStatus.DOWNLOADED:
      showDownloadedNotice()
      break
    case FlexibleUpdateInstallStatus.CANCELED:
      Notify.create({ type: 'warning', message: t('appUpdate.canceled') })
      break
    case FlexibleUpdateInstallStatus.FAILED:
      Notify.create({ type: 'negative', message: t('appUpdate.failed') })
      break
    default:
      break
  }
}

async function ensureListeners(mode) {
  await AppUpdate.addListener('onFlexibleUpdateStateChange', (state) => {
    void handleFlexibleInstallState(state)
  })

  await App.addListener('appStateChange', ({ isActive }) => {
    if (!isActive) return

    window.setTimeout(() => {
      void checkForAppUpdate({ mode, source: 'resume' })
    }, RESUME_CHECK_DELAY_MS)
  })
}

export async function completeFlexibleUpdate() {
  try {
    await AppUpdate.completeFlexibleUpdate()
  } catch (error) {
    console.error('[AppUpdate] Failed to complete flexible update', error)
    Notify.create({ type: 'negative', message: t('appUpdate.failed') })
  }
}

export async function checkForAppUpdate({
  mode = APP_UPDATE_MODES.SMART,
  force = false,
  source = 'manual',
} = {}) {
  if (!isAndroidNative()) return null
  if (shouldThrottleCheck(force)) return null
  if (checkInFlight) return checkInFlight

  checkInFlight = (async () => {
    try {
      const info = await AppUpdate.getAppUpdateInfo()
      lastCheckedAt = Date.now()

      if (info.installStatus === FlexibleUpdateInstallStatus.DOWNLOADED) {
        showDownloadedNotice()
        return info
      }

      if (
        info.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE &&
        info.updateAvailability !== AppUpdateAvailability.UPDATE_IN_PROGRESS
      ) {
        return info
      }

      if (
        info.updateAvailability === AppUpdateAvailability.UPDATE_IN_PROGRESS &&
        info.immediateUpdateAllowed
      ) {
        return performImmediateUpdateFlow()
      }

      if (shouldUseImmediateUpdate(info, mode)) {
        Dialog.create({
          title: t('appUpdate.immediateTitle'),
          message: t('appUpdate.immediateMessage', { version: getVersionLabel(info) }),
          persistent: true,
          ok: { label: t('appUpdate.updateNow'), color: 'primary' },
        }).onOk(() => {
          void performImmediateUpdateFlow()
        })

        return info
      }

      if (info.flexibleUpdateAllowed) {
        await startFlexibleUpdateFlow(info)
        return info
      }

      if (info.immediateUpdateAllowed) {
        return performImmediateUpdateFlow()
      }

      if (source === 'manual') {
        Notify.create({ type: 'warning', message: t('appUpdate.unavailable') })
      }

      return info
    } catch (error) {
      console.error(`[AppUpdate] Failed to check for update on ${source}`, error)
      return null
    } finally {
      checkInFlight = null
    }
  })()

  return checkInFlight
}

export async function initAppUpdate({ mode = APP_UPDATE_MODES.SMART } = {}) {
  if (initialized || !isAndroidNative()) return

  initialized = true

  try {
    await ensureListeners(mode)
    await checkForAppUpdate({ mode, force: true, source: 'launch' })
  } catch (error) {
    console.error('[AppUpdate] Failed to initialize app updates', error)
  }
}
