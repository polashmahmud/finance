import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
} from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'

export const useMarketListStore = defineStore('marketLists', () => {
  const lists = ref([])
  const loading = ref(false)
  let unsubscribe = null

  function getUserListsRef() {
    const uid = auth.currentUser?.uid
    if (!uid) return null
    return collection(firestore, `users/${uid}/marketLists`)
  }

  function listenLists() {
    const listsRef = getUserListsRef()
    if (!listsRef) return

    loading.value = true
    if (unsubscribe) unsubscribe()

    unsubscribe = onSnapshot(
      listsRef,
      (snapshot) => {
        lists.value = snapshot.docs
          .map((docSnap) => {
            const val = docSnap.data()
            const items = val.items
              ? Object.entries(val.items).map(([itemId, itemVal]) => ({ id: itemId, ...itemVal }))
              : []
            return {
              id: docSnap.id,
              name: val.name,
              date: val.date,
              createdAt: val.createdAt || 0,
              convertedAt: val.convertedAt || null,
              items,
            }
          })
          .sort((a, b) => b.createdAt - a.createdAt)
        loading.value = false
      },
      (error) => {
        console.error('Error fetching market lists:', error)
        loading.value = false
      },
    )
  }

  async function addList(data) {
    const listsRef = getUserListsRef()
    if (!listsRef) return null
    const uid = auth.currentUser?.uid
    if (!uid) return null
    // Pre-generate doc ref so we can return the ID even when offline
    const newDocRef = doc(listsRef)
    const docData = {
      name: data.name,
      date: new Date().toISOString().slice(0, 10),
      createdAt: Date.now(),
      items: {},
    }
    // Optimistic update
    lists.value.unshift({
      id: newDocRef.id,
      name: docData.name,
      date: docData.date,
      createdAt: docData.createdAt,
      convertedAt: null,
      items: [],
    })

    setDoc(newDocRef, docData).catch((err) => console.warn('[Firestore] List write queued:', err))
    return newDocRef.id
  }

  async function deleteList(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic removal
    lists.value = lists.value.filter((l) => l.id !== id)

    deleteDoc(doc(firestore, `users/${uid}/marketLists/${id}`)).catch((err) =>
      console.warn('[Firestore] List delete queued:', err),
    )
  }

  async function updateList(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic update
    const idx = lists.value.findIndex((l) => l.id === id)
    if (idx >= 0) Object.assign(lists.value[idx], data)

    updateDoc(doc(firestore, `users/${uid}/marketLists/${id}`), data).catch((err) =>
      console.warn('[Firestore] List update queued:', err),
    )
  }

  async function updateItem(listId, itemId, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const updates = {}
    for (const key in data) {
      updates[`items.${itemId}.${key}`] = data[key]
    }

    // Optimistic update
    const list = lists.value.find((l) => l.id === listId)
    if (list) {
      const item = list.items.find((i) => i.id === itemId)
      if (item) Object.assign(item, data)
    }

    updateDoc(doc(firestore, `users/${uid}/marketLists/${listId}`), updates).catch((err) =>
      console.warn('[Firestore] Item update queued:', err),
    )
  }

  async function addItem(listId, item) {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const itemId = Date.now().toString()
    const itemData = {
      name: item.name,
      quantity: item.quantity || '',
      price: item.price || 0,
      bought: false,
    }

    // Optimistic update
    const list = lists.value.find((l) => l.id === listId)
    if (list) {
      list.items.push({ id: itemId, ...itemData })
    }

    const updates = { [`items.${itemId}`]: itemData }
    updateDoc(doc(firestore, `users/${uid}/marketLists/${listId}`), updates).catch((err) =>
      console.warn('[Firestore] Item add queued:', err),
    )
  }

  async function toggleBought(listId, itemId, currentValue) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic update
    const list = lists.value.find((l) => l.id === listId)
    if (list) {
      const item = list.items.find((i) => i.id === itemId)
      if (item) item.bought = !currentValue
    }

    updateDoc(doc(firestore, `users/${uid}/marketLists/${listId}`), {
      [`items.${itemId}.bought`]: !currentValue,
    }).catch((err) => console.warn('[Firestore] Toggle bought queued:', err))
  }

  async function removeItem(listId, itemId) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic removal
    const list = lists.value.find((l) => l.id === listId)
    if (list) {
      list.items = list.items.filter((i) => i.id !== itemId)
    }

    updateDoc(doc(firestore, `users/${uid}/marketLists/${listId}`), {
      [`items.${itemId}`]: deleteField(),
    }).catch((err) => console.warn('[Firestore] Item remove queued:', err))
  }

  function getListTotal(listId) {
    const list = lists.value.find((l) => l.id === listId)
    if (!list) return 0
    return list.items.reduce((sum, item) => sum + (item.price || 0), 0)
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    lists,
    loading,
    listenLists,
    addList,
    updateList,
    deleteList,
    addItem,
    updateItem,
    toggleBought,
    removeItem,
    getListTotal,
    stopListening,
  }
})
