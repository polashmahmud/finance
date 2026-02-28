import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'

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
    return collection(firestore, `users/${uid}/transactions`)
  }

  function listenTransactions() {
    const txRef = getUserTransactionsRef()
    if (!txRef) return

    loading.value = true
    if (unsubscribe) unsubscribe()

    unsubscribe = onSnapshot(
      txRef,
      (snapshot) => {
        transactions.value = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        loading.value = false
      },
      (error) => {
        console.error('Error fetching transactions:', error)
        loading.value = false
      },
    )
  }

  async function addTransaction(tx) {
    const txRef = getUserTransactionsRef()
    if (!txRef) return
    await addDoc(txRef, {
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

  async function updateTransaction(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const txRef = doc(firestore, `users/${uid}/transactions/${id}`)
    await updateDoc(txRef, data)
  }

  async function deleteTransaction(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await deleteDoc(doc(firestore, `users/${uid}/transactions/${id}`))
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
    updateTransaction,
    deleteTransaction,
    searchTransactions,
    stopListening,
  }
})
