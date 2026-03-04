<template>
  <q-page class="page-container">
    <!-- Category Header -->
    <div class="q-mb-md" v-if="category">
      <q-card class="hero-banner">
        <q-card-section class="hero-banner-gradient">
          <div class="row items-center q-gutter-md q-mb-md">
            <q-avatar :style="{ background: 'rgba(255,255,255,0.12)' }" size="48px">
              <q-icon :name="category.icon || 'category'" color="white" size="24px" />
            </q-avatar>
            <div class="col">
              <div class="text-body1 text-weight-bold text-white">{{ category.name }}</div>
              <div class="text-caption" style="color: rgba(255,255,255,0.6)">{{ category.type === 'income' ?
                $t('common.income') :
                $t('common.expense') }}</div>
            </div>
          </div>
          <!-- Budget Info -->
          <div v-if="category.type === 'expense'" class="q-mt-sm cursor-pointer q-pa-sm"
            style="background: rgba(255,255,255,0.08); border-radius: 12px;" @click="openBudgetModal" v-ripple>
            <div v-if="monthlyBudget">
              <div class="row justify-between items-center q-mb-xs">
                <span class="text-caption" style="color: rgba(255,255,255,0.6)">{{ $t('categoryTransactions.budgetUsed')
                  }}</span>
                <span class="text-caption" :style="{ color: isOverBudget ? '#f87171' : '#4ade80' }">
                  {{ $t('common.expense') }}: {{ settings.currency }}{{ settings.formatNumber(totalSpent) }} / {{
                    settings.currency }}{{
                    settings.formatNumber(monthlyBudget) }}
                </span>
              </div>
              <q-linear-progress :value="Math.min(totalSpent / monthlyBudget, 1)"
                :color="isOverBudget ? 'negative' : 'positive'" rounded size="10px" track-color="grey-8" />
              <div v-if="isOverBudget" class="text-caption q-mt-xs" style="color: #f87171">
                {{ $t('categories.overBudget', {
                  amount: settings.currency + settings.formatNumber(totalSpent -
                    monthlyBudget)
                }) }}
              </div>
              <div v-else class="text-caption q-mt-xs" style="color: #4ade80">
                {{ $t('categoryTransactions.remaining', {
                  amount: settings.currency +
                    settings.formatNumber(monthlyBudget - totalSpent)
                }) }}
              </div>
            </div>
            <div v-else class="text-center">
              <div class="text-caption" style="color: rgba(255,255,255,0.5)">{{ $t('dashboard.tapToSetBudget') }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
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

    <!-- Summary -->
    <div class="row justify-center q-gutter-sm q-mb-md" v-if="filteredTransactions.length">
      <div class="summary-chip" :class="category?.type === 'income' ? 'summary-chip-income' : 'summary-chip-expense'">
        <q-icon :name="category?.type === 'income' ? 'trending_up' : 'trending_down'" size="16px" />
        {{ $t('categoryTransactions.totalAmount') }}: {{ settings.currency }}{{ settings.formatNumber(filteredTotal) }}
      </div>
      <div class="summary-chip summary-chip-neutral">
        <q-icon name="receipt" size="16px" />
        {{ filteredTransactions.length }} {{ $t('categoryTransactions.transactions') }}
      </div>
    </div>

    <!-- Transaction List -->
    <q-card class="finance-card" v-if="filteredTransactions.length" style="border-radius: 16px; overflow: hidden;">
      <q-list separator>
        <q-slide-item v-for="tx in filteredTransactions" :key="tx.id" @left="({ reset }) => onEditTx(tx, reset)"
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
              <q-avatar :style="{ background: (category?.color || '#757575') + '20' }" size="40px">
                <q-icon :name="category?.icon || 'receipt'" :style="{ color: category?.color || '#757575' }"
                  size="20px" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ getAccountName(tx.accountId) }}</q-item-label>
              <q-item-label caption>{{ tx.notes }} &middot; {{ settings.formatDate(tx.date) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label :class="tx.type === 'income' ? 'amount-income' : 'amount-expense'"
                class="transaction-amount">
                {{ tx.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{ settings.formatNumber(tx.amount) }}
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
    </div>

    <!-- Budget Modal -->
    <q-dialog v-model="budgetModalOpen">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ category?.name }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveBudget" class="q-gutter-md">
            <!-- Month Selector -->
            <q-input v-model="budgetForm.month" :label="$t('common.month')" outlined dense color="dark" readonly>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="budgetMonthProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="budgetForm.month" emit-immediately minimal years-in-month-view
                      default-view="Months" mask="YYYY-MM" @update:model-value="onBudgetMonthSelect" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- Budget Amount -->
            <q-input v-model.number="budgetForm.amount" :label="$t('dashboard.budgetAmount')" outlined dense
              type="number" color="dark" :prefix="settings.currency" />

            <!-- Buttons -->
            <q-btn type="submit" :label="$t('common.save')" class="full-width bg-primary-gradient text-white" unelevated
              size="md" :loading="saving" />
          </q-form>
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
            <q-input v-model.number="editForm.amount" :label="$t('common.amount')" type="number" outlined color="dark"
              :prefix="settings.currency" :rules="[val => val > 0 || $t('common.validAmount')]"
              input-class="text-h6 text-weight-bold" class="q-mb-sm" />

            <q-select v-model="editForm.accountId" :options="accountOptions" :label="$t('common.account')" outlined
              color="dark" emit-value map-options class="q-mb-sm" />

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

            <q-input v-model="editForm.notes" :label="$t('common.noteOptional')" outlined color="dark" type="textarea"
              rows="2" class="q-mb-sm" />

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
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'

const route = useRoute()
const { t, locale } = useI18n()
const $q = useQuasar()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const accounts = useAccountStore()
const settings = useSettingsStore()

const categoryId = computed(() => route.params.id || '')
const category = computed(() => {
  const all = [...categories.incomeCategories, ...categories.expenseCategories]
  return all.find((c) => c.id === categoryId.value)
})

const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const editDialogOpen = ref(false)
const monthPickerOpen = ref(false)
const saving = ref(false)

const pickerMonth = ref(new Date().toISOString().slice(0, 7).replace('-', '/'))

// Budget Modal
const budgetModalOpen = ref(false)
const budgetMonthProxy = ref(null)
const budgetForm = reactive({
  month: '',
  amount: null,
})

const currentMonth = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})

