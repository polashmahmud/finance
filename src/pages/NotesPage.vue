<template>
  <q-page class="page-container">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="page-title">{{ $t('notes.title') }}</div>
        <div class="page-subtitle">{{ noteStore.notes.length }}{{ $t('notes.countSuffix') }}</div>
      </div>
      <q-btn round flat dense icon="add_circle" size="md" style="color: #1a1a2e; background: rgba(26,26,46,0.06); border-radius: 14px;" @click="openAddDialog" />
    </div>

    <!-- Loading -->
    <div v-if="noteStore.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <template v-else>
      <!-- Pinned Notes -->
      <div v-if="pinnedNotes.length" class="q-mb-md">
        <div class="page-section-title">{{ $t('notes.pinned') }}</div>
        <div class="row q-col-gutter-sm">
          <div v-for="note in pinnedNotes" :key="note.id" class="col-12 col-md-6">
          <q-card class="finance-card full-height" style="border-left: 4px solid #111;">
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
      </div>

      <!-- Other Notes -->
      <div v-if="unpinnedNotes.length">
        <div class="page-section-title">{{ $t('notes.allNotes') }}</div>
        <div class="row q-col-gutter-sm">
          <div v-for="note in unpinnedNotes" :key="note.id" class="col-12 col-md-6">
          <q-card class="finance-card full-height">
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
      </div>

      <!-- Empty State -->
      <div v-if="!noteStore.notes.length" class="empty-state">
        <q-icon name="note" size="60px" />
        <div class="empty-state-title">{{ $t('notes.noNotes') }}</div>
        <div class="empty-state-subtitle">{{ $t('notes.addPrompt') }}</div>
      </div>
    </template>

    <!-- Add/Edit Note Dialog -->
    <q-dialog v-model="showDialog">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ isEditing ? $t('notes.editNote') : $t('notes.newNote') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="saveNote">
            <q-input v-model="form.title" :label="$t('notes.titleLabel')" outlined dense autofocus color="dark"
              :rules="[(val) => (val && val.length > 0) || $t('notes.titleRequired')]" style="margin-bottom: 10px;" />
            <q-input v-model="form.description" :label="$t('notes.description')" outlined type="textarea" rows="4"
              color="dark" style="margin-bottom: 10px;" />
            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="isEditing ? $t('common.update') : $t('notes.saveNote')" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useNoteStore } from 'stores/noteStore'
import { useSettingsStore } from 'stores/settingsStore'

const { t } = useI18n()
const $q = useQuasar()
const noteStore = useNoteStore()
const settings = useSettingsStore()

const showDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const saving = ref(false)
const form = reactive({ title: '', description: '' })

const pinnedNotes = computed(() => noteStore.notes.filter((n) => n.pinned))
const unpinnedNotes = computed(() => noteStore.notes.filter((n) => !n.pinned))

function formatDate(ts) {
  if (!ts) return ''
  const locale = settings.language === 'bn' ? 'bn-BD' : 'en-US'
  return new Date(ts).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
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
      $q.notify({ type: 'positive', message: t('notes.noteUpdated'), position: 'top' })
    } else {
      await noteStore.addNote({ ...form })
      $q.notify({ type: 'positive', message: t('notes.noteSaved'), position: 'top' })
    }
    showDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

function confirmDelete(note) {
  $q.dialog({
    title: t('notes.deleteNote'),
    message: `"${note.title}" ${t('notes.deleteConfirm')}`,
    ok: { label: t('common.delete'), color: 'negative', flat: true },
    cancel: { label: t('common.cancel'), flat: true },
  }).onOk(async () => {
    await noteStore.deleteNote(note.id)
    $q.notify({ type: 'positive', message: t('notes.noteDeleted'), position: 'top' })
  })
}

onMounted(() => {
  noteStore.listenNotes()
})

onUnmounted(() => {
  noteStore.stopListening()
})
</script>
