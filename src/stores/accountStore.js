import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref([])
  const loading = ref(false)
  let unsubscribe = null

  const totalBalance = computed(() => accounts.value.reduce((sum, a) => sum + (a.balance || 0), 0))

  function getUserAccountsRef() {
    const uid = auth.currentUser?.uid
    if (!uid) return null
    return collection(firestore, `users/${uid}/accounts`)
  }

  function listenAccounts() {
    const accountsRef = getUserAccountsRef()
    if (!accountsRef) return

    loading.value = true
    if (unsubscribe) unsubscribe()

    unsubscribe = onSnapshot(
      accountsRef,
      (snapshot) => {
        accounts.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        loading.value = false
      },
      (error) => {
        console.error('Error fetching accounts:', error)
        loading.value = false
      },
    )
  }

  async function addAccount(account) {
    const accountsRef = getUserAccountsRef()
    if (!accountsRef) return
    const docData = {
      name: account.name,
      type: account.type,
      balance: account.balance || 0,
      icon: account.icon || 'account_balance_wallet',
      color: account.color || '#111111',
      createdAt: Date.now(),
    }
    // Optimistic update
    const tempId = `temp_${Date.now()}`
    accounts.value.push({ id: tempId, ...docData })

    addDoc(accountsRef, docData)
      .then((ref) => {
        const idx = accounts.value.findIndex((a) => a.id === tempId)
        if (idx >= 0) accounts.value[idx].id = ref.id
      })
      .catch((err) => console.warn('[Firestore] Account write queued:', err))
  }

  async function updateAccount(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic update
    const idx = accounts.value.findIndex((a) => a.id === id)
    if (idx >= 0) Object.assign(accounts.value[idx], data)

    const accRef = doc(firestore, `users/${uid}/accounts/${id}`)
    updateDoc(accRef, data).catch((err) => console.warn('[Firestore] Account update queued:', err))
  }

  async function updateBalance(accountId, amount) {
    const acc = accounts.value.find((a) => a.id === accountId)
    if (!acc) return
    const uid = auth.currentUser?.uid
    if (!uid) return
    const accRef = doc(firestore, `users/${uid}/accounts/${accountId}`)

    const currentBalance = Number(acc.balance || 0)
    const amountToUpdate = Number(amount || 0)
    const newBalance = currentBalance + amountToUpdate

    // Optimistically update pinia state immediately so UI reflects the change
    acc.balance = newBalance

    // Fire-and-forget: persistentLocalCache queues offline writes automatically
    updateDoc(accRef, { balance: newBalance }).catch((err) =>
      console.warn('[Firestore] Balance update queued:', err),
    )
  }

  async function deleteAccount(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic removal
    accounts.value = accounts.value.filter((a) => a.id !== id)

    deleteDoc(doc(firestore, `users/${uid}/accounts/${id}`)).catch((err) =>
      console.warn('[Firestore] Account delete queued:', err),
    )
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  // Fetch accounts - stops existing listener and starts fresh one, returns promise that resolves when loaded
  function fetchAccounts() {
    return new Promise((resolve) => {
      const accountsRef = getUserAccountsRef()
      if (!accountsRef) {
        resolve()
        return
      }

      // Stop existing listener
      if (unsubscribe) unsubscribe()

      loading.value = true

      // Set up new listener
      unsubscribe = onSnapshot(
        accountsRef,
        (snapshot) => {
          accounts.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          loading.value = false
          resolve() // Resolve promise when data is loaded
        },
        (error) => {
          console.error('Error fetching accounts:', error)
          loading.value = false
          resolve() // Resolve anyway to not block the UI
        },
      )
    })
  }

  return {
    accounts,
    totalBalance,
    loading,
    listenAccounts,
    fetchAccounts,
    addAccount,
    updateAccount,
    updateBalance,
    deleteAccount,
    stopListening,
  }
})
