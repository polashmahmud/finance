import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'
import { logError, logWarn } from 'src/utils/logger'

export const useNoteStore = defineStore('notes', () => {
  const notes = ref([])
  const loading = ref(false)
  let unsubscribe = null

  function getUserNotesRef() {
    const uid = auth.currentUser?.uid
    if (!uid) return null
    return collection(firestore, `users/${uid}/notes`)
  }

  function listenNotes() {
    const notesRef = getUserNotesRef()
    if (!notesRef) return

    loading.value = true
    if (unsubscribe) unsubscribe()

    unsubscribe = onSnapshot(
      notesRef,
      (snapshot) => {
        notes.value = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        loading.value = false
      },
      (error) => {
        logError('noteStore/listenNotes', error)
        loading.value = false
      },
    )
  }

  async function addNote(note) {
    const notesRef = getUserNotesRef()
    if (!notesRef) return
    const docData = {
      title: note.title,
      description: note.description || '',
      pinned: false,
      createdAt: Date.now(),
    }
    // Optimistic update
    const tempId = `temp_${Date.now()}`
    notes.value.unshift({ id: tempId, ...docData })

    addDoc(notesRef, docData)
      .then((ref) => {
        const idx = notes.value.findIndex((n) => n.id === tempId)
        if (idx >= 0) notes.value[idx].id = ref.id
      })
      .catch((err) => logWarn('noteStore/addNote', err))
  }

  async function updateNote(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic update
    const idx = notes.value.findIndex((n) => n.id === id)
    if (idx >= 0) {
      notes.value[idx].title = data.title
      notes.value[idx].description = data.description || ''
    }

    const noteRef = doc(firestore, `users/${uid}/notes/${id}`)
    updateDoc(noteRef, {
      title: data.title,
      description: data.description || '',
    }).catch((err) => logWarn('noteStore/updateNote', err))
  }

  async function deleteNote(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic removal
    notes.value = notes.value.filter((n) => n.id !== id)

    deleteDoc(doc(firestore, `users/${uid}/notes/${id}`)).catch((err) =>
      logWarn('noteStore/deleteNote', err),
    )
  }

  async function togglePin(id, currentValue) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    // Optimistic update
    const note = notes.value.find((n) => n.id === id)
    if (note) note.pinned = !currentValue

    const noteRef = doc(firestore, `users/${uid}/notes/${id}`)
    updateDoc(noteRef, { pinned: !currentValue }).catch((err) =>
      logWarn('noteStore/togglePin', err),
    )
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
