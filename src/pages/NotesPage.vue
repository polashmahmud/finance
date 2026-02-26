<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">নোটস</div>
        <div class="text-caption text-grey">{{ notes.notes.length }}টি নোট</div>
      </div>
      <q-btn round flat icon="add_circle" color="primary" size="lg" @click="showAdd = true" />
    </div>

    <!-- Pinned Notes -->
    <div v-if="pinnedNotes.length" class="q-mb-md">
      <div class="section-title">পিন করা</div>
      <div class="q-gutter-md">
        <q-card v-for="note in pinnedNotes" :key="note.id" class="finance-card" style="border-left: 4px solid #F9A825">
          <q-card-section>
            <div class="row items-start justify-between">
              <div class="col">
                <div class="text-subtitle1 text-weight-bold">{{ note.title }}</div>
                <div class="text-body2 text-grey-7 q-mt-xs">{{ note.description }}</div>
                <div class="text-caption text-grey q-mt-sm">
                  {{ note.createdAt }}
                  <q-badge v-if="note.transactionId" color="secondary" class="q-ml-sm">সংযুক্ত</q-badge>
                </div>
              </div>
              <div class="column q-gutter-xs">
                <q-btn flat round dense icon="push_pin" color="accent" @click="notes.togglePin(note.id)" />
                <q-btn flat round dense icon="delete" color="negative" @click="notes.deleteNote(note.id)" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Other Notes -->
    <div class="section-title">সকল নোট</div>
    <div class="q-gutter-md">
      <q-slide-item
        v-for="note in unpinnedNotes"
        :key="note.id"
        @right="({ reset }) => { notes.deleteNote(note.id); reset() }"
      >
        <template v-slot:right>
          <div class="row items-center q-px-md">
            <q-icon name="delete" color="negative" />
          </div>
        </template>

        <q-card class="finance-card">
          <q-card-section>
            <div class="row items-start justify-between">
              <div class="col">
                <div class="text-subtitle2 text-weight-bold">{{ note.title }}</div>
                <div class="text-body2 text-grey-7 q-mt-xs" style="white-space: pre-line">{{ note.description }}</div>
                <div class="text-caption text-grey q-mt-sm">
                  {{ note.createdAt }}
                  <q-badge v-if="note.transactionId" color="secondary" class="q-ml-sm">সংযুক্ত</q-badge>
                </div>
              </div>
              <q-btn flat round dense icon="push_pin" color="grey" @click="notes.togglePin(note.id)" />
            </div>
          </q-card-section>
        </q-card>
      </q-slide-item>
    </div>

    <div class="swipe-hint q-mt-sm" v-if="unpinnedNotes.length">বামে সোয়াইপ করে মুছুন</div>

    <!-- Empty State -->
    <div v-if="!notes.notes.length" class="text-center text-grey q-mt-xl">
      <q-icon name="note" size="60px" class="q-mb-md" />
      <div class="text-h6">এখনো কোনো নোট নেই</div>
      <div class="text-body2">+ চাপুন নতুন নোট তৈরি করতে</div>
    </div>

    <!-- Add Note Dialog -->
    <q-dialog v-model="showAdd" position="bottom">
      <q-card style="width: 100%; max-width: 500px; border-radius: 16px 16px 0 0">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">নতুন নোট</div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="addNote" class="q-gutter-md">
            <q-input v-model="newNote.title" label="শিরোনাম" outlined dense autofocus />
            <q-input v-model="newNote.description" label="বিবরণ" outlined type="textarea" rows="4" />
            <q-select
              v-model="newNote.transactionId"
              :options="txOptions"
              label="লেনদেনের সাথে সংযুক্ত করুন (ঐচ্ছিক)"
              outlined
              dense
              clearable
              emit-value
              map-options
            />
            <q-btn type="submit" unelevated rounded color="primary" label="নোট সংরক্ষণ করুন" class="full-width" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useNoteStore } from 'stores/noteStore'
import { useTransactionStore } from 'stores/transactionStore'

const notes = useNoteStore()
const transactions = useTransactionStore()

const showAdd = ref(false)
const newNote = reactive({ title: '', description: '', transactionId: null })

const pinnedNotes = computed(() => notes.notes.filter((n) => n.pinned))
const unpinnedNotes = computed(() => notes.notes.filter((n) => !n.pinned))

const txOptions = computed(() =>
  transactions.transactions.slice(0, 20).map((t) => ({
    label: `${t.type === 'income' ? 'আয়' : t.type === 'expense' ? 'ব্যয়' : 'ট্রান্সফার'} - ${t.category || 'ট্রান্সফার'} - ${t.amount}`,
    value: t.id,
  })),
)

function addNote() {
  if (!newNote.title) return
  notes.addNote({ ...newNote })
  newNote.title = ''
  newNote.description = ''
  newNote.transactionId = null
  showAdd.value = false
}
</script>
