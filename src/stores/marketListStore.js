import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
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
    const docRef = await addDoc(listsRef, {
      name: data.name,
      date: new Date().toISOString().slice(0, 10),
      createdAt: Date.now(),
      items: {},
    })
    return docRef.id
  }

  async function deleteList(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await deleteDoc(doc(firestore, `users/${uid}/marketLists/${id}`))
  }

  async function updateList(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await updateDoc(doc(firestore, `users/${uid}/marketLists/${id}`), data)
  }

  async function updateItem(listId, itemId, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const updates = {}
    for (const key in data) {
      updates[`items.${itemId}.${key}`] = data[key]
    }

    await updateDoc(doc(firestore, `users/${uid}/marketLists/${listId}`), updates)
  }

  async function addItem(listId, item) {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const itemId = Date.now().toString()

    const updates = {
      [`items.${itemId}`]: {
        name: item.name,
        quantity: item.quantity || '',
        price: item.price || 0,
        bought: false,
      },
    }

    await updateDoc(doc(firestore, `users/${uid}/marketLists/${listId}`), updates)
  }

  async function toggleBought(listId, itemId, currentValue) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await updateDoc(doc(firestore, `users/${uid}/marketLists/${listId}`), {
      [`items.${itemId}.bought`]: !currentValue,
    })
  }

  async function removeItem(listId, itemId) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await updateDoc(doc(firestore, `users/${uid}/marketLists/${listId}`), {
      [`items.${itemId}`]: deleteField(),
    })
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
