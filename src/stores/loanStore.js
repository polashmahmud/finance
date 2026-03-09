import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'

export const useLoanStore = defineStore('loans', () => {
  const loans = ref([])
  const loading = ref(false)
  let unsubscribe = null

  // Loans I gave to others (receivable)
  const receivables = computed(() =>
    loans.value
      .filter((l) => l.type === 'receivable')
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
  )

  // Loans I took from others (payable)
  const payables = computed(() =>
    loans.value
      .filter((l) => l.type === 'payable')
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
  )

  const totalReceivable = computed(() =>
    receivables.value.reduce((sum, l) => sum + ((l.amount || 0) - (l.paidAmount || 0)), 0),
  )

  const totalPayable = computed(() =>
    payables.value.reduce((sum, l) => sum + ((l.amount || 0) - (l.paidAmount || 0)), 0),
  )

  function getUserLoansRef() {
    const uid = auth.currentUser?.uid
    if (!uid) return null
    return collection(firestore, `users/${uid}/loans`)
  }

  function listenLoans() {
    const loansRef = getUserLoansRef()
    if (!loansRef) return

    loading.value = true
    if (unsubscribe) unsubscribe()

    unsubscribe = onSnapshot(
      loansRef,
      (snapshot) => {
        loans.value = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        loading.value = false
      },
      (error) => {
        console.error('Error fetching loans:', error)
        loading.value = false
      },
    )
  }

  async function addLoan(loan) {
    const loansRef = getUserLoansRef()
    if (!loansRef) return
    const docData = {
      type: loan.type, // 'receivable' or 'payable'
      personName: loan.personName,
      amount: loan.amount || 0,
      paidAmount: 0,
      date: loan.date || new Date().toISOString().slice(0, 10),
      notes: loan.notes || '',
      payments: [],
      settled: false,
      createdAt: Date.now(),
    }
    const tempId = `temp_${Date.now()}`
    loans.value.unshift({ id: tempId, ...docData })

    addDoc(loansRef, docData)
      .then((ref) => {
        const idx = loans.value.findIndex((l) => l.id === tempId)
        if (idx >= 0) loans.value[idx].id = ref.id
      })
      .catch((err) => console.warn('[Firestore] Loan write queued:', err))
  }

  async function addPayment(loanId, payment) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const loan = loans.value.find((l) => l.id === loanId)
    if (!loan) return

    const newPayment = {
      amount: payment.amount,
      date: payment.date || new Date().toISOString().slice(0, 10),
      notes: payment.notes || '',
      accountId: payment.accountId || null,
      transactionId: payment.transactionId || null,
      createdAt: Date.now(),
    }

    const newPaidAmount = (loan.paidAmount || 0) + payment.amount
    const newPayments = [...(loan.payments || []), newPayment]
    const settled = newPaidAmount >= loan.amount

    // Optimistic update
    loan.paidAmount = newPaidAmount
    loan.payments = newPayments
    loan.settled = settled

    const loanRef = doc(firestore, `users/${uid}/loans/${loanId}`)
    updateDoc(loanRef, {
      paidAmount: newPaidAmount,
      payments: newPayments,
      settled,
    }).catch((err) => console.warn('[Firestore] Payment update queued:', err))
  }

  async function updatePayment(loanId, paymentIndex, updatedPayment) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const loan = loans.value.find((l) => l.id === loanId)
    if (!loan) return

    const newPayments = [...(loan.payments || [])]
    const oldAmount = newPayments[paymentIndex]?.amount || 0
    newPayments[paymentIndex] = { ...newPayments[paymentIndex], ...updatedPayment }
    const diff = (updatedPayment.amount || oldAmount) - oldAmount
    const newPaidAmount = (loan.paidAmount || 0) + diff
    const settled = newPaidAmount >= loan.amount

    loan.payments = newPayments
    loan.paidAmount = newPaidAmount
    loan.settled = settled

    const loanRef = doc(firestore, `users/${uid}/loans/${loanId}`)
    updateDoc(loanRef, { payments: newPayments, paidAmount: newPaidAmount, settled }).catch((err) =>
      console.warn('[Firestore] Payment update queued:', err),
    )
  }

  async function deletePayment(loanId, paymentIndex) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const loan = loans.value.find((l) => l.id === loanId)
    if (!loan) return

    const removedAmount = loan.payments[paymentIndex]?.amount || 0
    const newPayments = loan.payments.filter((_, i) => i !== paymentIndex)
    const newPaidAmount = (loan.paidAmount || 0) - removedAmount
    const settled = newPaidAmount >= loan.amount

    loan.payments = newPayments
    loan.paidAmount = newPaidAmount
    loan.settled = settled

    const loanRef = doc(firestore, `users/${uid}/loans/${loanId}`)
    updateDoc(loanRef, { payments: newPayments, paidAmount: newPaidAmount, settled }).catch((err) =>
      console.warn('[Firestore] Payment delete queued:', err),
    )
  }

  async function updateLoan(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const idx = loans.value.findIndex((l) => l.id === id)
    if (idx >= 0) Object.assign(loans.value[idx], data)

    const loanRef = doc(firestore, `users/${uid}/loans/${id}`)
    updateDoc(loanRef, data).catch((err) => console.warn('[Firestore] Loan update queued:', err))
  }

  async function deleteLoan(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    loans.value = loans.value.filter((l) => l.id !== id)

    deleteDoc(doc(firestore, `users/${uid}/loans/${id}`)).catch((err) =>
      console.warn('[Firestore] Loan delete queued:', err),
    )
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  function fetchLoans() {
    return new Promise((resolve) => {
      const loansRef = getUserLoansRef()
      if (!loansRef) {
        resolve()
        return
      }
      if (unsubscribe) unsubscribe()
      loading.value = true

      unsubscribe = onSnapshot(
        loansRef,
        (snapshot) => {
          loans.value = snapshot.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          loading.value = false
          resolve()
        },
        (error) => {
          console.error('Error fetching loans:', error)
          loading.value = false
          resolve()
        },
      )
    })
  }

  return {
    loans,
    loading,
    receivables,
    payables,
    totalReceivable,
    totalPayable,
    listenLoans,
    fetchLoans,
    addLoan,
    addPayment,
    updatePayment,
    deletePayment,
    updateLoan,
    deleteLoan,
    stopListening,
  }
})
