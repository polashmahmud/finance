import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from 'boot/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isAuthReady = ref(false)

  // Promise that resolves when Firebase auth state is first determined
  let _authReadyResolve
  const authReadyPromise = new Promise((resolve) => {
    _authReadyResolve = resolve
  })

  // Wait for initial auth state before allowing navigation
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    isAuthenticated.value = !!currentUser
    isAuthReady.value = true
    _authReadyResolve()
  })

  function waitForAuth() {
    return authReadyPromise
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      isAuthenticated.value = true
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      isAuthenticated.value = true
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      user.value = null
      isAuthenticated.value = false
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    isAuthenticated,
    isAuthReady,
    waitForAuth,
    login,
    register,
    logout,
  }
})
