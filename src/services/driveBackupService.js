import { collection, getDocs } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file'
const FOLDER_NAME = 'Finance App Backups'
const TOKEN_KEY = 'finance_drive_token'

let tokenClient = null

function loadGsiScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) { resolve(); return }
    const existing = document.querySelector('script[src*="accounts.google.com/gsi"]')
    if (existing) {
      existing.addEventListener('load', resolve)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
    document.head.appendChild(script)
  })
}

function getStoredToken() {
  try {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!stored) return null
    const { token, expiry } = JSON.parse(stored)
    // 60-second buffer before expiry
    if (expiry > Date.now() + 60_000) return token
    return null
  } catch {
    return null
  }
}

function storeToken(token, expiresIn) {
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ token, expiry: Date.now() + expiresIn * 1000 }),
  )
}

export function isDriveConnected() {
  return !!getStoredToken()
}

export function disconnectDrive() {
  try {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored && window.google?.accounts?.oauth2) {
      const { token } = JSON.parse(stored)
      window.google.accounts.oauth2.revoke(token, () => {})
    }
  } catch { /* ignore */ }
  localStorage.removeItem(TOKEN_KEY)
  tokenClient = null
}

export async function requestDriveToken(prompt = '') {
  if (!GOOGLE_CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID_MISSING')

  const cached = getStoredToken()
  if (cached) return cached

  await loadGsiScript()

  return new Promise((resolve, reject) => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.error) { reject(new Error(response.error)); return }
        storeToken(response.access_token, response.expires_in || 3600)
        resolve(response.access_token)
      },
    })
    tokenClient.requestAccessToken({ prompt })
  })
}

async function findOrCreateFolder(token) {
  const q = encodeURIComponent(
    `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
  )
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id)&spaces=drive`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  const searchData = await searchRes.json()
  if (searchData.files?.length) return searchData.files[0].id

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  })
  const folder = await createRes.json()
  if (!folder.id) throw new Error('Failed to create Drive folder')
  return folder.id
}

async function collectAllData() {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Not authenticated')
  const cols = ['transactions', 'accounts', 'categories', 'notes', 'marketLists']
  const data = {}
  for (const col of cols) {
    const snap = await getDocs(collection(firestore, `users/${uid}/${col}`))
    data[col] = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }
  return data
}

export async function backupToDrive(prompt = '') {
  const token = await requestDriveToken(prompt)
  const [folderId, allData] = await Promise.all([
    findOrCreateFolder(token),
    collectAllData(),
  ])

  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `finance-backup-${dateStr}.json`
  const fileContent = JSON.stringify({ version: 1, exportedAt: Date.now(), data: allData }, null, 2)

  const boundary = 'fin_bkp_boundary_9x3z'
  const metadata = JSON.stringify({
    name: fileName,
    mimeType: 'application/json',
    parents: [folderId],
  })

  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    metadata,
    `--${boundary}`,
    'Content-Type: application/json',
    '',
    fileContent,
    `--${boundary}--`,
  ].join('\r\n')

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`,
      },
      body,
    },
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Upload failed: ${res.status}`)
  }
  return await res.json()
}
