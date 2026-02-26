import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoryStore = defineStore('categories', () => {
  const incomeCategories = ref([
    { id: 1, name: 'Salary', icon: 'work', color: '#4CAF50', subcategories: [] },
    {
      id: 2,
      name: 'Freelance',
      icon: 'laptop',
      color: '#2196F3',
      subcategories: ['Design', 'Development', 'Writing'],
    },
    {
      id: 3,
      name: 'Investment',
      icon: 'trending_up',
      color: '#FF9800',
      subcategories: ['Stocks', 'Crypto', 'Bonds'],
    },
    { id: 4, name: 'Gift', icon: 'card_giftcard', color: '#E91E63', subcategories: [] },
    { id: 5, name: 'Other Income', icon: 'attach_money', color: '#9C27B0', subcategories: [] },
  ])

  const expenseCategories = ref([
    {
      id: 10,
      name: 'Food',
      icon: 'restaurant',
      color: '#FF5722',
      subcategories: ['Groceries', 'Restaurant', 'Snacks'],
      budget: 8000,
      recurring: 'monthly',
    },
    {
      id: 11,
      name: 'Transport',
      icon: 'directions_car',
      color: '#607D8B',
      subcategories: ['Fuel', 'Public Transport', 'Ride Share'],
      budget: 5000,
      recurring: 'monthly',
    },
    {
      id: 12,
      name: 'Shopping',
      icon: 'shopping_bag',
      color: '#9C27B0',
      subcategories: ['Clothing', 'Electronics', 'Home'],
      budget: 10000,
      recurring: 'monthly',
    },
    {
      id: 13,
      name: 'Bills',
      icon: 'receipt',
      color: '#F44336',
      subcategories: ['Electricity', 'Internet', 'Phone', 'Water'],
      budget: 6000,
      recurring: 'monthly',
    },
    {
      id: 14,
      name: 'Health',
      icon: 'local_hospital',
      color: '#E91E63',
      subcategories: ['Medicine', 'Doctor', 'Gym'],
      budget: 3000,
      recurring: 'monthly',
    },
    {
      id: 15,
      name: 'Entertainment',
      icon: 'movie',
      color: '#FF9800',
      subcategories: ['Movies', 'Games', 'Subscription'],
      budget: 2000,
      recurring: 'monthly',
    },
    {
      id: 16,
      name: 'Education',
      icon: 'school',
      color: '#3F51B5',
      subcategories: ['Courses', 'Books', 'Tuition'],
      budget: 5000,
      recurring: 'monthly',
    },
    {
      id: 17,
      name: 'Other Expense',
      icon: 'more_horiz',
      color: '#795548',
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
