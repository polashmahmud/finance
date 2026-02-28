<template>
  <q-page class="q-pa-md">
    <!-- Search Bar -->
    <q-input v-model="searchQuery" :placeholder="$t('search.placeholder')" outlined dense rounded class="q-mb-md"
      bg-color="white" clearable>
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Filter Chips -->
    <div class="row q-gutter-sm q-mb-md">
      <q-chip v-for="filter in filterOptions" :key="filter.value" :outline="activeFilter !== filter.value"
        :color="activeFilter === filter.value ? 'dark' : 'grey-4'"
        :text-color="activeFilter === filter.value ? 'white' : 'dark'" clickable @click="activeFilter = filter.value"
        size="sm">
        {{ filter.label }}
      </q-chip>
    </div>

    <!-- Loading -->
    <div v-if="transactions.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <!-- Results -->
    <template v-else>
      <q-list v-if="filteredResults.length" separator>
        <q-item v-for="tx in filteredResults" :key="tx.id" class="q-pa-md finance-card q-mb-sm rounded-borders">
          <q-item-section avatar>
            <q-avatar :color="tx.type === 'income' ? 'positive' : tx.type === 'expense' ? 'negative' : 'info'"
              text-color="white" size="40px">
              <q-icon
                :name="tx.type === 'income' ? 'trending_up' : tx.type === 'expense' ? 'trending_down' : 'swap_horiz'"
                size="20px" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ tx.category || tx.note || tx.type }}</q-item-label>
            <q-item-label caption>{{ tx.account }} · {{ settings.formatDate(tx.date) }}</q-item-label>
            <q-item-label v-if="tx.note" caption class="text-grey-6">{{ tx.note }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <span :class="tx.type === 'income' ? 'text-positive' : tx.type === 'expense' ? 'text-negative' : ''"
              class="text-weight-bold">
              {{ tx.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{ settings.formatNumber(tx.amount) }}
            </span>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- No results -->
      <div v-else class="text-center text-grey q-pa-xl">
        <q-icon name="search_off" size="60px" class="q-mb-md" />
        <div class="text-h6">{{ $t('search.noResults') }}</div>
        <div class="text-caption">{{ searchQuery ? $t('search.tryOther') : $t('search.searchHint') }}</div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransactionStore } from 'stores/transactionStore'
import { useSettingsStore } from 'stores/settingsStore'

const { t } = useI18n()
const transactions = useTransactionStore()
const settings = useSettingsStore()

const searchQuery = ref('')
const activeFilter = ref('all')

const filterOptions = computed(() => [
  { label: t('common.income') + ' & ' + t('common.expense'), value: 'all' },
  { label: t('common.income'), value: 'income' },
  { label: t('common.expense'), value: 'expense' },
  { label: t('common.transfer'), value: 'transfer' },
])

const filteredResults = computed(() => {
  let results = [...transactions.transactions]

  if (activeFilter.value !== 'all') {
    results = results.filter((t) => t.type === activeFilter.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    results = results.filter(
      (t) =>
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.note && t.note.toLowerCase().includes(q)) ||
        (t.account && t.account.toLowerCase().includes(q)) ||
        (t.date && t.date.includes(q)) ||
        (t.amount && t.amount.toString().includes(q)),
    )
  }

  return results.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
})

onMounted(() => {
  transactions.listenTransactions()
})

onUnmounted(() => {
  transactions.stopListening()
})
</script>
