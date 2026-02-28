import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ref as dbRef, onValue, push, set, remove, update } from 'firebase/database'
import { database, auth } from 'boot/firebase'

export const useMarketListStore = defineStore('marketLists', () => {
  const lists = ref([])
  const loading = ref(false)
  let unsubscribe = null

  function getUserListsRef() {
    const uid = auth.currentUser?.uid
    if (!uid) return null
    return dbRef(database, `finance/users/${uid}/marketLists`)
  }

  function listenLists() {
    const listsRef = getUserListsRef()
    if (!listsRef) return

    loading.value = true
    if (unsubscribe) unsubscribe()

    unsubscribe = onValue(listsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        lists.value = Object.entries(data)
          .map(([id, val]) => {
            const items = val.items
              ? Object.entries(val.items).map(([itemId, itemVal]) => ({ id: itemId, ...itemVal }))
              : []
            return { id, name: val.name, date: val.date, createdAt: val.createdAt || 0, items }
          })
          .sort((a, b) => b.createdAt - a.createdAt)
      } else {
        lists.value = []
      }
      loading.value = false
    })
  }

  async function addList(data) {
    const listsRef = getUserListsRef()
    if (!listsRef) return null
    const newRef = push(listsRef)
    await set(newRef, {
      name: data.name,
      date: new Date().toISOString().slice(0, 10),
      createdAt: Date.now(),
    })
    return newRef.key
  }

  async function deleteList(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await remove(dbRef(database, `finance/users/${uid}/marketLists/${id}`))
  }

  async function updateList(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await update(dbRef(database, `finance/users/${uid}/marketLists/${id}`), data)
  }

  async function updateItem(listId, itemId, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await update(
      dbRef(database, `finance/users/${uid}/marketLists/${listId}/items/${itemId}`),
      data,
    )
  }

  async function addItem(listId, item) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const itemsRef = dbRef(database, `finance/users/${uid}/marketLists/${listId}/items`)
    const newRef = push(itemsRef)
    await set(newRef, {
      name: item.name,
      quantity: item.quantity || '',
      price: item.price || 0,
      bought: false,
    })
  }

  async function toggleBought(listId, itemId, currentValue) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const itemRef = dbRef(database, `finance/users/${uid}/marketLists/${listId}/items/${itemId}`)
    await update(itemRef, { bought: !currentValue })
  }

  async function removeItem(listId, itemId) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await remove(dbRef(database, `finance/users/${uid}/marketLists/${listId}/items/${itemId}`))
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