function getMonthBudget(month) {
  if (!category.value || !category.value.budgets) return null
  return category.value.budgets[month] || null
}

function openBudgetModal() {
  budgetForm.month = displayMonth.value !== 'all' ? displayMonth.value : currentMonth.value
  budgetForm.amount = getMonthBudget(budgetForm.month)
  budgetModalOpen.value = true
}

function onBudgetMonthSelect(val) {
  if (val) {
    budgetForm.amount = getMonthBudget(val) || null
  }
  if (budgetMonthProxy.value) {
    budgetMonthProxy.value.hide()
  }
}

async function saveBudget() {
  if (!category.value || !budgetForm.month) return
  saving.value = true
  try {
    await categories.setMonthlyBudget(category.value.id, budgetForm.month, budgetForm.amount || 0)
    $q.notify({ type: 'positive', message: t('categories.categoryUpdated'), position: 'top' })
    budgetModalOpen.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  } finally {
    saving.value = false
  }
}

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

// All transactions for this category (transactions store category by name)
const categoryTransactions = computed(() =>
  transactions.transactions.filter((tx) => tx.category === category.value?.name),
)

const displayMonth = computed(() => selectedMonth.value === 'all' ? new Date().toISOString().slice(0, 7) : selectedMonth.value)

const monthlyBudget = computed(() => {
  if (!category.value || !category.value.budgets) return null
  return category.value.budgets[displayMonth.value] || null
})

// Total spent for the displayed month budget tracking
const totalSpent = computed(() => {
  return categoryTransactions.value
    .filter((tx) => tx.date && tx.date.startsWith(displayMonth.value))
    .reduce((sum, tx) => sum + (tx.amount || 0), 0)
})

const isOverBudget = computed(() => monthlyBudget.value && totalSpent.value > monthlyBudget.value)

const availableMonths = computed(() => {
  const months = new Set()
  categoryTransactions.value.forEach((tx) => {
    if (tx.date) {
      months.add(tx.date.slice(0, 7))
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
  let list = [...categoryTransactions.value]

  if (selectedMonth.value !== 'all') {
    list = list.filter((tx) => tx.date && tx.date.startsWith(selectedMonth.value))
  }

  return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
})

const filteredTotal = computed(() =>
  filteredTransactions.value.reduce((sum, tx) => sum + (tx.amount || 0), 0),
)

const accountOptions = computed(() =>
  accounts.accounts.map((a) => ({
    label: `${a.name} (${settings.currency}${settings.formatNumber(a.balance || 0)})`,
    value: a.id,
  })),
)

function getAccountName(accountId) {
  const acc = accounts.accounts.find((a) => a.id === accountId)
  return acc ? acc.name : ''
}

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
      accountId: editForm.accountId,
      date: editForm.date,
      time: editForm.time,
      notes: editForm.notes,
    }

    if (editForm.type === 'income' || editForm.type === 'expense') {
      const sign = editForm.type === 'income' ? 1 : -1
      const oldAmount = editForm.originalAmount || 0
      const newAmount = editForm.amount

      if (editForm.originalAccountId) {
        await accounts.updateBalance(editForm.originalAccountId, -sign * oldAmount)
      }
      if (editForm.accountId) {
        await accounts.updateBalance(editForm.accountId, sign * newAmount)
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

function onDeleteTx(id, reset) {
  transactions.deleteTransaction(id)
  reset()
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
