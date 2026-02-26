<template>
  <q-page class="q-pa-md">
    <!-- Search Input -->
    <q-input
      v-model="query"
      placeholder="Search transactions..."
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
        :key="filter"
        :color="activeFilter === filter ? 'primary' : 'grey-3'"
        :text-color="activeFilter === filter ? 'white' : 'dark'"
        clickable
        @click="activeFilter = activeFilter === filter ? '' : filter"
      >
        {{ filter }}
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
          <q-item-label class="text-weight-medium">{{ tx.category || 'Transfer' }}</q-item-label>
          <q-item-label caption>{{ tx.notes }} &middot; {{ tx.date }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label :class="'amount-' + tx.type" class="transaction-amount">
            {{ tx.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{ tx.amount.toLocaleString() }}
          </q-item-label>
          <q-badge :color="tx.type === 'income' ? 'positive' : tx.type === 'expense' ? 'negative' : 'info'" dense>
            {{ tx.type }}
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Empty state -->
    <div v-else-if="query" class="text-center text-grey q-mt-xl">
      <q-icon name="search_off" size="60px" class="q-mb-md" />
      <div class="text-h6">No results found</div>
      <div class="text-body2">Try a different search term</div>
    </div>

    <!-- Initial state -->
    <div v-else class="text-center text-grey q-mt-xl">
      <q-icon name="manage_search" size="60px" class="q-mb-md" />
      <div class="text-body1">Search by amount, category, notes, or date</div>
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
const filters = ['Income', 'Expense', 'Transfer']

const results = computed(() => {
  let list = query.value ? transactions.searchTransactions(query.value) : []
  if (activeFilter.value) {
    list = list.filter((t) => t.type === activeFilter.value.toLowerCase())
  }
  return list.sort((a, b) => b.date.localeCompare(a.date))
})

function getColor(tx) {
  if (tx.type === 'income') return '#4CAF50'
  if (tx.type === 'expense') return '#E53935'
  return '#2196F3'
}
</script>
