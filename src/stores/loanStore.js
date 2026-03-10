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

  const loanEntries = computed(() =>
    loans.value
      .filter((l) => l.type === 'loan')
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
  )

  const totalLoanAmount = computed(() =>
    loanEntries.value.reduce(
      (sum, l) => sum + ((l.totalAmount || l.amount || 0) - (l.paidAmount || 0)),
      0,
    ),
  )

  const thisMonthDue = computed(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    let total = 0
    for (const loan of loanEntries.value) {
      if (loan.settled || !loan.installments) continue
      for (const inst of loan.installments) {
        if (inst.paid) continue
        const d = new Date(inst.dueDate)
        if (d.getFullYear() === y && d.getMonth() === m) {
          total += (inst.amount || 0) - (inst.paidAmount || 0)
        }
      }
    }
    return total
  })

  const thisMonthDueCount = computed(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    let count = 0
    for (const loan of loanEntries.value) {
      if (loan.settled || !loan.installments) continue
      for (const inst of loan.installments) {
        if (inst.paid) continue
        const d = new Date(inst.dueDate)
        if (d.getFullYear() === y && d.getMonth() === m) count++
      }
    }
    return count
  })

  const thisMonthDueList = computed(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    const items = []
    for (const loan of loanEntries.value) {
      if (loan.settled || !loan.installments) continue
      for (const inst of loan.installments) {
        if (inst.paid) continue
        const d = new Date(inst.dueDate)
        if (d.getFullYear() === y && d.getMonth() === m) {
          items.push({
            personName: loan.personName,
            installmentNumber: inst.number,
            dueDate: inst.dueDate,
            amount: (inst.amount || 0) - (inst.paidAmount || 0),
          })
        }
      }
    }
    items.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    return items
  })

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

  function generateInstallmentDates(startDate, count, frequency) {
    const dates = []
    const start = new Date(startDate)
    for (let i = 1; i <= count; i++) {
      const d = new Date(start)
      switch (frequency) {
        case 'daily':
          d.setDate(d.getDate() + i)
          break
        case 'weekly':
          d.setDate(d.getDate() + i * 7)
          break
        case 'monthly':
          d.setMonth(d.getMonth() + i)
          break
        case 'yearly':
          d.setFullYear(d.getFullYear() + i)
          break
      }
      dates.push(d.toISOString().slice(0, 10))
    }
    return dates
  }

  async function addLoanWithInstallments(loanData) {
    const loansRef = getUserLoansRef()
    if (!loansRef) return

    const principal = loanData.amount || 0
    const rate = loanData.interestRate || 0
    const totalInterest = (principal * rate) / 100
    const totalAmount = principal + totalInterest
    const count = loanData.installmentCount || 1
    const frequency = loanData.installmentFrequency || 'monthly'

    const dueDates = generateInstallmentDates(loanData.date, count, frequency)
    const installmentAmount = Math.floor((totalAmount / count) * 100) / 100

    const installments = dueDates.map((dueDate, idx) => ({
      number: idx + 1,
      amount:
        idx === count - 1
          ? Math.round((totalAmount - installmentAmount * (count - 1)) * 100) / 100
          : installmentAmount,
      dueDate,
      paid: false,
      paidAmount: 0,
      paidDate: null,
    }))

    const docData = {
      type: 'loan',
      personName: loanData.personName,
      amount: principal,
      interestRate: rate,
      totalAmount,
      installmentCount: count,
      installmentFrequency: frequency,
      accountId: loanData.accountId,
      date: loanData.date || new Date().toISOString().slice(0, 10),
      notes: loanData.notes || '',
      installments,
      paidAmount: 0,
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

  function recalculateInstallments(loan) {
    const principal = loan.amount || 0
    const rate = loan.interestRate || 0
    const originalTotal = principal * (1 + rate / 100)
    const totalPaid = (loan.installments || []).reduce(
      (sum, inst) => sum + (inst.paid ? inst.paidAmount : 0),
      0,
    )

    const paidPrincipalPortion =
      originalTotal > 0 ? totalPaid * (principal / originalTotal) : totalPaid
    const remainingPrincipal = Math.max(0, principal - paidPrincipalPortion)
    const newRemainingInterest = (remainingPrincipal * rate) / 100
    const newRemainingTotal = remainingPrincipal + newRemainingInterest

    const unpaidInstallments = (loan.installments || []).filter((inst) => !inst.paid)
    const unpaidCount = unpaidInstallments.length

    if (unpaidCount === 0) {
      loan.totalAmount = totalPaid
      return
    }

    const perInstallment = Math.floor((newRemainingTotal / unpaidCount) * 100) / 100
    unpaidInstallments.forEach((inst, idx) => {
      inst.amount =
        idx === unpaidCount - 1
          ? Math.round((newRemainingTotal - perInstallment * (unpaidCount - 1)) * 100) / 100
          : perInstallment
    })

    loan.totalAmount = totalPaid + newRemainingTotal
  }

  // Add a (partial) payment to an installment.
  // markAsPaid: if true, or if cumulativePaid >= scheduledAmount, mark inst.paid = true
  async function addInstallmentPayment(loanId, installmentIndex, paymentData, markAsPaid) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const loan = loans.value.find((l) => l.id === loanId)
    if (!loan || !loan.installments) return

    const inst = loan.installments[installmentIndex]
    if (!inst) return

    if (!inst.payments) inst.payments = []
    inst.payments.push({
      amount: paymentData.amount,
      date: paymentData.date || new Date().toISOString().slice(0, 10),
      notes: paymentData.notes || '',
      accountId: paymentData.accountId || null,
      createdAt: Date.now(),
    })

    const cumulative = inst.payments.reduce((s, p) => s + (p.amount || 0), 0)
    inst.paidAmount = cumulative

    const shouldMarkPaid = markAsPaid || cumulative >= inst.amount
    if (shouldMarkPaid && !inst.paid) {
      inst.paid = true
      inst.paidDate = new Date().toISOString().slice(0, 10)
    }

    recalculateInstallments(loan)

    const newPaidAmount = loan.installments.reduce((sum, i) => sum + (i.paidAmount || 0), 0)
    loan.paidAmount = newPaidAmount

    const allPaid = loan.installments.every((i) => i.paid)
    loan.settled = allPaid || newPaidAmount >= loan.totalAmount

    const loanRef = doc(firestore, `users/${uid}/loans/${loanId}`)
    updateDoc(loanRef, {
      installments: loan.installments,
      totalAmount: loan.totalAmount,
      paidAmount: loan.paidAmount,
      settled: loan.settled,
    }).catch((err) => console.warn('[Firestore] Installment payment queued:', err))
  }

  // Reset an installment to unpaid state (clear all sub-payments)
  async function resetInstallment(loanId, installmentIndex) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const loan = loans.value.find((l) => l.id === loanId)
    if (!loan || !loan.installments) return

    const inst = loan.installments[installmentIndex]
    if (!inst) return

    const removedAmount = inst.paidAmount || 0
    inst.payments = []
    inst.paidAmount = 0
    inst.paid = false
    inst.paidDate = null

    const newPaidAmount = Math.max(0, (loan.paidAmount || 0) - removedAmount)
    loan.paidAmount = newPaidAmount
    loan.settled = false
    recalculateInstallments(loan)

    const loanRef = doc(firestore, `users/${uid}/loans/${loanId}`)
    updateDoc(loanRef, {
      installments: loan.installments,
      totalAmount: loan.totalAmount,
      paidAmount: loan.paidAmount,
      settled: loan.settled,
    }).catch((err) => console.warn('[Firestore] Installment reset queued:', err))
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
    loanEntries,
    totalReceivable,
    totalPayable,
    totalLoanAmount,
    thisMonthDue,
    thisMonthDueCount,
    thisMonthDueList,
    listenLoans,
    fetchLoans,
    addLoan,
    addLoanWithInstallments,
    addPayment,
    updatePayment,
    deletePayment,
    addInstallmentPayment,
    resetInstallment,
    updateLoan,
    deleteLoan,
    stopListening,
  }
})
