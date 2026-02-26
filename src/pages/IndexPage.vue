<template>
  <q-page class="q-pa-md">
    <!-- Greeting -->
    <div class="q-mb-md">
      <div class="text-h5 text-weight-bold">Dashboard</div>
      <div class="text-caption text-grey">{{ todayFormatted }}</div>
    </div>

    <!-- Total Balance Card -->
    <q-card class="finance-card q-mb-md cursor-pointer" @click="$router.push('/accounts')">
      <q-card-section class="bg-primary text-white" style="border-radius: 16px">
        <div class="row items-center justify-between">
          <div>
            <div class="stat-label text-white">Total Balance</div>
            <div class="stat-value">{{ settings.currency }} {{ formatNumber(accounts.totalBalance) }}</div>
          </div>
          <q-icon name="account_balance_wallet" size="40px" style="opacity: 0.5" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Income / Expense Row -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-6">
        <q-card class="finance-card cursor-pointer" @click="$router.push('/reports')">
          <q-card-section>
            <div class="row items-center q-gutter-sm">
              <q-icon name="arrow_downward" color="positive" size="24px" />
              <div class="stat-label">Income</div>
            </div>
            <div class="stat-value text-positive q-mt-xs" style="font-size: 1.2rem">
              {{ settings.currency }} {{ formatNumber(transactions.totalIncome) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6">
        <q-card class="finance-card cursor-pointer" @click="$router.push('/reports')">
          <q-card-section>
            <div class="row items-center q-gutter-sm">
              <q-icon name="arrow_upward" color="negative" size="24px" />
              <div class="stat-label">Expense</div>
            </div>
            <div class="stat-value text-negative q-mt-xs" style="font-size: 1.2rem">
              {{ settings.currency }} {{ formatNumber(transactions.totalExpense) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Budget Usage -->
    <div class="section-title">Budget Overview</div>
    <q-card class="finance-card q-mb-md">
      <q-card-section>
        <div v-for="cat in topBudgetCategories" :key="cat.id" class="q-mb-md">
          <div class="row justify-between items-center q-mb-xs">
            <div class="row items-center q-gutter-sm">
              <q-icon :name="cat.icon" :style="{ color: cat.color }" size="20px" />
              <span class="text-body2 text-weight-medium">{{ cat.name }}</span>
            </div>
            <span class="text-caption text-grey">
              {{ settings.currency }}{{ formatNumber(getCategorySpent(cat.name)) }} / {{ settings.currency }}{{ formatNumber(cat.budget) }}
            </span>
          </div>
          <q-linear-progress
            :value="Math.min(getCategorySpent(cat.name) / cat.budget, 1)"
            :color="getCategorySpent(cat.name) > cat.budget ? 'negative' : 'primary'"
            rounded
            size="8px"
            track-color="grey-3"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Recent Transactions -->
    <div class="section-title">Recent Transactions</div>
    <q-card class="finance-card">
      <q-list separator>
        <q-slide-item
          v-for="tx in transactions.recentTransactions"
          :key="tx.id"
          @right="({ reset }) => onDeleteTx(tx.id, reset)"
        >
          <template v-slot:right>
            <div class="row items-center">
              <q-icon name="delete" color="negative" />
            </div>
          </template>

          <q-item class="touch-target">
            <q-item-section avatar>
              <q-avatar :style="{ background: getCategoryColor(tx.category) + '20' }" size="40px">
                <q-icon :name="getCategoryIcon(tx.category)" :style="{ color: getCategoryColor(tx.category) }" size="20px" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ tx.category }}</q-item-label>
              <q-item-label caption>{{ tx.notes }} &middot; {{ tx.date }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label :class="tx.type === 'income' ? 'amount-income' : 'amount-expense'" class="transaction-amount">
                {{ tx.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{ formatNumber(tx.amount) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-slide-item>
      </q-list>

      <q-card-section v-if="!transactions.recentTransactions.length" class="text-center text-grey q-pa-lg">
        <q-icon name="receipt_long" size="40px" class="q-mb-sm" />
        <div>No transactions yet</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useAccountStore } from 'stores/accountStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'

const accounts = useAccountStore()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const settings = useSettingsStore()

const todayFormatted = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
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
  return Number(n).toLocaleString()
}

function onDeleteTx(id, reset) {
  transactions.deleteTransaction(id)
  reset()
}
</script>
