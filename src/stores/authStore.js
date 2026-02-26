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

  // Wait for initial auth state before allowing navigation
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    isAuthenticated.value = !!currentUser
    isAuthReady.value = true
  })

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
    login,
    register,
    logout,
  }
})
