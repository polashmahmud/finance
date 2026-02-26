import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMarketListStore = defineStore('marketLists', () => {
  const lists = ref([
    {
      id: 1,
      name: 'সাপ্তাহিক বাজার',
      date: '2026-02-26',
      items: [
        { id: 1, name: 'চাল (৫ কেজি)', quantity: 1, price: 350, bought: false },
        { id: 2, name: 'মুরগি (১ কেজি)', quantity: 2, price: 280, bought: true },
        { id: 3, name: 'সবজি', quantity: 1, price: 200, bought: false },
        { id: 4, name: 'তেল', quantity: 1, price: 180, bought: false },
        { id: 5, name: 'ডিম (১২টি)', quantity: 1, price: 150, bought: true },
      ],
    },
  ])

  function addList(list) {
    lists.value.push({
      ...list,
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      items: list.items || [],
    })
  }

  function deleteList(id) {
    lists.value = lists.value.filter((l) => l.id !== id)
  }

  function addItem(listId, item) {
    const list = lists.value.find((l) => l.id === listId)
    if (list) {
      list.items.push({ ...item, id: Date.now(), bought: false })
    }
  }

  function toggleBought(listId, itemId) {
    const list = lists.value.find((l) => l.id === listId)
    if (list) {
      const item = list.items.find((i) => i.id === itemId)
      if (item) item.bought = !item.bought
    }
  }

  function removeItem(listId, itemId) {
    const list = lists.value.find((l) => l.id === listId)
    if (list) {
      list.items = list.items.filter((i) => i.id !== itemId)
    }
  }

  function getListTotal(listId) {
    const list = lists.value.find((l) => l.id === listId)
    if (!list) return 0
    return list.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  return { lists, addList, deleteList, addItem, toggleBought, removeItem, getListTotal }
})
