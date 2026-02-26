<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">নোটস</div>
        <div class="text-caption text-grey">{{ noteStore.notes.length }}টি নোট</div>
      </div>
      <q-btn round flat icon="add_circle" color="dark" size="lg" @click="openAddDialog" />
    </div>

    <!-- Loading -->
    <div v-if="noteStore.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <template v-else>
      <!-- Pinned Notes -->
      <div v-if="pinnedNotes.length" class="q-mb-md">
        <div class="section-title">পিন করা</div>
        <div class="q-gutter-sm">
          <q-card v-for="note in pinnedNotes" :key="note.id" class="finance-card" style="border-left: 4px solid #111;">
            <q-card-section>
              <div class="row items-start justify-between">
                <div class="col" @click="openEditDialog(note)" style="cursor: pointer;">
                  <div class="text-subtitle1 text-weight-bold">{{ note.title }}</div>
                  <div class="text-body2 text-grey-7 q-mt-xs" style="white-space: pre-line;">{{ note.description }}
                  </div>
                  <div class="text-caption text-grey q-mt-sm">
                    {{ formatDate(note.createdAt) }}
                  </div>
                </div>
                <div class="column q-gutter-xs">
                  <q-btn flat round dense icon="push_pin" color="dark"
                    @click="noteStore.togglePin(note.id, note.pinned)" />
                  <q-btn flat round dense icon="delete_outline" color="negative" @click="confirmDelete(note)" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Other Notes -->
      <div v-if="unpinnedNotes.length">
        <div class="section-title">সকল নোট</div>
        <div class="q-gutter-sm">
          <q-card v-for="note in unpinnedNotes" :key="note.id" class="finance-card">
            <q-card-section>
              <div class="row items-start justify-between">
                <div class="col" @click="openEditDialog(note)" style="cursor: pointer;">
                  <div class="text-subtitle2 text-weight-bold">{{ note.title }}</div>
                  <div class="text-body2 text-grey-7 q-mt-xs" style="white-space: pre-line;">{{ note.description }}
                  </div>
                  <div class="text-caption text-grey q-mt-sm">{{ formatDate(note.createdAt) }}</div>
                </div>
                <div class="column q-gutter-xs">
                  <q-btn flat round dense icon="push_pin" color="grey"
                    @click="noteStore.togglePin(note.id, note.pinned)" />
                  <q-btn flat round dense icon="delete_outline" color="negative" @click="confirmDelete(note)" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!noteStore.notes.length" class="text-center text-grey q-mt-xl">
        <q-icon name="note" size="60px" class="q-mb-md" />
        <div class="text-h6">এখনো কোনো নোট নেই</div>
        <div class="text-body2">+ চাপুন নতুন নোট তৈরি করতে</div>
      </div>
    </template>

    <!-- Add/Edit Note Dialog -->
    <q-dialog v-model="showDialog" position="bottom" transition-show="slide-up" transition-hide="slide-down">
      <q-card
        style="border-top-left-radius: 28px; border-top-right-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ isEditing ? 'নোট সম্পাদনা' : 'নতুন নোট' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="saveNote">
            <q-input v-model="form.title" label="শিরোনাম" outlined dense autofocus color="dark"
              :rules="[(val) => (val && val.length > 0) || 'শিরোনাম আবশ্যক']" style="margin-bottom: 10px;" />
            <q-input v-model="form.description" label="বিবরণ" outlined type="textarea" rows="4" color="dark"
              style="margin-bottom: 10px;" />
            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="isEditing ? 'আপডেট করুন' : 'নোট সংরক্ষণ করুন'" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useNoteStore } from 'stores/noteStore'

const $q = useQuasar()
const noteStore = useNoteStore()

const showDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const saving = ref(false)
const form = reactive({ title: '', description: '' })

const pinnedNotes = computed(() => noteStore.notes.filter((n) => n.pinned))
const unpinnedNotes = computed(() => noteStore.notes.filter((n) => !n.pinned))

function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })
}

function openAddDialog() {
  isEditing.value = false
  editingId.value = null
  form.title = ''
  form.description = ''
  showDialog.value = true
}

function openEditDialog(note) {
  isEditing.value = true
  editingId.value = note.id
  form.title = note.title
  form.description = note.description || ''
  showDialog.value = true
}

async function saveNote() {
  if (!form.title) return
  saving.value = true
  try {
    if (isEditing.value) {
      await noteStore.updateNote(editingId.value, { ...form })
      $q.notify({ type: 'positive', message: 'নোট আপডেট হয়েছে', position: 'top' })
    } else {
      await noteStore.addNote({ ...form })
      $q.notify({ type: 'positive', message: 'নোট সংরক্ষিত হয়েছে', position: 'top' })
    }
    showDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: 'ত্রুটি: ' + err.message, position: 'top' })
  }
  saving.value = false
}

function confirmDelete(note) {
  $q.dialog({
    title: 'নোট মুছুন',
    message: `"${note.title}" নোটটি মুছে ফেলতে চান?`,
    ok: { label: 'মুছুন', color: 'negative', flat: true },
    cancel: { label: 'বাতিল', flat: true },
  }).onOk(async () => {
    await noteStore.deleteNote(note.id)
    $q.notify({ type: 'positive', message: 'নোট মুছে ফেলা হয়েছে', position: 'top' })
  })
}

onMounted(() => {
  noteStore.listenNotes()
})

onUnmounted(() => {
  noteStore.stopListening()
})
</script>
