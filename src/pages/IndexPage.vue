<template>
  <q-page class="q-pa-md">
    <!-- Greeting -->
    <div class="q-mb-md">
      <div class="text-caption text-grey">{{ greeting }} 👋</div>
      <div class="text-h5 text-weight-bold">{{ $t('dashboard.myFinance') }}</div>
    </div>

    <!-- Total Balance Card -->
    <q-card class="finance-card q-mb-md cursor-pointer" @click="$router.push('/accounts')">
      <q-card-section class="bg-primary-gradient" style="border-radius: 16px; overflow: hidden; position: relative;">
        <div class="row items-center no-wrap">
          <!-- Left Content -->
          <div class="col-6">
            <div class="q-mb-sm">
              <div class="text-body2" style="opacity: 0.9; color: rgba(255,255,255,0.8)">{{ $t('dashboard.totalBalance') }}</div>
              <div class="stat-value text-white" style="font-size: 2rem; line-height: 1.2;">{{ settings.currency }}{{
                formatNumber(accounts.totalBalance) }}</div>
            </div>
            <div class="row q-gutter-md q-mt-xs">
              <div class="row items-center q-gutter-xs">
                <q-icon name="trending_up" size="18px" style="color: #4ade80" />
                <div>
                  <div style="font-size: 0.7rem; color: rgba(255,255,255,0.7)">{{ $t('common.income') }}</div>
                  <div class="text-white text-weight-bold" style="font-size: 0.85rem">{{ settings.currency }}{{
                    formatShort(transactions.totalIncome) }}</div>
                </div>
              </div>
              <div class="row items-center q-gutter-xs">
                <q-icon name="trending_down" size="18px" style="color: #f87171" />
                <div>
                  <div style="font-size: 0.7rem; color: rgba(255,255,255,0.7)">{{ $t('common.expense') }}</div>
                  <div class="text-white text-weight-bold" style="font-size: 0.85rem">{{ settings.currency }}{{
                    formatShort(transactions.totalExpense) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Chart / Emoji -->
          <div class="col-6 flex justify-end items-center" style="height: 90px; overflow: visible;">
            <div style="font-size: 4rem; user-select: none; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
              {{ balanceEmoji }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Accounts Horizontal Scroll -->
    <div class="section-title">{{ $t('dashboard.accounts') }}</div>
    <div class="row q-gutter-md q-mb-md" style="overflow-x: auto; flex-wrap: nowrap; padding-bottom: 8px">
      <q-card v-for="account in accounts.accounts" :key="account.id" class="finance-card"
        style="min-width: 160px; flex-shrink: 0">
        <q-card-section class="q-pa-md">
          <div class="row items-center q-gutter-sm q-mb-sm">
            <q-icon :name="account.icon" :style="{ color: account.color }" size="20px" />
            <span class="text-caption text-grey">{{ account.type === 'Cash' ? $t('dashboard.cash') : account.type === 'Bank' ? $t('dashboard.bank')
              : $t('dashboard.mobile') }}</span>
          </div>
          <div class="text-body2 text-weight-medium">{{ account.name }}</div>
          <div class="text-subtitle1 text-weight-bold">{{ settings.currency }}{{ formatNumber(account.balance) }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Budget Status -->
    <div class="section-title">{{ $t('dashboard.budgetStatus') }}</div>
    <div class="q-gutter-md q-mb-md">
      <q-card v-for="cat in topBudgetCategories" :key="cat.id" class="finance-card">
        <q-card-section>
          <div class="row justify-between items-center q-mb-xs">
            <div class="row items-center q-gutter-sm">
              <q-icon :name="cat.icon" :style="{ color: cat.color }" size="20px" />
              <span class="text-body2 text-weight-medium">{{ cat.name }}</span>
            </div>
            <span class="text-caption text-grey">
              {{ settings.currency }}{{ formatNumber(getCategorySpent(cat.name)) }} / {{ settings.currency }}{{
                formatNumber(cat.budget) }}
            </span>
          </div>
          <q-linear-progress :value="Math.min(getCategorySpent(cat.name) / cat.budget, 1)"
            :color="getCategorySpent(cat.name) > cat.budget ? 'negative' : 'positive'" rounded size="8px"
            track-color="grey-3" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Recent Transactions -->
    <div class="section-title">{{ $t('dashboard.recentTransactions') }}</div>
    <q-card class="finance-card">
      <q-list separator>
        <q-slide-item v-for="tx in transactions.recentTransactions" :key="tx.id"
          @right="({ reset }) => onDeleteTx(tx.id, reset)">
          <template v-slot:right>
            <div class="row items-center">
              <q-icon name="delete" color="negative" />
            </div>
          </template>

          <q-item class="touch-target">
            <q-item-section avatar>
              <q-avatar :style="{ background: getCategoryColor(tx.category) + '20' }" size="40px">
                <q-icon :name="getCategoryIcon(tx.category)" :style="{ color: getCategoryColor(tx.category) }"
                  size="20px" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ tx.category }}</q-item-label>
              <q-item-label caption>{{ tx.notes }} &middot; {{ tx.date }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label :class="tx.type === 'income' ? 'amount-income' : 'amount-expense'"
                class="transaction-amount">
                {{ tx.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{ formatNumber(tx.amount) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-slide-item>
      </q-list>

      <q-card-section v-if="!transactions.recentTransactions.length" class="text-center text-grey q-pa-lg">
        <q-icon name="receipt_long" size="40px" class="q-mb-sm" />
        <div>{{ $t('dashboard.noTransactionsYet') }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAccountStore } from 'stores/accountStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'

const { t } = useI18n()
const accounts = useAccountStore()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const settings = useSettingsStore()

onMounted(() => {
  accounts.listenAccounts()
  categories.listenCategories()
  transactions.listenTransactions()
})

onUnmounted(() => {
  accounts.stopListening()
  categories.stopListening()
  transactions.stopListening()
})

const hour = new Date().getHours()
const greeting = computed(() => {
  if (hour < 12) return t('greetings.morning')
  if (hour < 17) return t('greetings.afternoon')
  if (hour < 20) return t('greetings.evening')
  return t('greetings.night')
})

const topBudgetCategories = computed(() =>
  categories.expenseCategories.filter((c) => c.budget).slice(0, 4),
)

function getCategorySpent(categoryName) {
  return transactions.transactions
    .filter((t) => t.type === 'expense' && t.category === categoryName)
    .reduce((sum, t) => sum + t.amount, 0)
}

function getCategoryColor(categoryName) {
  const all = [...categories.incomeCategories, ...categories.expenseCategories]
  return all.find((c) => c.name === categoryName)?.color || '#757575'
}

function getCategoryIcon(categoryName) {
  const all = [...categories.incomeCategories, ...categories.expenseCategories]
  return all.find((c) => c.name === categoryName)?.icon || 'receipt'
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString()
}

function formatShort(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toLocaleString()
}

const balanceEmoji = computed(() => {
  const bal = accounts.totalBalance || 0
  if (bal < 0) return '😭'
  if (bal <= 500) return '😟'
  return '🤩'
})

function onDeleteTx(id, reset) {
  transactions.deleteTransaction(id)
  reset()
}
</script>
