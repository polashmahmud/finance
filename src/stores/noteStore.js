import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNoteStore = defineStore('notes', () => {
  const notes = ref([
    {
      id: 1,
      title: 'Budget Plan',
      description: 'Review monthly budget allocations and adjust for next month.',
      pinned: true,
      transactionId: null,
      createdAt: '2026-02-20',
    },
    {
      id: 2,
      title: 'Investment Ideas',
      description: 'Look into index funds and fixed deposits for savings.',
      pinned: false,
      transactionId: null,
      createdAt: '2026-02-22',
    },
    {
      id: 3,
      title: 'Salary Discussion',
      description: 'Discuss salary revision in March meeting.',
      pinned: false,
      transactionId: 1,
      createdAt: '2026-02-25',
    },
  ])

  function addNote(note) {
    notes.value.push({
      ...note,
      id: Date.now(),
      pinned: false,
      createdAt: new Date().toISOString().slice(0, 10),
    })
  }

  function deleteNote(id) {
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  function togglePin(id) {
    const note = notes.value.find((n) => n.id === id)
    if (note) note.pinned = !note.pinned
  }

  function updateNote(id, updates) {
    const note = notes.value.find((n) => n.id === id)
    if (note) Object.assign(note, updates)
  }

  return { notes, addNote, deleteNote, togglePin, updateNote }
})
