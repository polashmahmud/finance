import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref([
    {
      id: 1,
      type: 'income',
      amount: 50000,
      category: 'Salary',
      subcategory: '',
      accountId: 2,
      date: '2026-02-01',
      time: '09:00',
      notes: 'Monthly salary',
    },
    {
      id: 2,
      type: 'expense',
      amount: 1200,
      category: 'Food',
      subcategory: 'Groceries',
      accountId: 1,
      date: '2026-02-20',
      time: '18:30',
      notes: 'Weekly groceries',
    },
    {
      id: 3,
      type: 'expense',
      amount: 5000,
      category: 'Transport',
      subcategory: 'Fuel',
      accountId: 2,
      date: '2026-02-22',
      time: '10:00',
      notes: 'Fuel refill',
    },
    {
      id: 4,
      type: 'expense',
      amount: 800,
      category: 'Food',
      subcategory: 'Restaurant',
      accountId: 1,
      date: '2026-02-24',
      time: '13:00',
      notes: 'Lunch',
    },
    {
      id: 5,
      type: 'income',
      amount: 3000,
      category: 'Freelance',
      subcategory: '',
      accountId: 3,
      date: '2026-02-25',
      time: '15:00',
      notes: 'Logo design',
    },
    {
      id: 6,
      type: 'expense',
      amount: 2500,
      category: 'Shopping',
      subcategory: 'Clothing',
      accountId: 2,
      date: '2026-02-25',
      time: '17:00',
      notes: 'Winter jacket',
    },
    {
      id: 7,
      type: 'transfer',
      amount: 5000,
      fromAccountId: 2,
      toAccountId: 1,
      fee: 0,
      date: '2026-02-23',
      time: '11:00',
      notes: 'ATM withdrawal',
    },
  ])

  const totalIncome = computed(() =>
    transactions.value.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
  )

  const totalExpense = computed(() =>
    transactions.value.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
  )

  const recentTransactions = computed(() =>
    [...transactions.value]
      .filter((t) => t.type !== 'transfer')
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
      .slice(0, 10),
  )

  function addTransaction(tx) {
    transactions.value.push({ ...tx, id: Date.now() })
  }

  function deleteTransaction(id) {
    transactions.value = transactions.value.filter((t) => t.id !== id)
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

  return {
    transactions,
    totalIncome,
    totalExpense,
    recentTransactions,
    addTransaction,
    deleteTransaction,
    searchTransactions,
  }
})
