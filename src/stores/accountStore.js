import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'

// When offline, Firestore persistence queues the write but the Promise never resolves
// until the server acks. Use this helper to fire-and-forget when offline.
function offlineWrite(operation) {
  if (!navigator.onLine) {
    operation().catch((err) => console.warn('[Offline] Write queued for sync:', err))
    return Promise.resolve()
  }
  return operation()
}

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
    await offlineWrite(() =>
      addDoc(accountsRef, {
        name: account.name,
        type: account.type,
        balance: account.balance || 0,
        icon: account.icon || 'account_balance_wallet',
        color: account.color || '#111111',
        createdAt: Date.now(),
      }),
    )
  }

  async function updateAccount(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const accRef = doc(firestore, `users/${uid}/accounts/${id}`)
    await offlineWrite(() => updateDoc(accRef, data))
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
    // whether online or offline. Firestore will sync in background.
    acc.balance = newBalance

    await offlineWrite(() => updateDoc(accRef, { balance: newBalance }))
  }

  async function deleteAccount(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await offlineWrite(() => deleteDoc(doc(firestore, `users/${uid}/accounts/${id}`)))
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    accounts,
    totalBalance,
    loading,
    listenAccounts,
    addAccount,
    updateAccount,
    updateBalance,
    deleteAccount,
    stopListening,
  }
})
