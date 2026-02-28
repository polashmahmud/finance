import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ref as dbRef, onValue, push, set, remove, update } from 'firebase/database'
import { database, auth } from 'boot/firebase'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref([])
  const loading = ref(false)
  let unsubscribe = null

  const incomeCategories = computed(() => categories.value.filter((c) => c.type === 'income'))
  const expenseCategories = computed(() => categories.value.filter((c) => c.type === 'expense'))

  function getUserCategoriesRef() {
    const uid = auth.currentUser?.uid
    if (!uid) return null
    return dbRef(database, `finance/users/${uid}/categories`)
  }

  function listenCategories() {
    const catRef = getUserCategoriesRef()
    if (!catRef) return

    loading.value = true

    // Clean up any previous listener
    if (unsubscribe) unsubscribe()

    unsubscribe = onValue(catRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        categories.value = Object.entries(data).map(([id, val]) => ({ id, ...val }))
      } else {
        categories.value = []
      }
      loading.value = false
    })
  }

  async function addCategory(cat) {
    const catRef = getUserCategoriesRef()
    if (!catRef) return
    const newRef = push(catRef)
    await set(newRef, {
      type: cat.type,
      name: cat.name,
      icon: cat.icon || 'category',
      color: cat.color || '#111111',
      budget: cat.budget || 0,
    })
  }

  async function updateCategory(id, cat) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const catRef = dbRef(database, `finance/users/${uid}/categories/${id}`)
    await update(catRef, {
      type: cat.type,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      budget: cat.budget || 0,
    })
  }

  async function deleteCategory(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const catRef = dbRef(database, `finance/users/${uid}/categories/${id}`)
    await remove(catRef)
  }

  async function setMonthlyBudget(categoryId, yearMonth, amount) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const budgetRef = dbRef(
      database,
      `finance/users/${uid}/categories/${categoryId}/budgets/${yearMonth}`,
    )
    await set(budgetRef, amount)
  }

  function getMonthlyBudget(category, yearMonth) {
    if (!category.budgets || !category.budgets[yearMonth]) return null
    return category.budgets[yearMonth]
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    categories,
    incomeCategories,
    expenseCategories,
    loading,
    listenCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    setMonthlyBudget,
    getMonthlyBudget,
    stopListening,
  }
})
