<template>
  <q-page class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-title">{{ $t('allTransactions.title') }}</div>
      <div class="page-subtitle">{{ $t('allTransactions.subtitle') || '' }}</div>
    </div>

    <!-- Month Filter -->
    <div class="month-filter">
      <q-btn flat round dense icon="chevron_left" size="sm" style="color: #1a1a2e" @click="goToPrevMonth"
        :disable="!canGoPrev" />
      <div class="month-label" @click="monthPickerOpen = true">
        <span>{{ currentMonthLabel }}</span>
        <q-icon name="calendar_month" size="18px" />
      </div>
      <q-btn flat round dense icon="chevron_right" size="sm" style="color: #1a1a2e" @click="goToNextMonth"
        :disable="!canGoNext" />
    </div>

    <!-- Month Picker Dialog -->
    <q-dialog v-model="monthPickerOpen" transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 300px; border-radius: 16px;">
        <q-card-section class="row items-center justify-between q-pb-sm">
          <div class="text-subtitle1 text-weight-bold">{{ $t('allTransactions.selectMonth') }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-btn flat no-caps class="full-width q-mb-sm" :color="selectedMonth === 'all' ? 'dark' : 'grey-7'"
            :class="{ 'bg-grey-2': selectedMonth === 'all' }" @click="selectedMonth = 'all'; monthPickerOpen = false">
            {{ $t('allTransactions.allTime') }}
          </q-btn>
          <q-date v-model="pickerMonth" emit-immediately minimal years-in-month-view default-view="Months"
            @update:model-value="onPickerMonthSelect" mask="YYYY/MM" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Type Filter (Tabs) -->
    <q-card class="finance-card tab-card q-mb-md">
      <q-tabs v-model="selectedType" dense active-color="dark" indicator-color="dark" class="text-grey-6"
        align="justify" no-caps>
        <q-tab v-for="f in typeFilters" :key="f.value" :name="f.value" :label="f.label" />
      </q-tabs>
    </q-card>

    <!-- Summary -->
    <div class="row q-gutter-sm q-mb-md justify-center" v-if="filteredTransactions.length">
      <div class="summary-chip summary-chip-income">
        <q-icon name="trending_up" size="16px" />
        {{ $t('common.income') }}: {{ settings.currency }}{{ settings.formatNumber(filteredSummary.income) }}
      </div>
      <div class="summary-chip summary-chip-expense">
        <q-icon name="trending_down" size="16px" />
        {{ $t('common.expense') }}: {{ settings.currency }}{{ settings.formatNumber(filteredSummary.expense) }}
      </div>
    </div>

    <!-- Transaction List -->
    <q-card class="finance-card" style="border-radius: 16px; overflow: hidden;" v-if="filteredTransactions.length">
      <q-list separator>
        <q-slide-item v-for="tx in filteredTransactions" :key="tx.id" @left="({ reset }) => onEditTx(tx, reset)"
          @right="({ reset }) => onDeleteTx(tx, reset)">
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
              <q-item-label class="text-weight-medium">{{ tx.category || $t('common.transfer')
              }}</q-item-label>
              <q-item-label caption>{{ tx.notes }} &middot; {{ settings.formatDate(tx.date)
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label
                :class="tx.type === 'income' ? 'amount-income' : tx.type === 'expense' ? 'amount-expense' : 'text-blue'"
                class="transaction-amount">
                {{ tx.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{
                  settings.formatNumber(tx.amount) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-slide-item>
      </q-list>
    </q-card>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <q-icon name="receipt_long" size="56px" />
      <div class="empty-state-title">{{ $t('dashboard.noTransactionsYet') }}</div>
      <div class="empty-state-subtitle">{{ $t('allTransactions.emptyHint') || '' }}</div>
    </div>

    <!-- Swipe Hint -->
    <div class="text-center q-pa-md text-grey-6" style="font-size: 12px;" v-if="filteredTransactions.length">
      <q-icon name="swipe" size="16px" class="q-mr-xs" />
      {{ $t('categories.swipeHint') }}
    </div>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteConfirmOpen" persistent>
      <q-card style="border-radius: 28px; width: 100%; max-width: 420px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="row items-center q-gutter-sm">
            <q-avatar color="negative" text-color="white" icon="delete" size="36px" />
            <div class="text-h6 text-weight-bold" style="color: #222;">{{ $t('dashboard.deleteTransactionTitle') }}
            </div>
          </div>
          <q-btn icon="close" flat round dense @click="cancelDeleteTx" style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <!-- Transaction summary -->
          <div class="q-pa-sm q-mb-md" style="background: #f8fafc; border-radius: 12px;">
            <div class="row items-center q-gutter-sm">
              <q-avatar :style="{ background: getCategoryColor(deleteTxData?.category) + '20' }" size="36px">
                <q-icon :name="getCategoryIcon(deleteTxData?.category)"
                  :style="{ color: getCategoryColor(deleteTxData?.category) }" size="18px" />
              </q-avatar>
              <div>
                <div class="text-weight-medium">{{ deleteTxData?.category || $t('common.transfer') }}</div>
                <div class="text-caption text-grey">{{ settings.formatDate(deleteTxData?.date) }}</div>
              </div>
              <q-space />
              <div
                :class="deleteTxData?.type === 'income' ? 'amount-income' : deleteTxData?.type === 'expense' ? 'amount-expense' : 'text-blue'"
                class="text-weight-bold">
                {{ deleteTxData?.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{
                  settings.formatNumber(deleteTxData?.amount) }}
              </div>
            </div>
          </div>

          <!-- Account balance question -->
          <div v-if="deleteTxData?.accountId && (deleteTxData.type === 'expense' || deleteTxData.type === 'income')"
            class="text-body2 q-mb-md text-grey-8">
            <template v-if="deleteTxData.type === 'expense'">
              {{ $t('dashboard.deleteExpenseConfirm', {
                amount: settings.currency +
                  settings.formatNumber(deleteTxData.amount), account: getAccountName(deleteTxData.accountId) }) }}
            </template>
            <template v-else-if="deleteTxData.type === 'income'">
              {{ $t('dashboard.deleteIncomeConfirm', {
                amount: settings.currency +
                  settings.formatNumber(deleteTxData.amount), account: getAccountName(deleteTxData.accountId) }) }}
            </template>
          </div>

          <!-- Action Buttons -->
          <div class="column q-gutter-sm">
            <q-btn v-if="deleteTxData?.accountId && (deleteTxData.type === 'expense' || deleteTxData.type === 'income')"
              :label="deleteTxData.type === 'expense' ? $t('dashboard.deleteWithRefund') : $t('dashboard.deleteWithDeduct')"
              :icon="deleteTxData.type === 'expense' ? 'savings' : 'money_off'" color="negative" unelevated
              class="full-width" @click="confirmDeleteWithBalance" />
            <q-btn :label="$t('dashboard.deleteOnly')" icon="delete_forever" outline color="negative" class="full-width"
              @click="confirmDeleteOnly" />
            <q-btn :label="$t('common.cancel')" flat color="grey-7" class="full-width" @click="cancelDeleteTx" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Dialog -->
    <q-dialog v-model="editDialogOpen">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6 text-weight-bold">{{ $t('allTransactions.editTransaction') }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="saveEdit">
            <!-- Amount -->
            <q-input v-model.number="editForm.amount" :label="$t('common.amount')" type="number" outlined color="dark"
              :prefix="settings.currency" :rules="[val => val > 0 || $t('common.validAmount')]"
              input-class="text-h6 text-weight-bold" class="q-mb-sm" />

            <!-- Category (for income/expense) -->
            <q-select v-if="editForm.type !== 'transfer'" v-model="editForm.category"
              :options="editForm.type === 'income' ? incomeCategoryOptions : expenseCategoryOptions"
              :label="$t('common.category')" outlined color="dark" emit-value map-options class="q-mb-sm">
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

            <!-- Account (for income/expense) -->
            <q-select v-if="editForm.type !== 'transfer'" v-model="editForm.accountId" :options="accountOptions"
              :label="$t('common.account')" outlined color="dark" emit-value map-options class="q-mb-sm" />

            <!-- From/To Accounts & Fee (for transfer) -->
            <div v-if="editForm.type === 'transfer'" class="q-mb-sm">
              <div class="row q-col-gutter-md q-mb-sm">
                <div class="col-6">
                  <q-select v-model="editForm.fromAccountId" :options="accountOptions"
                    :label="$t('transferPage.fromAccount')" outlined color="dark" emit-value map-options />
                </div>
                <div class="col-6">
                  <q-select v-model="editForm.toAccountId" :options="accountOptions"
                    :label="$t('transferPage.toAccount')" outlined color="dark" emit-value map-options />
                </div>
              </div>
              <q-input v-model.number="editForm.fee" :label="$t('transferPage.transferFee')" type="number" outlined
                color="dark" :prefix="settings.currency" />
            </div>

            <!-- Date & Time -->
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

            <!-- Notes -->
            <q-input v-model="editForm.notes" :label="$t('common.noteOptional')" outlined color="dark" type="textarea"
              rows="2" class="q-mb-sm" />

            <!-- Submit -->
            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated size="lg"
              icon="check" :label="$t('common.update')" :loading="saving" />
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
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'

const { t, locale } = useI18n()
const $q = useQuasar()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const accounts = useAccountStore()
const settings = useSettingsStore()

const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const selectedType = ref('all')
const editDialogOpen = ref(false)
const monthPickerOpen = ref(false)
const saving = ref(false)

// Delete Confirmation
const deleteConfirmOpen = ref(false)
const deleteTxData = ref(null)
let deleteTxResetFn = null

// Picker month value in YYYY/MM format
const pickerMonth = ref(new Date().toISOString().slice(0, 7).replace('-', '/'))

const editForm = reactive({
  id: null,
  type: '',
  amount: null,
  category: '',
  accountId: null,
  fromAccountId: null,
  toAccountId: null,
  fee: 0,
  date: '',
  time: '',
  notes: '',
  originalAmount: 0,
  originalAccountId: null,
  originalFromAccountId: null,
  originalToAccountId: null,
  originalFee: 0,
})

const typeFilters = computed(() => [
  { label: t('allTransactions.all'), value: 'all' },
  { label: t('common.income'), value: 'income' },
  { label: t('common.expense'), value: 'expense' },
  { label: t('common.transfer'), value: 'transfer' },
])

const availableMonths = computed(() => {
  const months = new Set()
  transactions.transactions.forEach((tx) => {
    if (tx.date) {
      months.add(tx.date.slice(0, 7)) // YYYY-MM
    }
  })
  return [...months].sort((a, b) => b.localeCompare(a))
})

const sortedMonthsAsc = computed(() => [...availableMonths.value].sort())

const currentMonthLabel = computed(() => {
  if (selectedMonth.value === 'all') return t('allTransactions.allTime')
  const [y, mo] = selectedMonth.value.split('-')
  const date = new Date(Number(y), Number(mo) - 1)
  return date.toLocaleDateString(locale.value === 'bn' ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'long',
  })
})

const currentMonthIndex = computed(() => {
  if (selectedMonth.value === 'all') return -1
  return sortedMonthsAsc.value.indexOf(selectedMonth.value)
})

const canGoPrev = computed(() => {
  if (selectedMonth.value === 'all') return false
  return currentMonthIndex.value > 0
})

const canGoNext = computed(() => {
  if (selectedMonth.value === 'all') return sortedMonthsAsc.value.length > 0
  return currentMonthIndex.value < sortedMonthsAsc.value.length - 1
})

function goToPrevMonth() {
  if (selectedMonth.value === 'all') return
  const idx = currentMonthIndex.value
  if (idx === 0) {
    selectedMonth.value = 'all'
  } else if (idx > 0) {
    selectedMonth.value = sortedMonthsAsc.value[idx - 1]
    pickerMonth.value = selectedMonth.value.replace('-', '/')
  }
}

function goToNextMonth() {
  if (selectedMonth.value === 'all') {
    // Go to first available month
    if (sortedMonthsAsc.value.length > 0) {
      selectedMonth.value = sortedMonthsAsc.value[0]
      pickerMonth.value = selectedMonth.value.replace('-', '/')
    }
    return
  }
  const idx = currentMonthIndex.value
  if (idx < sortedMonthsAsc.value.length - 1) {
    selectedMonth.value = sortedMonthsAsc.value[idx + 1]
    pickerMonth.value = selectedMonth.value.replace('-', '/')
  }
}

function onPickerMonthSelect(val) {
  if (val) {
    selectedMonth.value = val.replace('/', '-')
    pickerMonth.value = val
  }
  monthPickerOpen.value = false
}

const filteredTransactions = computed(() => {
  let list = [...transactions.transactions]

  // Month filter
  if (selectedMonth.value !== 'all') {
    list = list.filter((tx) => tx.date && tx.date.startsWith(selectedMonth.value))
  }

  // Type filter
  if (selectedType.value !== 'all') {
    list = list.filter((tx) => tx.type === selectedType.value)
  }

  return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
})

const filteredSummary = computed(() => {
  let income = 0
  let expense = 0
  filteredTransactions.value.forEach(tx => {
    if (tx.type === 'income') {
      income += tx.amount || 0
    } else if (tx.type === 'expense') {
      expense += tx.amount || 0
    }
  })
  return { income, expense }
})

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
    label: `${a.name} (${settings.currency}${settings.formatNumber(a.balance || 0)})`,
    value: a.id,
  })),
)

function getCategoryColor(categoryName) {
  const all = [...categories.incomeCategories, ...categories.expenseCategories]
  return all.find((c) => c.name === categoryName)?.color || '#757575'
}

function getCategoryIcon(categoryName) {
  const all = [...categories.incomeCategories, ...categories.expenseCategories]
  return all.find((c) => c.name === categoryName)?.icon || 'receipt'
}

function onEditTx(tx, reset) {
  reset()
  editForm.id = tx.id
  editForm.type = tx.type
  editForm.amount = tx.amount
  editForm.category = tx.category || ''
  editForm.accountId = tx.accountId || null
  editForm.fromAccountId = tx.fromAccountId || null
  editForm.toAccountId = tx.toAccountId || null
  editForm.fee = tx.fee || 0
  editForm.date = tx.date || ''
  editForm.time = tx.time || ''
  editForm.notes = tx.notes || ''
  editForm.originalAmount = tx.amount
  editForm.originalAccountId = tx.accountId
  editForm.originalFromAccountId = tx.fromAccountId || null
  editForm.originalToAccountId = tx.toAccountId || null
  editForm.originalFee = tx.fee || 0
  editDialogOpen.value = true
}

async function saveEdit() {
  if (!editForm.amount || editForm.amount <= 0) return
  saving.value = true
  try {
    if (editForm.type === 'transfer') {
      if (!editForm.fromAccountId || !editForm.toAccountId) {
        $q.notify({ type: 'negative', message: t('transferPage.selectBothAccounts'), position: 'top' })
        saving.value = false
        return
      }
      if (editForm.fromAccountId === editForm.toAccountId) {
        $q.notify({ type: 'negative', message: t('transferPage.selectDifferentAccounts'), position: 'top' })
        saving.value = false
        return
      }
    }

    const updateData = editForm.type === 'transfer'
      ? {
        amount: editForm.amount,
        fee: editForm.fee || 0,
        fromAccountId: editForm.fromAccountId,
        toAccountId: editForm.toAccountId,
        accountId: editForm.fromAccountId,
        date: editForm.date,
        time: editForm.time,
        notes: editForm.notes,
      }
      : {
        amount: editForm.amount,
        category: editForm.category,
        accountId: editForm.accountId,
        date: editForm.date,
        time: editForm.time,
        notes: editForm.notes,
      }

    // Adjust account balances if amount or account changed
    if (editForm.type === 'income' || editForm.type === 'expense') {
      const sign = editForm.type === 'income' ? 1 : -1
      const oldAmount = editForm.originalAmount || 0
      const newAmount = editForm.amount

      // Revert old amount from old account
      if (editForm.originalAccountId) {
        await accounts.updateBalance(editForm.originalAccountId, -sign * oldAmount)
      }

      // Apply new amount to new account
      if (editForm.accountId) {
        await accounts.updateBalance(editForm.accountId, sign * newAmount)
      }
    } else if (editForm.type === 'transfer') {
      const oldAmount = editForm.originalAmount || 0
      const oldFee = editForm.originalFee || 0
      const newAmount = editForm.amount
      const newFee = editForm.fee || 0

      // Revert old transfer effect
      if (editForm.originalFromAccountId) {
        await accounts.updateBalance(editForm.originalFromAccountId, oldAmount + oldFee)
      }
      if (editForm.originalToAccountId) {
        await accounts.updateBalance(editForm.originalToAccountId, -oldAmount)
      }

      // Apply new transfer effect
      if (editForm.fromAccountId) {
        await accounts.updateBalance(editForm.fromAccountId, -(newAmount + newFee))
      }
      if (editForm.toAccountId) {
        await accounts.updateBalance(editForm.toAccountId, newAmount)
      }
    }

    await transactions.updateTransaction(editForm.id, updateData)
    $q.notify({ type: 'positive', message: t('allTransactions.transactionUpdated'), position: 'top' })
    editDialogOpen.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  } finally {
    saving.value = false
  }
}

function getAccountName(accountId) {
  return accounts.accounts.find((a) => a.id === accountId)?.name || accountId
}

function onDeleteTx(tx, reset) {
  deleteTxData.value = tx
  deleteTxResetFn = reset
  deleteConfirmOpen.value = true
}

function cancelDeleteTx() {
  deleteConfirmOpen.value = false
  if (deleteTxResetFn) deleteTxResetFn()
  deleteTxResetFn = null
  deleteTxData.value = null
}

async function confirmDeleteWithBalance() {
  if (!deleteTxData.value) return
  const tx = deleteTxData.value
  deleteConfirmOpen.value = false
  if (deleteTxResetFn) deleteTxResetFn()
  deleteTxResetFn = null
  await transactions.deleteTransaction(tx.id)
  if (tx.accountId) {
    if (tx.type === 'expense') {
      await accounts.updateBalance(tx.accountId, tx.amount)
    } else if (tx.type === 'income') {
      await accounts.updateBalance(tx.accountId, -tx.amount)
    }
  }
  $q.notify({ type: 'positive', message: t('dashboard.transactionDeleted'), position: 'top' })
  deleteTxData.value = null
}

async function confirmDeleteOnly() {
  if (!deleteTxData.value) return
  const tx = deleteTxData.value
  deleteConfirmOpen.value = false
  if (deleteTxResetFn) deleteTxResetFn()
  deleteTxResetFn = null
  await transactions.deleteTransaction(tx.id)
  $q.notify({ type: 'positive', message: t('dashboard.transactionDeleted'), position: 'top' })
  deleteTxData.value = null
}

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
</script>
