import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, firestore } from 'boot/firebase'

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
          createdAt: new Date().toISOString()
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
          createdAt: new Date().toISOString()
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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      isAuthenticated.value = true
      await fetchUserProfile(userCredential.user.uid)
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
      
      // Create initial user profile
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: '',
        avatar: null,
        email: email,
        createdAt: new Date().toISOString()
      })
      
      await fetchUserProfile(userCredential.user.uid)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
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
  }
})
