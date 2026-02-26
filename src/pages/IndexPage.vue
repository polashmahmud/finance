<template>
  <q-page class="q-pa-md">
    <!-- Greeting -->
    <div class="q-mb-md">
      <div class="text-caption text-grey">{{ greeting }} 👋</div>
      <div class="text-h5 text-weight-bold">আমার ফাইন্যান্স</div>
    </div>

    <!-- Total Balance Card -->
    <q-card class="finance-card q-mb-md cursor-pointer" @click="$router.push('/accounts')">
      <q-card-section class="bg-primary-gradient" style="border-radius: 16px">
        <div class="q-mb-sm">
          <div class="text-body2" style="opacity: 0.9">মোট ব্যালেন্স</div>
          <div class="stat-value text-white" style="font-size: 2rem">{{ settings.currency }}{{
            formatNumber(accounts.totalBalance) }}</div>
        </div>
        <div class="row q-gutter-md q-mt-xs">
          <div class="row items-center q-gutter-xs">
            <q-icon name="trending_up" size="18px" style="opacity: 0.85" />
            <div>
              <div style="font-size: 0.7rem; opacity: 0.85">আয়</div>
              <div class="text-weight-bold" style="font-size: 0.9rem">{{ settings.currency }}{{
                formatNumber(transactions.totalIncome) }}</div>
            </div>
          </div>
          <div class="row items-center q-gutter-xs">
            <q-icon name="trending_down" size="18px" style="opacity: 0.85" />
            <div>
              <div style="font-size: 0.7rem; opacity: 0.85">ব্যয়</div>
              <div class="text-weight-bold" style="font-size: 0.9rem">{{ settings.currency }}{{
                formatNumber(transactions.totalExpense) }}</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Accounts Horizontal Scroll -->
    <div class="section-title">অ্যাকাউন্ট</div>
    <div class="row q-gutter-md q-mb-md" style="overflow-x: auto; flex-wrap: nowrap; padding-bottom: 8px">
      <q-card v-for="account in accounts.accounts" :key="account.id" class="finance-card"
        style="min-width: 160px; flex-shrink: 0">
        <q-card-section class="q-pa-md">
          <div class="row items-center q-gutter-sm q-mb-sm">
            <q-icon :name="account.icon" :style="{ color: account.color }" size="20px" />
            <span class="text-caption text-grey">{{ account.type === 'Cash' ? 'নগদ' : account.type === 'Bank' ? 'ব্যাংক'
              : 'মোবাইল' }}</span>
          </div>
          <div class="text-body2 text-weight-medium">{{ account.name }}</div>
          <div class="text-subtitle1 text-weight-bold">{{ settings.currency }}{{ formatNumber(account.balance) }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Budget Status -->
    <div class="section-title">বাজেট স্ট্যাটাস</div>
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
    <div class="section-title">সাম্প্রতিক লেনদেন</div>
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
        <div>এখনো কোনো লেনদেন হয়নি</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useAccountStore } from 'stores/accountStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'

const accounts = useAccountStore()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const settings = useSettingsStore()

onMounted(() => {
  accounts.listenAccounts()
  categories.listenCategories()
})

onUnmounted(() => {
  accounts.stopListening()
  categories.stopListening()
})

const hour = new Date().getHours()
const greeting = computed(() => {
  if (hour < 12) return 'শুভ সকাল'
  if (hour < 17) return 'শুভ অপরাহ্ন'
  if (hour < 20) return 'শুভ সন্ধ্যা'
  return 'শুভ রাত্রি'
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
