import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'

function offlineWrite(operation) {
  if (!navigator.onLine) {
    operation().catch((err) => console.warn('[Offline] Write queued for sync:', err))
    return Promise.resolve()
  }
  return operation()
}

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
        console.error('Error fetching notes:', error)
        loading.value = false
      },
    )
  }

  async function addNote(note) {
    const notesRef = getUserNotesRef()
    if (!notesRef) return
    await offlineWrite(() =>
      addDoc(notesRef, {
        title: note.title,
        description: note.description || '',
        pinned: false,
        createdAt: Date.now(),
      }),
    )
  }

  async function updateNote(id, data) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const noteRef = doc(firestore, `users/${uid}/notes/${id}`)
    await offlineWrite(() =>
      updateDoc(noteRef, {
        title: data.title,
        description: data.description || '',
      }),
    )
  }

  async function deleteNote(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await offlineWrite(() => deleteDoc(doc(firestore, `users/${uid}/notes/${id}`)))
  }

  async function togglePin(id, currentValue) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const noteRef = doc(firestore, `users/${uid}/notes/${id}`)
    await offlineWrite(() => updateDoc(noteRef, { pinned: !currentValue }))
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
