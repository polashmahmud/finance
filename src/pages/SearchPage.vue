<template>
  <q-page class="q-pa-md">
    <!-- Search Input -->
    <q-input
      v-model="query"
      placeholder="লেনদেন খুঁজুন..."
      outlined
      clearable
      autofocus
      class="q-mb-md"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Filter Chips -->
    <div class="row q-gutter-sm q-mb-md">
      <q-chip
        v-for="filter in filters"
        :key="filter.value"
        :color="activeFilter === filter.value ? 'primary' : 'grey-3'"
        :text-color="activeFilter === filter.value ? 'white' : 'dark'"
        clickable
        @click="activeFilter = activeFilter === filter.value ? '' : filter.value"
      >
        {{ filter.label }}
      </q-chip>
    </div>

    <!-- Results -->
    <q-list separator v-if="results.length">
      <q-item v-for="tx in results" :key="tx.id" class="touch-target">
        <q-item-section avatar>
          <q-avatar
            :style="{ background: getColor(tx) + '20' }"
            size="40px"
          >
            <q-icon
              :name="tx.type === 'transfer' ? 'swap_horiz' : tx.type === 'income' ? 'arrow_downward' : 'arrow_upward'"
              :style="{ color: getColor(tx) }"
              size="20px"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">{{ tx.category || 'ট্রান্সফার' }}</q-item-label>
          <q-item-label caption>{{ tx.notes }} &middot; {{ tx.date }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label :class="'amount-' + tx.type" class="transaction-amount">
            {{ tx.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{ tx.amount.toLocaleString() }}
          </q-item-label>
          <q-badge :color="tx.type === 'income' ? 'positive' : tx.type === 'expense' ? 'negative' : 'info'" dense>
            {{ getTypeLabel(tx.type) }}
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Empty state -->
    <div v-else-if="query" class="text-center text-grey q-mt-xl">
      <q-icon name="search_off" size="60px" class="q-mb-md" />
      <div class="text-h6">কোনো ফলাফল পাওয়া যায়নি</div>
      <div class="text-body2">অন্য কিছু দিয়ে খুঁজুন</div>
    </div>

    <!-- Initial state -->
    <div v-else class="text-center text-grey q-mt-xl">
      <q-icon name="manage_search" size="60px" class="q-mb-md" />
      <div class="text-body1">পরিমাণ, ক্যাটাগরি, নোট বা তারিখ দিয়ে খুঁজুন</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTransactionStore } from 'stores/transactionStore'
import { useSettingsStore } from 'stores/settingsStore'

const transactions = useTransactionStore()
const settings = useSettingsStore()

const query = ref('')
const activeFilter = ref('')
const filters = [
  { label: 'আয়', value: 'income' },
  { label: 'ব্যয়', value: 'expense' },
  { label: 'ট্রান্সফার', value: 'transfer' },
]

const typeLabels = {
  income: 'আয়',
  expense: 'ব্যয়',
  transfer: 'ট্রান্সফার',
}

function getTypeLabel(type) {
  return typeLabels[type] || type
}

const results = computed(() => {
  let list = query.value ? transactions.searchTransactions(query.value) : []
  if (activeFilter.value) {
    list = list.filter((t) => t.type === activeFilter.value)
  }
  return list.sort((a, b) => b.date.localeCompare(a.date))
})

function getColor(tx) {
  if (tx.type === 'income') return '#388E3C'
  if (tx.type === 'expense') return '#D32F2F'
  return '#1976D2'
}
</script>
