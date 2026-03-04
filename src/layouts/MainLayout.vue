<template>
  <q-layout view="hHh lpR fFf">
    <!-- Global Header -->
    <q-header class="bg-white text-dark" bordered style="border-bottom: 1px solid #d4d4d4;">
      <q-toolbar style="min-height: 56px;">
        <!-- Hamburger toggle (tablet/desktop only when drawer hidden) -->
        <q-btn v-if="$q.screen.gt.xs" flat round dense icon="menu" color="dark" class="q-mr-sm"
          @click="drawerOpen = !drawerOpen" />

        <!-- Left: Logo + Name -->
        <div class="row items-center q-gutter-sm cursor-pointer" @click="$router.push('/dashboard')">
          <q-icon name="account_balance_wallet" size="28px" color="dark" />
          <span class="text-weight-bold" style="font-size: 1.1rem; letter-spacing: -0.02em;">{{
            $t('layout.financeManager') }}</span>
        </div>

        <q-space />

        <!-- Quick Add Button (desktop/tablet header) -->
        <q-btn v-if="$q.screen.gt.xs && showFab" unelevated icon="add" :label="$t('nav.quickAdd')" color="dark"
          text-color="white" rounded size="sm" class="q-mr-sm" @click="quickAddOpen = true" />

        <!-- Right: User Avatar -->
        <q-avatar color="dark" text-color="white" size="36px" class="cursor-pointer">
          <img v-if="authStore.userProfile?.avatar" :src="authStore.userProfile.avatar" />
          <q-icon v-else name="person" size="20px" />
          <q-menu>
            <q-list style="min-width: 180px">
              <q-item>
                <q-item-section>
                  <div class="text-caption text-grey">{{ authStore.user?.email }}</div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="$router.push('/dashboard/settings')">
                <q-item-section avatar>
                  <q-icon name="settings" color="dark" />
                </q-item-section>
                <q-item-section>{{ $t('nav.settings') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/categories')">
                <q-item-section avatar>
                  <q-icon name="category" color="dark" />
                </q-item-section>
                <q-item-section>{{ $t('nav.categories') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/help')">
                <q-item-section avatar>
                  <q-icon name="help_outline" color="dark" />
                </q-item-section>
                <q-item-section>{{ $t('help.title') }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="onLogout">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section class="text-negative">{{ $t('common.logout') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>

    <!-- Left Sidebar Drawer (tablet & desktop) -->
    <q-drawer v-model="drawerOpen" show-if-above :width="220" :breakpoint="600" bordered
      class="bg-white sidebar-drawer">
      <q-scroll-area class="fit">
        <q-list padding>
          <!-- Main nav -->
          <q-item clickable v-ripple to="/dashboard" exact active-class="sidebar-item-active">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>{{ $t('nav.home') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/accounts" active-class="sidebar-item-active">
            <q-item-section avatar>
              <q-icon name="account_balance_wallet" />
            </q-item-section>
            <q-item-section>{{ $t('nav.accounts') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/reports" active-class="sidebar-item-active">
            <q-item-section avatar>
              <q-icon name="bar_chart" />
            </q-item-section>
            <q-item-section>{{ $t('nav.reports') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/market-lists" active-class="sidebar-item-active">
            <q-item-section avatar>
              <q-icon name="shopping_cart" />
            </q-item-section>
            <q-item-section>{{ $t('nav.lists') }}</q-item-section>
          </q-item>

          <q-separator class="q-my-sm" />

          <q-item clickable v-ripple to="/dashboard/all-transactions" active-class="sidebar-item-active">
            <q-item-section avatar>
              <q-icon name="receipt_long" />
            </q-item-section>
            <q-item-section>{{ $t('nav.allTransactions') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/search" active-class="sidebar-item-active">
            <q-item-section avatar>
              <q-icon name="search" />
            </q-item-section>
            <q-item-section>{{ $t('nav.search') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/notes" active-class="sidebar-item-active">
            <q-item-section avatar>
              <q-icon name="description" />
            </q-item-section>
            <q-item-section>{{ $t('nav.note') }}</q-item-section>
          </q-item>

          <q-separator class="q-my-sm" />

          <q-item clickable v-ripple to="/dashboard/categories" active-class="sidebar-item-active">
            <q-item-section avatar>
              <q-icon name="category" />
            </q-item-section>
            <q-item-section>{{ $t('nav.categories') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/settings" active-class="sidebar-item-active">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>{{ $t('nav.settings') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/help" active-class="sidebar-item-active">
            <q-item-section avatar>
              <q-icon name="help_outline" />
            </q-item-section>
            <q-item-section>{{ $t('help.title') }}</q-item-section>
          </q-item>

          <q-separator class="q-my-sm" />

          <q-item clickable v-ripple @click="onLogout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section class="text-negative">{{ $t('common.logout') }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-pull-to-refresh @refresh="onRefresh" color="dark" spinner-size="42px">
        <router-view />
      </q-pull-to-refresh>
    </q-page-container>

    <!-- Floating Action Button (mobile only) -->
    <q-btn v-if="showFab && $q.screen.lt.md" class="finance-fab shadow-4" icon="add" color="dark" text-color="white"
      round size="lg" style="position: fixed; right: 16px; z-index: 100" @click="quickAddOpen = true" />

    <!-- Quick Add Dialog -->
    <q-dialog v-model="quickAddOpen">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; padding: 12px 16px 32px; background: white;">
        <!-- Header -->
        <q-card-section class="row items-center justify-between no-wrap q-pb-md">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">{{ $t('nav.quickAdd') }}</div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>

        <!-- Grid -->
        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-sm">
            <div :class="index < 3 ? 'col-4' : 'col-6'" v-for="(action, index) in quickAddActions" :key="index">
              <div class="cursor-pointer text-center"
                :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: action.bgColor, borderRadius: '16px', padding: '16px 8px', transition: 'background-color 0.2s', height: '100px' }"
                v-ripple @click="navigateTo(action.route)">
                <q-icon :name="action.icon" size="28px" :style="{ color: action.color }" class="q-mb-sm" />
                <div class="text-caption text-weight-medium"
                  style="color: #334155; font-size: 0.8rem; line-height: 1.2; text-align: center;">{{ action.label }}
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Bottom Navigation (mobile only) -->
    <q-footer v-if="showBottomNav && $q.screen.lt.sm" class="bg-white text-grey-8 finance-bottom-nav" bordered>
      <q-tabs v-model="currentTab" dense active-color="dark" indicator-color="dark" class="text-grey-6"
        narrow-indicator>
        <q-route-tab name="home" icon="home" :label="$t('nav.home')" to="/dashboard" exact />
        <q-route-tab name="accounts" icon="account_balance_wallet" :label="$t('nav.accounts')"
          to="/dashboard/accounts" />
        <q-route-tab name="reports" icon="bar_chart" :label="$t('nav.reports')" to="/dashboard/reports" />
        <q-route-tab name="lists" icon="shopping_cart" :label="$t('nav.lists')" to="/dashboard/market-lists" />
      </q-tabs>
    </q-footer>
  </q-layout>

  <!-- Offline Banner (rendered outside q-layout to overlay properly) -->
  <transition name="offline-slide">
    <div v-if="!isOnline" class="offline-banner">
      <q-icon name="wifi_off" size="16px" class="q-mr-xs" />
      <span>{{ $t('common.offline') }}</span>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/authStore'
import { useSettingsStore } from 'stores/settingsStore'
import { useAccountStore } from 'stores/accountStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const settings = useSettingsStore()
const accountStore = useAccountStore()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

const currentTab = ref('home')
const quickAddOpen = ref(false)
const drawerOpen = ref(false)
const isOnline = ref(navigator.onLine)

function handleOnline() {
  isOnline.value = true
}
function handleOffline() {
  isOnline.value = false
}

// Pull to refresh handler
async function onRefresh(done) {
  try {
    // Wait for all stores to fetch fresh data (these stop old listeners and start new ones)
    await Promise.all([
      accountStore.fetchAccounts(),
      transactionStore.fetchTransactions(),
      categoryStore.fetchCategories()
    ])

    $q.notify({
      type: 'positive',
      icon: 'refresh',
      message: t('common.refreshComplete'),
      position: 'top',
      timeout: 1500
    })
  } catch (error) {
    console.error('Refresh error:', error)
    $q.notify({
      type: 'negative',
      icon: 'error_outline',
      message: t('common.refreshFailed'),
      position: 'top'
    })
  } finally {
    if (done) done()
  }
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})
onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

const noFabPages = ['/splash', '/dashboard/add-income', '/dashboard/add-expense', '/dashboard/transfer', '/dashboard/search', '/dashboard/categories', '/dashboard/all-transactions']
const noBottomNavPages = ['/splash']

const showFab = computed(() => !noFabPages.includes(route.path) && !route.path.startsWith('/dashboard/account/') && !route.path.startsWith('/dashboard/category/'))
const showBottomNav = computed(() => !noBottomNavPages.includes(route.path))

const quickAddActions = computed(() => [
  { label: t('common.income'), icon: 'trending_up', color: '#22c55e', bgColor: '#f0fdf4', route: '/dashboard/add-income' },
  { label: t('common.expense'), icon: 'trending_down', color: '#ef4444', bgColor: '#fef2f2', route: '/dashboard/add-expense' },
  { label: t('common.transfer'), icon: 'sync_alt', color: '#3b82f6', bgColor: '#eff6ff', route: '/dashboard/transfer' },
  { label: t('nav.marketList'), icon: 'shopping_cart', color: '#22c55e', bgColor: '#f0fdf4', route: '/dashboard/market-lists' },
  { label: t('nav.note'), icon: 'description', color: '#0f172a', bgColor: '#fffbeb', route: '/dashboard/notes' }
])

function navigateTo(path) {
  quickAddOpen.value = false
  router.push(path)
}

async function onLogout() {
  if (settings.appLock) {
    // PIN is set → just lock the screen, don't sign out from Firebase
    settings.lock()
    $q.notify({ type: 'info', icon: 'lock', message: t('common.screenLocked'), position: 'top' })
    router.push('/splash')
  } else {
    // No PIN → real Firebase logout
    const result = await authStore.logout()
    if (result.success) {
      $q.notify({ type: 'positive', icon: 'check_circle', message: t('common.logoutSuccess'), position: 'top' })
      router.push('/login')
    }
  }
}
</script>
<style scoped>
/* ===== Offline Banner ===== */
.offline-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f59e0b;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 7px 16px;
  letter-spacing: 0.01em;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
}

/* Keep banner above the bottom nav on mobile */
@media (max-width: 599px) {
  .offline-banner {
    bottom: 50px;
  }
}

/* Slide transition */
.offline-slide-enter-active,
.offline-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.offline-slide-enter-from,
.offline-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
