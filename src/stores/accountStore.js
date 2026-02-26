import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref([
    {
      id: 1,
      name: 'নগদ',
      type: 'Cash',
      balance: 5000,
      icon: 'account_balance_wallet',
      color: '#4CAF50',
      lastActivity: '2026-02-25',
    },
    {
      id: 2,
      name: 'ব্যাংক অ্যাকাউন্ট',
      type: 'Bank',
      balance: 25000,
      icon: 'account_balance',
      color: '#1976D2',
      lastActivity: '2026-02-24',
    },
    {
      id: 3,
      name: 'বিকাশ',
      type: 'Mobile Banking',
      balance: 3500,
      icon: 'phone_android',
      color: '#E91E63',
      lastActivity: '2026-02-26',
    },
  ])

  const totalBalance = computed(() => accounts.value.reduce((sum, a) => sum + a.balance, 0))

  function addAccount(account) {
    accounts.value.push({
      ...account,
      id: Date.now(),
      lastActivity: new Date().toISOString().slice(0, 10),
    })
  }

  function updateBalance(accountId, amount) {
    const acc = accounts.value.find((a) => a.id === accountId)
    if (acc) {
      acc.balance += amount
      acc.lastActivity = new Date().toISOString().slice(0, 10)
    }
  }

  function deleteAccount(accountId) {
    accounts.value = accounts.value.filter((a) => a.id !== accountId)
  }

  return { accounts, totalBalance, addAccount, updateBalance, deleteAccount }
})
