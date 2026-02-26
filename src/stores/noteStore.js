import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ref as dbRef, onValue, push, set, remove, update } from 'firebase/database'
import { database, auth } from 'boot/firebase'

export const useNoteStore = defineStore('notes', () => {
  const notes = ref([])
  const loading = ref(false)
  let unsubscribe = null

  function getUserNotesRef() {
    const uid = auth.currentUser?.uid
    if (!uid) return null
    return dbRef(database, `finance/users/${uid}/notes`)
  }

  function listenNotes() {
    const notesRef = getUserNotesRef()
    if (!notesRef) return

    loading.value = true
    if (unsubscribe) unsubscribe()

    unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        notes.value = Object.entries(data)
          .map(([id, val]) => ({ id, ...val }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      } else {
        notes.value = []
      }
      loading.value = false
    })
  }

  async function addNote(note) {
    const notesRef = getUserNotesRef()
    if (!notesRef) return
    const newRef = push(notesRef)
    await set(newRef, {
      title: note.title,
      description: note.description || '',
      pinned: false,
      createdAt: Date.now(),
    })
  }

  async function updateNote(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const noteRef = dbRef(database, `finance/users/${uid}/notes/${id}`)
    await update(noteRef, {
      title: data.title,
      description: data.description || '',
    })
  }

  async function deleteNote(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await remove(dbRef(database, `finance/users/${uid}/notes/${id}`))
  }

  async function togglePin(id, currentValue) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const noteRef = dbRef(database, `finance/users/${uid}/notes/${id}`)
    await update(noteRef, { pinned: !currentValue })
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    notes,
    loading,
    listenNotes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    stopListening,
  }
})
