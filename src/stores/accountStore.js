import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ref as dbRef, onValue, push, set, remove, update } from 'firebase/database'
import { database, auth } from 'boot/firebase'

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref([])
  const loading = ref(false)
  let unsubscribe = null

  const totalBalance = computed(() => accounts.value.reduce((sum, a) => sum + (a.balance || 0), 0))

  function getUserAccountsRef() {
    const uid = auth.currentUser?.uid
    if (!uid) return null
    return dbRef(database, `finance/users/${uid}/accounts`)
  }

  function listenAccounts() {
    const accountsRef = getUserAccountsRef()
    if (!accountsRef) return

    loading.value = true
    if (unsubscribe) unsubscribe()

    unsubscribe = onValue(accountsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        accounts.value = Object.entries(data).map(([id, val]) => ({ id, ...val }))
      } else {
        accounts.value = []
      }
      loading.value = false
    })
  }

  async function addAccount(account) {
    const accountsRef = getUserAccountsRef()
    if (!accountsRef) return
    const newRef = push(accountsRef)
    await set(newRef, {
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
    const accRef = dbRef(database, `finance/users/${uid}/accounts/${id}`)
    await update(accRef, data)
  }

  async function updateBalance(accountId, amount) {
    const acc = accounts.value.find((a) => a.id === accountId)
    if (!acc) return
    const uid = auth.currentUser?.uid
    if (!uid) return
    const accRef = dbRef(database, `finance/users/${uid}/accounts/${accountId}`)

    // Ensure both are treated as numbers to prevent string concatenation
    const currentBalance = Number(acc.balance || 0)
    const amountToUpdate = Number(amount || 0)

    await update(accRef, { balance: currentBalance + amountToUpdate })
  }

  async function deleteAccount(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await remove(dbRef(database, `finance/users/${uid}/accounts/${id}`))
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
