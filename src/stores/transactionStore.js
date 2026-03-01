import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'

// When offline, Firestore persistence queues writes but the Promise never resolves
// until server ack. Use this to fire-and-forget when offline so UI stays responsive.
function offlineWrite(operation) {
  if (!navigator.onLine) {
    operation().catch((err) => console.warn('[Offline] Write queued for sync:', err))
    return Promise.resolve()
  }
  return operation()
}

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
    // When offline: add to local state immediately so UI shows the entry,
    // then queue the Firestore write (persistentLocalCache syncs when online)
    if (!navigator.onLine) {
      const tempId = `offline_${Date.now()}`
      transactions.value.unshift({ id: tempId, ...docData })
      addDoc(txRef, docData)
        .then((ref) => {
          // Replace temp entry with real Firestore ID once sync completes
          const idx = transactions.value.findIndex((t) => t.id === tempId)
          if (idx >= 0) transactions.value[idx].id = ref.id
        })
        .catch((err) => console.warn('[Offline] Transaction queued for sync:', err))
      return
    }
    await addDoc(txRef, docData)
  }

  async function updateTransaction(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const txRef = doc(firestore, `users/${uid}/transactions/${id}`)
    await offlineWrite(() => updateDoc(txRef, data))
  }

  async function deleteTransaction(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistically remove from local state immediately
    transactions.value = transactions.value.filter((t) => t.id !== id)
    await offlineWrite(() => deleteDoc(doc(firestore, `users/${uid}/transactions/${id}`)))
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
