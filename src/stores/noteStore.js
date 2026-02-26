import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNoteStore = defineStore('notes', () => {
  const notes = ref([
    {
      id: 1,
      title: 'বাজেট পরিকল্পনা',
      description: 'মাসিক বাজেট বরাদ্দ পর্যালোচনা এবং পরবর্তী মাসের জন্য সমন্বয় করুন।',
      pinned: true,
      transactionId: null,
      createdAt: '2026-02-20',
    },
    {
      id: 2,
      title: 'বিনিয়োগের ধারণা',
      description: 'সঞ্চয়ের জন্য ইনডেক্স ফান্ড এবং ফিক্সড ডিপোজিট দেখুন।',
      pinned: false,
      transactionId: null,
      createdAt: '2026-02-22',
    },
    {
      id: 3,
      title: 'বেতন আলোচনা',
      description: 'মার্চ মিটিংয়ে বেতন সংশোধন নিয়ে আলোচনা করুন।',
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
