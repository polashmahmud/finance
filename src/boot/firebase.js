import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'VITE_FIREBASE_API_KEY_REMOVED',
  authDomain: 'FIREBASE_AUTH_DOMAIN_REMOVED',
  databaseURL: 'FIREBASE_DATABASE_URL_REMOVED',
  projectId: 'FIREBASE_PROJECT_ID_REMOVED',
  storageBucket: 'FIREBASE_STORAGE_BUCKET_REMOVED',
  messagingSenderId: 'FIREBASE_SENDER_ID_REMOVED',
  appId: '1:FIREBASE_SENDER_ID_REMOVED:web:FIREBASE_APP_HASH_REMOVED',
  measurementId: 'FIREBASE_MEASUREMENT_ID_REMOVED',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app)
const auth = getAuth(app)

// We export a promise to delay the Vue app boot process until Firebase Auth has initialized.
export default boot(() => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      resolve()
      unsubscribe()
    })
  })
})

export { auth }
