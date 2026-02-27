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
    <div class="row items-center justify-between q-mb-sm">
      <div class="section-title q-mb-none">{{ $t('dashboard.recentTransactions') }}</div>
      <q-btn flat dense no-caps color="dark" :label="$t('allTransactions.viewAll')" icon-right="chevron_right" @click="$router.push('/all-transactions')" size="sm" />
    </div>
    <q-card class="finance-card">
      <q-list separator>
        <q-slide-item v-for="tx in transactions.recentTransactions" :key="tx.id"
          @left="({ reset }) => onEditTx(tx, reset)"
          @right="({ reset }) => onDeleteTx(tx.id, reset)">
          <template v-slot:left>
            <div class="row items-center">
              <q-icon name="edit" color="info" />
            </div>
          </template>
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

    <!-- Edit Transaction Dialog -->
    <q-dialog v-model="editDialogOpen" position="bottom" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="border-top-left-radius: 28px; border-top-right-radius: 28px; width: 100%; max-width: 500px;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6 text-weight-bold">{{ $t('allTransactions.editTransaction') }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="saveEdit">
            <q-input v-model.number="editForm.amount" :label="$t('common.amount')" type="number" outlined color="dark" :prefix="settings.currency" :rules="[val => val > 0 || $t('common.validAmount')]" input-class="text-h6 text-weight-bold" class="q-mb-sm" />

            <q-select v-if="editForm.type !== 'transfer'" v-model="editForm.category" :options="editForm.type === 'income' ? incomeCategoryOptions : expenseCategoryOptions" :label="$t('common.category')" outlined color="dark" emit-value map-options class="q-mb-sm">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-avatar :style="{ background: scope.opt.color + '18' }" size="32px">
                      <q-icon :name="scope.opt.icon" :style="{ color: scope.opt.color }" size="16px" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select v-if="editForm.type !== 'transfer'" v-model="editForm.accountId" :options="accountOptions" :label="$t('common.account')" outlined color="dark" emit-value map-options class="q-mb-sm" />

            <div class="row q-col-gutter-md q-mb-sm">
              <div class="col-6">
                <q-input v-model="editForm.date" :label="$t('common.date')" outlined color="dark" readonly>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="editForm.date" mask="YYYY-MM-DD" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input v-model="editForm.time" :label="$t('common.time')" outlined color="dark" readonly>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="editForm.time" mask="HH:mm" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <q-input v-model="editForm.notes" :label="$t('common.noteOptional')" outlined color="dark" type="textarea" rows="2" class="q-mb-sm" />

            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated size="lg" icon="check" :label="$t('common.update')" :loading="saving" />
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
import { useAccountStore } from 'stores/accountStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'

const { t } = useI18n()
const $q = useQuasar()
const accounts = useAccountStore()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const settings = useSettingsStore()

const editDialogOpen = ref(false)
const saving = ref(false)
const editForm = reactive({
  id: null,
  type: '',
  amount: null,
  category: '',
  accountId: null,
  date: '',
  time: '',
  notes: '',
  originalAmount: 0,
  originalAccountId: null,
})

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

function onEditTx(tx, reset) {
  reset()
  editForm.id = tx.id
  editForm.type = tx.type
  editForm.amount = tx.amount
  editForm.category = tx.category || ''
  editForm.accountId = tx.accountId || null
  editForm.date = tx.date || ''
  editForm.time = tx.time || ''
  editForm.notes = tx.notes || ''
  editForm.originalAmount = tx.amount
  editForm.originalAccountId = tx.accountId
  editDialogOpen.value = true
}

async function saveEdit() {
  if (!editForm.amount || editForm.amount <= 0) return
  saving.value = true
  try {
    const updateData = {
      amount: editForm.amount,
      category: editForm.category,
      accountId: editForm.accountId,
      date: editForm.date,
      time: editForm.time,
      notes: editForm.notes,
    }
    if (editForm.type === 'income' || editForm.type === 'expense') {
      const sign = editForm.type === 'income' ? 1 : -1
      if (editForm.originalAccountId) {
        await accounts.updateBalance(editForm.originalAccountId, -sign * editForm.originalAmount)
      }
      if (editForm.accountId) {
        await accounts.updateBalance(editForm.accountId, sign * editForm.amount)
      }
    }
    await transactions.updateTransaction(editForm.id, updateData)
    $q.notify({ type: 'positive', message: t('allTransactions.transactionUpdated'), position: 'top' })
    editDialogOpen.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

const incomeCategoryOptions = computed(() =>
  categories.incomeCategories.map((c) => ({
    label: c.name,
    value: c.name,
    icon: c.icon,
    color: c.color,
  })),
)

const expenseCategoryOptions = computed(() =>
  categories.expenseCategories.map((c) => ({
    label: c.name,
    value: c.name,
    icon: c.icon,
    color: c.color,
  })),
)

const accountOptions = computed(() =>
  accounts.accounts.map((a) => ({
    label: `${a.name} (${settings.currency}${Number(a.balance || 0).toLocaleString()})`,
    value: a.id,
  })),
)

function onDeleteTx(id, reset) {
  transactions.deleteTransaction(id)
  reset()
}
</script>
