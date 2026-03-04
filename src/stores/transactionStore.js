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
    const docData = {
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
    }
    // Optimistic update: add to local state immediately for instant UI feedback.
    // onSnapshot will reconcile with Firestore cache once the write is processed.
    const tempId = `temp_${Date.now()}`
    transactions.value.unshift({ id: tempId, ...docData })

    // Fire-and-forget: persistentLocalCache queues writes automatically.
    // Don't await – navigator.onLine is unreliable on mobile, and awaiting
    // addDoc hangs indefinitely when offline because the Promise only resolves
    // after server acknowledgment.
    addDoc(txRef, docData)
      .then((ref) => {
        const idx = transactions.value.findIndex((t) => t.id === tempId)
        if (idx >= 0) transactions.value[idx].id = ref.id
      })
      .catch((err) => console.warn('[Firestore] Transaction write queued:', err))
  }

  async function updateTransaction(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic update
    const idx = transactions.value.findIndex((t) => t.id === id)
    if (idx >= 0) Object.assign(transactions.value[idx], data)

    const txRef = doc(firestore, `users/${uid}/transactions/${id}`)
    updateDoc(txRef, data).catch((err) =>
      console.warn('[Firestore] Transaction update queued:', err),
    )
  }

  async function deleteTransaction(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistically remove from local state immediately
    transactions.value = transactions.value.filter((t) => t.id !== id)
    deleteDoc(doc(firestore, `users/${uid}/transactions/${id}`)).catch((err) =>
      console.warn('[Firestore] Transaction delete queued:', err),
    )
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

  // Fetch transactions - stops existing listener and starts fresh one, returns promise that resolves when loaded
  function fetchTransactions() {
    return new Promise((resolve) => {
      const txRef = getUserTransactionsRef()
      if (!txRef) {
        resolve()
        return
      }

      // Stop existing listener
      if (unsubscribe) unsubscribe()

      loading.value = true

      // Set up new listener
      unsubscribe = onSnapshot(
        txRef,
        (snapshot) => {
          transactions.value = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          loading.value = false
          resolve() // Resolve promise when data is loaded
        },
        (error) => {
          console.error('Error fetching transactions:', error)
          loading.value = false
          resolve() // Resolve anyway to not block the UI
        },
      )
    })
  }

  return {
    transactions,
    totalIncome,
    totalExpense,
    recentTransactions,
    loading,
    listenTransactions,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    searchTransactions,
    stopListening,
  }
})
