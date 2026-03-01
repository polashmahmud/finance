import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore'
import { auth, firestore } from 'boot/firebase'

// Map Firebase auth error codes to user-friendly messages, preventing
// implementation details (e.g. "auth/user-not-found") from reaching the UI.
function sanitizeAuthError(error) {
  const code = error?.code || ''
  const messages = {
    'auth/invalid-email': 'ইমেইল ঠিকানাটি বৈধ নয়।',
    'auth/user-disabled': 'এই অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।',
    'auth/user-not-found': 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।',
    'auth/wrong-password': 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।',
    'auth/invalid-credential': 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।',
    'auth/too-many-requests': 'অনেকবার ব্যর্থ প্রচেষ্টা। কিছুক্ষণ পরে আবার চেষ্টা করুন।',
    'auth/email-already-in-use': 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে।',
    'auth/weak-password': 'পাসওয়ার্ড যথেষ্ট শক্তিশালী নয়। কমপক্ষে ৬টি অক্ষর ব্যবহার করুন।',
    'auth/network-request-failed': 'নেটওয়ার্ক সংযোগ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
    'auth/requires-recent-login': 'এই কাজটি করতে আবার লগইন করুন।',
  }
  return messages[code] || 'একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।'
}

// Simple in-memory login rate limiter – maximum 5 attempts per 15 minutes.
const _loginAttempts = { count: 0, windowStart: 0 }
const LOGIN_MAX_ATTEMPTS = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function checkLoginRateLimit() {
  const now = Date.now()
  if (now - _loginAttempts.windowStart > LOGIN_WINDOW_MS) {
    _loginAttempts.count = 0
    _loginAttempts.windowStart = now
  }
  if (_loginAttempts.count >= LOGIN_MAX_ATTEMPTS) {
    return false
  }
  _loginAttempts.count++
  return true
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userProfile = ref(null)
  const isAuthenticated = ref(false)
  const isAuthReady = ref(false)

  // Promise that resolves when Firebase auth state is first determined
  let _authReadyResolve
  const authReadyPromise = new Promise((resolve) => {
    _authReadyResolve = resolve
  })

  // Wait for initial auth state before allowing navigation
  onAuthStateChanged(auth, async (currentUser) => {
    user.value = currentUser
    isAuthenticated.value = !!currentUser
    isAuthReady.value = true

    // Fetch user profile when auth state changes
    if (currentUser) {
      await fetchUserProfile(currentUser.uid)
    } else {
      userProfile.value = null
    }

    _authReadyResolve()
  })

  function waitForAuth() {
    return authReadyPromise
  }

  async function fetchUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', uid))
      if (userDoc.exists()) {
        userProfile.value = userDoc.data()
      } else {
        // Create default profile if not exists
        userProfile.value = {
          uid: uid,
          name: '',
          avatar: null,
          createdAt: new Date().toISOString(),
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      userProfile.value = null
    }
  }

  async function updateUserProfile(updates) {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    try {
      const userRef = doc(firestore, 'users', user.value.uid)
      const currentProfile = await getDoc(userRef)

      if (currentProfile.exists()) {
        await updateDoc(userRef, updates)
      } else {
        await setDoc(userRef, {
          uid: user.value.uid,
          ...updates,
          createdAt: new Date().toISOString(),
        })
      }

      // Update local state
      if (userProfile.value) {
        userProfile.value = { ...userProfile.value, ...updates }
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return { success: false, error: error.message }
    }
  }

  async function updateUserName(name) {
    return await updateUserProfile({ name })
  }

  async function updateUserAvatar(avatarBase64) {
    return await updateUserProfile({ avatar: avatarBase64 })
  }

  async function login(email, password) {
    if (!checkLoginRateLimit()) {
      return {
        success: false,
        error: 'অনেকবার ব্যর্থ প্রচেষ্টা। কিছুক্ষণ পরে আবার চেষ্টা করুন।',
      }
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      // Reset rate limit counter on successful login
      _loginAttempts.count = 0
      user.value = userCredential.user
      isAuthenticated.value = true
      await fetchUserProfile(userCredential.user.uid)
      return { success: true }
    } catch (error) {
      return { success: false, error: sanitizeAuthError(error) }
    }
  }

  async function register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      isAuthenticated.value = true

      // Create initial user profile
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: '',
        avatar: null,
        email: email,
        createdAt: new Date().toISOString(),
      })

      // Create default accounts
      const accountsRef = collection(firestore, `users/${userCredential.user.uid}/accounts`)
      await Promise.all([
        addDoc(accountsRef, {
          name: 'Cash',
          type: 'Cash',
          balance: 0,
          icon: 'wallet',
          color: '#111111',
          createdAt: Date.now(),
        }),
        addDoc(accountsRef, {
          name: 'Bank',
          type: 'Bank',
          balance: 0,
          icon: 'account_balance',
          color: '#111111',
          createdAt: Date.now(),
        }),
      ])

      // Create default categories
      const categoriesRef = collection(firestore, `users/${userCredential.user.uid}/categories`)

      const defaultCategories = [
        { type: 'expense', name: 'Groceries', icon: 'shopping_cart', color: '#f44336' },
        { type: 'expense', name: 'Restaurant', icon: 'restaurant', color: '#ff9800' },
        { type: 'expense', name: 'Transport', icon: 'directions_bus', color: '#2196f3' },
        { type: 'expense', name: 'Health', icon: 'local_hospital', color: '#e91e63' },
        { type: 'expense', name: 'Gifts', icon: 'card_giftcard', color: '#9c27b0' },
        { type: 'expense', name: 'Family', icon: 'family_restroom', color: '#4caf50' },
        { type: 'expense', name: 'Shopping', icon: 'shopping_bag', color: '#3f51b5' },
        { type: 'income', name: 'Salary', icon: 'attach_money', color: '#4caf50' },
      ]

      await Promise.all(
        defaultCategories.map((cat) =>
          addDoc(categoriesRef, {
            type: cat.type,
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            budget: 0,
          }),
        ),
      )

      await fetchUserProfile(userCredential.user.uid)
      return { success: true }
    } catch (error) {
      return { success: false, error: sanitizeAuthError(error) }
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      user.value = null
      userProfile.value = null
      isAuthenticated.value = false
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function changePassword(currentPassword, newPassword) {
    if (!user.value) {
      return { success: false, error: 'Not authenticated' }
    }

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.value.email, currentPassword)
      await reauthenticateWithCredential(user.value, credential)

      // Update password
      await updatePassword(user.value, newPassword)

      return { success: true }
    } catch (error) {
      console.error('Error changing password:', error)
      return { success: false, error: sanitizeAuthError(error) }
    }
  }

  return {
    user,
    userProfile,
    isAuthenticated,
    isAuthReady,
    waitForAuth,
    fetchUserProfile,
    updateUserProfile,
    updateUserName,
    updateUserAvatar,
    login,
    register,
    logout,
    changePassword,
  }
})
