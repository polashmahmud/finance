import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'
import { logError, logWarn } from 'src/utils/logger'

export const useOccasionGoalStore = defineStore('occasionGoals', () => {
  const goals = ref([])
  const loading = ref(false)
  let unsubscribe = null

  const activeGoals = computed(() =>
    goals.value
      .filter((g) => !g.completed)
      .sort((a, b) => (a.targetDate || '').localeCompare(b.targetDate || '')),
  )

  const completedGoals = computed(() =>
    goals.value
      .filter((g) => g.completed)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
  )

  const totalMonthlyNeeded = computed(() => {
    const now = new Date()
    let total = 0
    for (const goal of activeGoals.value) {
      if (!goal.targetDate) continue
      const target = new Date(goal.targetDate)
      const months =
        (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
      if (months <= 0) continue
      const remaining = (goal.targetAmount || 0) - (goal.currentSaved || 0)
      if (remaining > 0) total += remaining / months
    }
    return Math.ceil(total)
  })

  const upcomingGoals = computed(() => {
    const now = new Date()
    const limit = new Date(now)
    limit.setMonth(limit.getMonth() + 3)
    return activeGoals.value.filter((g) => {
      if (!g.targetDate) return false
      const d = new Date(g.targetDate)
      return d <= limit
    })
  })

  function getUserGoalsRef() {
    const uid = auth.currentUser?.uid
    if (!uid) return null
    return collection(firestore, `users/${uid}/occasionGoals`)
  }

  function listenGoals() {
    const goalsRef = getUserGoalsRef()
    if (!goalsRef) return
    loading.value = true
    if (unsubscribe) unsubscribe()

    unsubscribe = onSnapshot(
      goalsRef,
      (snapshot) => {
        goals.value = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.targetDate || '').localeCompare(b.targetDate || ''))
        loading.value = false
      },
      (error) => {
        logError('occasionGoalStore/listenGoals', error)
        loading.value = false
      },
    )
  }

  async function addGoal(goal) {
    const goalsRef = getUserGoalsRef()
    if (!goalsRef) return
    const docData = {
      name: goal.name,
      type: goal.type || 'custom',
      targetDate: goal.targetDate,
      targetAmount: goal.targetAmount || 0,
      currentSaved: 0,
      contributions: [],
      completed: false,
      createdAt: Date.now(),
    }
    const tempId = `temp_${Date.now()}`
    goals.value.push({ id: tempId, ...docData })

    addDoc(goalsRef, docData)
      .then((ref) => {
        const idx = goals.value.findIndex((g) => g.id === tempId)
        if (idx >= 0) goals.value[idx].id = ref.id
      })
      .catch((err) => logWarn('occasionGoalStore/addGoal', err))
  }

  async function updateGoal(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const idx = goals.value.findIndex((g) => g.id === id)
    if (idx >= 0) Object.assign(goals.value[idx], data)

    const goalRef = doc(firestore, `users/${uid}/occasionGoals/${id}`)
    updateDoc(goalRef, data).catch((err) => logWarn('occasionGoalStore/updateGoal', err))
  }

  async function deleteGoal(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    goals.value = goals.value.filter((g) => g.id !== id)

    deleteDoc(doc(firestore, `users/${uid}/occasionGoals/${id}`)).catch((err) =>
      logWarn('occasionGoalStore/deleteGoal', err),
    )
  }

  async function addContribution(goalId, contribution) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const goal = goals.value.find((g) => g.id === goalId)
    if (!goal) return

    const newContribution = {
      amount: contribution.amount,
      date: contribution.date || new Date().toISOString().slice(0, 10),
      notes: contribution.notes || '',
      createdAt: Date.now(),
    }

    const newSaved = (goal.currentSaved || 0) + contribution.amount
    const newContributions = [...(goal.contributions || []), newContribution]
    const completed = newSaved >= goal.targetAmount

    goal.currentSaved = newSaved
    goal.contributions = newContributions
    goal.completed = completed

    const goalRef = doc(firestore, `users/${uid}/occasionGoals/${goalId}`)
    updateDoc(goalRef, {
      currentSaved: newSaved,
      contributions: newContributions,
      completed,
    }).catch((err) => logWarn('occasionGoalStore/addContribution', err))
  }

  async function deleteContribution(goalId, contribIndex) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const goal = goals.value.find((g) => g.id === goalId)
    if (!goal) return

    const removedAmount = goal.contributions[contribIndex]?.amount || 0
    const newContributions = goal.contributions.filter((_, i) => i !== contribIndex)
    const newSaved = Math.max(0, (goal.currentSaved || 0) - removedAmount)
    const completed = newSaved >= goal.targetAmount

    goal.contributions = newContributions
    goal.currentSaved = newSaved
    goal.completed = completed

    const goalRef = doc(firestore, `users/${uid}/occasionGoals/${goalId}`)
    updateDoc(goalRef, {
      currentSaved: newSaved,
      contributions: newContributions,
      completed,
    }).catch((err) => logWarn('occasionGoalStore/deleteContribution', err))
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  function fetchGoals() {
    return new Promise((resolve) => {
      const goalsRef = getUserGoalsRef()
      if (!goalsRef) {
        resolve()
        return
      }
      if (unsubscribe) unsubscribe()
      loading.value = true

      unsubscribe = onSnapshot(
        goalsRef,
        (snapshot) => {
          goals.value = snapshot.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (a.targetDate || '').localeCompare(b.targetDate || ''))
          loading.value = false
          resolve()
        },
        (error) => {
          logError('occasionGoalStore/fetchGoals', error)
          loading.value = false
          resolve()
        },
      )
    })
  }

  return {
    goals,
    loading,
    activeGoals,
    completedGoals,
    totalMonthlyNeeded,
    upcomingGoals,
    listenGoals,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    deleteContribution,
    stopListening,
  }
})
