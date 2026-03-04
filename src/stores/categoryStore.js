import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'

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
    const docData = {
      type: cat.type,
      name: cat.name,
      icon: cat.icon || 'category',
      color: cat.color || '#111111',
      budget: cat.budget || 0,
    }
    // Optimistic update
    const tempId = `temp_${Date.now()}`
    categories.value.push({ id: tempId, ...docData })

    addDoc(catRef, docData)
      .then((ref) => {
        const idx = categories.value.findIndex((c) => c.id === tempId)
        if (idx >= 0) categories.value[idx].id = ref.id
      })
      .catch((err) => console.warn('[Firestore] Category write queued:', err))
  }

  async function updateCategory(id, cat) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic update
    const idx = categories.value.findIndex((c) => c.id === id)
    if (idx >= 0) {
      Object.assign(categories.value[idx], {
        type: cat.type,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        budget: cat.budget || 0,
      })
    }

    const catRef = doc(firestore, `users/${uid}/categories/${id}`)
    updateDoc(catRef, {
      type: cat.type,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      budget: cat.budget || 0,
    }).catch((err) => console.warn('[Firestore] Category update queued:', err))
  }

  async function deleteCategory(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic removal
    categories.value = categories.value.filter((c) => c.id !== id)

    const catRef = doc(firestore, `users/${uid}/categories/${id}`)
    deleteDoc(catRef).catch((err) => console.warn('[Firestore] Category delete queued:', err))
  }

  async function setMonthlyBudget(categoryId, yearMonth, amount) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic update
    const cat = categories.value.find((c) => c.id === categoryId)
    if (cat) {
      if (!cat.budgets) cat.budgets = {}
      cat.budgets[yearMonth] = amount
    }

    const catRef = doc(firestore, `users/${uid}/categories/${categoryId}`)
    updateDoc(catRef, {
      [`budgets.${yearMonth}`]: amount,
    }).catch((err) => console.warn('[Firestore] Budget update queued:', err))
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

  // Fetch categories - stops existing listener and starts fresh one, returns promise that resolves when loaded
  function fetchCategories() {
    return new Promise((resolve) => {
      const catRef = getUserCategoriesRef()
      if (!catRef) {
        resolve()
        return
      }

      // Stop existing listener
      if (unsubscribe) unsubscribe()

      loading.value = true

      // Set up new listener
      unsubscribe = onSnapshot(
        catRef,
        (snapshot) => {
          categories.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          loading.value = false
          resolve() // Resolve promise when data is loaded
        },
        (error) => {
          console.error('Error fetching categories:', error)
          loading.value = false
          resolve() // Resolve anyway to not block the UI
        },
      )
    })
  }

  return {
    categories,
    incomeCategories,
    expenseCategories,
    loading,
    listenCategories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    setMonthlyBudget,
    getMonthlyBudget,
    stopListening,
  }
})
