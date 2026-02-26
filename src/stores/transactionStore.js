import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ref as dbRef, onValue, push, set, remove } from 'firebase/database'
import { database, auth } from 'boot/firebase'

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref([])
  const loading = ref(false)
  let unsubscribe = null

  const totalIncome = computed(() =>
    transactions.value
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
  )

  const totalExpense = computed(() =>
    transactions.value
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
  )

  const recentTransactions = computed(() =>
    [...transactions.value]
      .filter((t) => t.type !== 'transfer')
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 10),
  )

  function getUserTransactionsRef() {
    const uid = auth.currentUser?.uid
    if (!uid) return null
    return dbRef(database, `finance/users/${uid}/transactions`)
  }

  function listenTransactions() {
    const txRef = getUserTransactionsRef()
    if (!txRef) return

    loading.value = true
    if (unsubscribe) unsubscribe()

    unsubscribe = onValue(txRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        transactions.value = Object.entries(data)
          .map(([id, val]) => ({ id, ...val }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      } else {
        transactions.value = []
      }
      loading.value = false
    })
  }

  async function addTransaction(tx) {
    const txRef = getUserTransactionsRef()
    if (!txRef) return
    const newRef = push(txRef)
    await set(newRef, {
      type: tx.type,
      amount: tx.amount || 0,
      category: tx.category || '',
      accountId: tx.accountId || null,
      fromAccountId: tx.fromAccountId || null,
      toAccountId: tx.toAccountId || null,
      fee: tx.fee || 0,
      date: tx.date || new Date().toISOString().slice(0, 10),
      time: tx.time || new Date().toTimeString().slice(0, 5),
      notes: tx.notes || '',
      createdAt: Date.now(),
    })
  }

  async function deleteTransaction(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await remove(dbRef(database, `finance/users/${uid}/transactions/${id}`))
  }

  function searchTransactions(query) {
    const q = query.toLowerCase()
    return transactions.value.filter(
      (t) =>
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        (t.amount && String(t.amount).includes(q)) ||
        (t.date && t.date.includes(q)),
    )
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    transactions,
    totalIncome,
    totalExpense,
    recentTransactions,
    loading,
    listenTransactions,
    addTransaction,
    deleteTransaction,
    searchTransactions,
    stopListening,
  }
})
