import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoryStore = defineStore('categories', () => {
  const incomeCategories = ref([
    { id: 1, name: 'Salary', icon: 'work', color: '#111111', subcategories: [] },
    {
      id: 2,
      name: 'Freelance',
      icon: 'laptop',
      color: '#333333',
      subcategories: ['Design', 'Development', 'Writing'],
    },
    {
      id: 3,
      name: 'Investment',
      icon: 'trending_up',
      color: '#555555',
      subcategories: ['Stocks', 'Crypto', 'Bonds'],
    },
    { id: 4, name: 'Gift', icon: 'card_giftcard', color: '#777777', subcategories: [] },
    { id: 5, name: 'Other Income', icon: 'attach_money', color: '#888888', subcategories: [] },
  ])

  const expenseCategories = ref([
    {
      id: 10,
      name: 'Food',
      icon: 'restaurant',
      color: '#111111',
      subcategories: ['Groceries', 'Restaurant', 'Snacks'],
      budget: 8000,
      recurring: 'monthly',
    },
    {
      id: 11,
      name: 'Transport',
      icon: 'directions_car',
      color: '#222222',
      subcategories: ['Fuel', 'Public Transport', 'Ride Share'],
      budget: 5000,
      recurring: 'monthly',
    },
    {
      id: 12,
      name: 'Shopping',
      icon: 'shopping_bag',
      color: '#333333',
      subcategories: ['Clothing', 'Electronics', 'Home'],
      budget: 10000,
      recurring: 'monthly',
    },
    {
      id: 13,
      name: 'Bills',
      icon: 'receipt',
      color: '#444444',
      subcategories: ['Electricity', 'Internet', 'Phone', 'Water'],
      budget: 6000,
      recurring: 'monthly',
    },
    {
      id: 14,
      name: 'Health',
      icon: 'local_hospital',
      color: '#555555',
      subcategories: ['Medicine', 'Doctor', 'Gym'],
      budget: 3000,
      recurring: 'monthly',
    },
    {
      id: 15,
      name: 'Entertainment',
      icon: 'movie',
      color: '#666666',
      subcategories: ['Movies', 'Games', 'Subscription'],
      budget: 2000,
      recurring: 'monthly',
    },
    {
      id: 16,
      name: 'Education',
      icon: 'school',
      color: '#777777',
      subcategories: ['Courses', 'Books', 'Tuition'],
      budget: 5000,
      recurring: 'monthly',
    },
    {
      id: 17,
      name: 'Other Expense',
      icon: 'more_horiz',
      color: '#888888',
      subcategories: [],
      budget: 3000,
      recurring: 'monthly',
    },
  ])

  function addIncomeCategory(cat) {
    incomeCategories.value.push({ ...cat, id: Date.now(), subcategories: cat.subcategories || [] })
  }

  function addExpenseCategory(cat) {
    expenseCategories.value.push({ ...cat, id: Date.now(), subcategories: cat.subcategories || [] })
  }

  function deleteCategory(type, id) {
    if (type === 'income') {
      incomeCategories.value = incomeCategories.value.filter((c) => c.id !== id)
    } else {
      expenseCategories.value = expenseCategories.value.filter((c) => c.id !== id)
    }
  }

  function updateBudget(categoryId, budget) {
    const cat = expenseCategories.value.find((c) => c.id === categoryId)
    if (cat) cat.budget = budget
  }

  return {
    incomeCategories,
    expenseCategories,
    addIncomeCategory,
    addExpenseCategory,
    deleteCategory,
    updateBudget,
  }
})
