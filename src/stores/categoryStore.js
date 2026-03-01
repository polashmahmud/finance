import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'

function offlineWrite(operation) {
  if (!navigator.onLine) {
    operation().catch((err) => console.warn('[Offline] Write queued for sync:', err))
    return Promise.resolve()
  }
  return operation()
}

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref([])
  const loading = ref(false)
  let unsubscribe = null

  const incomeCategories = computed(() => categories.value.filter((c) => c.type === 'income'))
  const expenseCategories = computed(() => categories.value.filter((c) => c.type === 'expense'))

  function getUserCategoriesRef() {
    const uid = auth.currentUser?.uid
    if (!uid) return null
    return collection(firestore, `users/${uid}/categories`)
  }

  function listenCategories() {
    const catRef = getUserCategoriesRef()
    if (!catRef) return

    loading.value = true

    // Clean up any previous listener
    if (unsubscribe) unsubscribe()

    unsubscribe = onSnapshot(
      catRef,
      (snapshot) => {
        categories.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        loading.value = false
      },
      (error) => {
        console.error('Error fetching categories:', error)
        loading.value = false
      },
    )
  }

  async function addCategory(cat) {
    const catRef = getUserCategoriesRef()
    if (!catRef) return
    await offlineWrite(() =>
      addDoc(catRef, {
        type: cat.type,
        name: cat.name,
        icon: cat.icon || 'category',
        color: cat.color || '#111111',
        budget: cat.budget || 0,
      }),
    )
  }

  async function updateCategory(id, cat) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const catRef = doc(firestore, `users/${uid}/categories/${id}`)
    await offlineWrite(() =>
      updateDoc(catRef, {
        type: cat.type,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        budget: cat.budget || 0,
      }),
    )
  }

  async function deleteCategory(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const catRef = doc(firestore, `users/${uid}/categories/${id}`)
    await offlineWrite(() => deleteDoc(catRef))
  }

  async function setMonthlyBudget(categoryId, yearMonth, amount) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const catRef = doc(firestore, `users/${uid}/categories/${categoryId}`)
    await offlineWrite(() =>
      updateDoc(catRef, {
        [`budgets.${yearMonth}`]: amount,
      }),
    )
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
