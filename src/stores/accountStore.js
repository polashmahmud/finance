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
    await addDoc(accountsRef, {
      name: account.name,
      type: account.type,
      balance: account.balance || 0,
      icon: account.icon || 'account_balance_wallet',
      color: account.color || '#111111',
      createdAt: Date.now(),
    })
  }

  async function updateAccount(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const accRef = doc(firestore, `users/${uid}/accounts/${id}`)
    await updateDoc(accRef, data)
  }

  async function updateBalance(accountId, amount) {
    const acc = accounts.value.find((a) => a.id === accountId)
    if (!acc) return
    const uid = auth.currentUser?.uid
    if (!uid) return
    const accRef = doc(firestore, `users/${uid}/accounts/${accountId}`)

    // Ensure both are treated as numbers to prevent string concatenation
    const currentBalance = Number(acc.balance || 0)
    const amountToUpdate = Number(amount || 0)

    await updateDoc(accRef, { balance: currentBalance + amountToUpdate })
  }

  async function deleteAccount(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await deleteDoc(doc(firestore, `users/${uid}/accounts/${id}`))
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
