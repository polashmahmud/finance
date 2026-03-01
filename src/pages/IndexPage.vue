<template>
  <q-page class="q-pa-md">
    <!-- Responsive two-column layout: single col on mobile/tablet, two cols on desktop -->
    <div class="row q-col-gutter-lg">

      <!-- LEFT COLUMN: Greeting + Balance Card + Recent Transactions (desktop: beside right col) -->
      <div class="col-12 col-md-7">

        <!-- Greeting -->
        <div class="q-mb-md">
          <div class="text-caption text-grey">{{ greeting }} 👋</div>
          <div class="text-h5 text-weight-bold">{{ $t('dashboard.myFinance') }}</div>
        </div>

        <!-- Total Balance Card -->
        <q-card class="finance-card q-mb-md cursor-pointer" @click="$router.push('/dashboard/accounts')">
          <q-card-section class="bg-primary-gradient"
            style="border-radius: 16px; overflow: hidden; position: relative;">
            <div class="row items-center no-wrap">
              <!-- Left Content -->
              <div class="col-6">
                <div class="q-mb-sm">
                  <div class="text-body2" style="opacity: 0.9; color: rgba(255,255,255,0.8)">{{
                    $t('dashboard.totalBalance') }}</div>
                  <div class="stat-value text-white" style="font-size: 2rem; line-height: 1.2;">{{ settings.currency
                  }}{{ settings.formatNumber(accounts.totalBalance) }}</div>
                </div>
                <div class="row q-gutter-md q-mt-xs">
                  <div class="row items-center q-gutter-xs">
                    <q-icon name="trending_up" size="18px" style="color: #4ade80" />
                    <div>
                      <div style="font-size: 0.7rem; color: rgba(255,255,255,0.7)">{{ $t('common.income') }}</div>
                      <div class="text-white text-weight-bold" style="font-size: 0.85rem">{{ settings.currency }}{{
                        settings.formatNumber(transactions.totalIncome) }}</div>
                    </div>
                  </div>
                  <div class="row items-center q-gutter-xs">
                    <q-icon name="trending_down" size="18px" style="color: #f87171" />
                    <div>
                      <div style="font-size: 0.7rem; color: rgba(255,255,255,0.7)">{{ $t('common.expense') }}</div>
                      <div class="text-white text-weight-bold" style="font-size: 0.85rem">{{ settings.currency }}{{
                        settings.formatNumber(transactions.totalExpense) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Right Emoji -->
              <div class="col-6 flex justify-end items-center" style="height: 90px; overflow: visible;">
                <div style="font-size: 4rem; user-select: none; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
                  {{ balanceEmoji }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Recent Transactions (desktop: in left col) -->
        <template v-if="$q.screen.gt.sm">
          <div class="row items-center justify-between q-mb-sm">
            <div class="section-title q-mb-none">{{ $t('dashboard.recentTransactions') }}</div>
            <q-btn flat dense no-caps color="dark" :label="$t('allTransactions.viewAll')" icon-right="chevron_right"
              @click="$router.push('/dashboard/all-transactions')" size="sm" />
          </div>
          <q-card class="finance-card" style="border-radius: 16px; overflow: hidden;">
            <q-list separator>
              <q-slide-item v-for="tx in transactions.recentTransactions" :key="tx.id"
                @left="({ reset }) => onEditTx(tx, reset)" @right="({ reset }) => onDeleteTx(tx.id, reset)">
                <template v-slot:left>
                  <div class="row items-center"><q-icon name="edit" color="info" /></div>
                </template>
                <template v-slot:right>
                  <div class="row items-center"><q-icon name="delete" color="negative" /></div>
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
                    <q-item-label caption>{{ tx.notes }} &middot; {{ settings.formatDate(tx.date) }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label :class="tx.type === 'income' ? 'amount-income' : 'amount-expense'"
                      class="transaction-amount">
                      {{ tx.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{ settings.formatNumber(tx.amount)
                      }}
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
          <div class="text-center q-pa-md text-grey-6" style="font-size: 12px;"
            v-if="transactions.recentTransactions.length">
            <q-icon name="swipe" size="16px" class="q-mr-xs" />
            {{ $t('categories.swipeHint') }}
          </div>
        </template>

      </div>

      <!-- RIGHT COLUMN: Accounts + Budget Status + Recent Transactions (mobile: at bottom) -->
      <div class="col-12 col-md-5">

        <!-- Accounts -->
        <div class="section-title">{{ $t('dashboard.accounts') }}</div>
        <!-- Desktop: wrap grid, Mobile: horizontal scroll -->
        <div v-if="$q.screen.gt.sm" class="row q-col-gutter-sm q-mb-md">
          <div v-for="account in accounts.accounts" :key="account.id" class="col-6">
            <q-card class="finance-card cursor-pointer full-height"
              @click="$router.push('/dashboard/account/' + account.id + '/transactions')" v-ripple>
              <q-card-section class="q-pa-md">
                <div class="row items-center q-gutter-sm q-mb-sm">
                  <q-icon :name="account.icon" :style="{ color: account.color }" size="20px" />
                  <span class="text-caption text-grey">{{ account.type === 'Cash' ? $t('dashboard.cash') : account.type
                    ===
                    'Bank' ? $t('dashboard.bank') : $t('dashboard.mobile') }}</span>
                </div>
                <div class="text-body2 text-weight-medium">{{ account.name }}</div>
                <div class="text-subtitle1 text-weight-bold">{{ settings.currency }}{{
                  settings.formatNumber(account.balance)
                }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div v-else class="row q-gutter-md q-mb-md" style="overflow-x: auto; flex-wrap: nowrap; padding-bottom: 8px">
          <q-card v-for="account in accounts.accounts" :key="account.id" class="finance-card cursor-pointer"
            style="min-width: 160px; flex-shrink: 0"
            @click="$router.push('/dashboard/account/' + account.id + '/transactions')" v-ripple>
            <q-card-section class="q-pa-md">
              <div class="row items-center q-gutter-sm q-mb-sm">
                <q-icon :name="account.icon" :style="{ color: account.color }" size="20px" />
                <span class="text-caption text-grey">{{ account.type === 'Cash' ? $t('dashboard.cash') : account.type
                  ===
                  'Bank' ? $t('dashboard.bank') : $t('dashboard.mobile') }}</span>
              </div>
              <div class="text-body2 text-weight-medium">{{ account.name }}</div>
              <div class="text-subtitle1 text-weight-bold">{{ settings.currency }}{{
                settings.formatNumber(account.balance) }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Budget Status -->
        <div class="row items-center justify-between q-mb-sm">
          <div class="section-title q-mb-none">{{ $t('dashboard.budgetStatus') }}</div>
          <div class="row items-center q-gutter-xs">
            <span class="text-caption text-grey">{{ $t('dashboard.quickEntry') }}</span>
            <q-toggle v-model="quickEntry" color="dark" dense @update:model-value="onQuickEntryChange" />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mb-md">
          <div v-for="cat in categories.expenseCategories" :key="cat.id" class="col-3 col-sm-2 col-md-3">
            <q-card class="finance-card cursor-pointer column items-center q-pa-sm" style="min-height: 110px;"
              @click="onBudgetCardClick(cat)">
              <q-avatar :style="{ background: cat.color + '18' }" size="36px" class="q-mb-xs">
                <q-icon :name="cat.icon" :style="{ color: cat.color }" size="18px" />
              </q-avatar>
              <div class="text-body2 text-weight-medium text-center ellipsis" style="font-size: 11px; width: 100%;">
                {{ cat.name }}
              </div>
              <div v-if="getCurrentMonthBudget(cat)" class="text-caption q-mt-xs" style="font-size: 10px;">
                {{ settings.currency }}{{ settings.formatNumber(getCategorySpent(cat.name)) }} / {{ settings.currency
                }}{{
                  settings.formatNumber(getCurrentMonthBudget(cat)) }}
              </div>
              <div v-if="getCurrentMonthBudget(cat)" class="q-mt-xs" style="width: 100%;">
                <q-linear-progress :value="Math.min(getCategorySpent(cat.name) / getCurrentMonthBudget(cat), 1)"
                  :color="getCategorySpent(cat.name) > getCurrentMonthBudget(cat) ? 'negative' : 'positive'" rounded
                  size="6px" track-color="grey-3" />
              </div>
              <div v-else class="text-caption text-grey-5 q-mt-xs text-center leading-tight"
                style="font-size: 10px; line-height: 1.1;">
                {{ $t('dashboard.tapToSetBudget') }}
              </div>
            </q-card>
          </div>
        </div>

        <!-- Recent Transactions (mobile/tablet: at bottom of page) -->
        <template v-if="!$q.screen.gt.sm">
          <div class="row items-center justify-between q-mb-sm">
            <div class="section-title q-mb-none">{{ $t('dashboard.recentTransactions') }}</div>
            <q-btn flat dense no-caps color="dark" :label="$t('allTransactions.viewAll')" icon-right="chevron_right"
              @click="$router.push('/dashboard/all-transactions')" size="sm" />
          </div>
          <q-card class="finance-card" style="border-radius: 16px; overflow: hidden;">
            <q-list separator>
              <q-slide-item v-for="tx in transactions.recentTransactions" :key="tx.id"
                @left="({ reset }) => onEditTx(tx, reset)" @right="({ reset }) => onDeleteTx(tx.id, reset)">
                <template v-slot:left>
                  <div class="row items-center"><q-icon name="edit" color="info" /></div>
                </template>
                <template v-slot:right>
                  <div class="row items-center"><q-icon name="delete" color="negative" /></div>
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
                    <q-item-label caption>{{ tx.notes }} &middot; {{ settings.formatDate(tx.date) }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label :class="tx.type === 'income' ? 'amount-income' : 'amount-expense'"
                      class="transaction-amount">
                      {{ tx.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{ settings.formatNumber(tx.amount)
                      }}
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
          <div class="text-center q-pa-md text-grey-6" style="font-size: 12px;"
            v-if="transactions.recentTransactions.length">
            <q-icon name="swipe" size="16px" class="q-mr-xs" />
            {{ $t('categories.swipeHint') }}
          </div>
        </template>

      </div>
    </div>

    <!-- Budget Modal -->
    <q-dialog v-model="budgetModalOpen">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ budgetModalCategory?.name }}
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
            <div class="row q-gutter-md">
              <q-btn type="button" :label="$t('dashboard.details')" class="col bg-grey-2 text-dark" unelevated size="md"
                @click="goToCategoryDetails" :loading="saving" />
              <q-btn type="submit" :label="$t('common.save')" class="col bg-primary-gradient text-white" unelevated
                size="md" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Quick Entry Modal -->
    <q-dialog v-model="quickEntryModalOpen">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ quickEntryCategory?.name }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>

        <q-card-section class="q-px-lg">
          <q-form @submit.prevent="saveQuickEntry" class="q-gutter-md">
            <!-- Amount & Account (side by side) -->
            <div class="row q-col-gutter-md q-mb-sm">
              <div class="col-6">
                <q-input v-model.number="quickEntryForm.amount" :label="$t('common.amount')" type="number" outlined
                  color="dark" :prefix="settings.currency" :rules="[val => val > 0 || $t('common.validAmount')]"
                  autofocus input-class="text-h6 text-weight-bold" />
              </div>
              <div class="col-6">
                <q-select v-model="quickEntryForm.accountId" :options="accountOptions" :label="$t('common.account')"
                  outlined color="dark" emit-value map-options
                  :rules="[val => !!val || $t('common.accountRequired')]" />
              </div>
            </div>

            <!-- Note -->
            <div class="row q-col-gutter-md q-mb-sm">
              <div class="col-12">
                <q-input v-model="quickEntryForm.notes" :label="$t('common.noteOptional')" outlined color="dark"
                  type="textarea" rows="2" />
              </div>
            </div>

            <!-- Buttons -->
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-btn type="button" :label="$t('dashboard.details')" class="full-width bg-grey-2 text-dark" unelevated
                  size="md" @click="goToQuickEntryDetails" />
              </div>
              <div class="col-6">
                <q-btn type="submit" :label="$t('common.save')" class="full-width bg-primary-gradient text-white"
                  unelevated size="md" :loading="saving" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Transaction Dialog -->
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

            <q-select v-if="editForm.type !== 'transfer'" v-model="editForm.accountId" :options="accountOptions"
              :label="$t('common.account')" outlined color="dark" emit-value map-options class="q-mb-sm" />

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
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAccountStore } from 'stores/accountStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'

const { t } = useI18n()
const $q = useQuasar()
const $router = useRouter()
const accounts = useAccountStore()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const settings = useSettingsStore()

const editDialogOpen = ref(false)
const saving = ref(false)

// Quick Entry
const QUICK_ENTRY_KEY = 'dashboard_quick_entry'
const quickEntry = ref(localStorage.getItem(QUICK_ENTRY_KEY) === 'true')
function onQuickEntryChange(val) {
  localStorage.setItem(QUICK_ENTRY_KEY, val ? 'true' : 'false')
}

// Budget Modal
const budgetModalOpen = ref(false)
const budgetModalCategory = ref(null)
const budgetForm = reactive({
  month: '',
  amount: null,
})

// Quick Entry Modal (expense from category card)
const quickEntryModalOpen = ref(false)
const quickEntryCategory = ref(null)
const quickEntryForm = reactive({
  amount: null,
  category: '',
  accountId: null,
  notes: '',
})

// Get current month in YYYY-MM format
const currentMonth = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})

const budgetMonthProxy = ref(null)

function onBudgetMonthSelect(val) {
  if (val && budgetModalCategory.value) {
    const existingBudget = getMonthBudget(budgetModalCategory.value, val)
    budgetForm.amount = existingBudget || null
  }
  if (budgetMonthProxy.value) {
    budgetMonthProxy.value.hide()
  }
}

function getMonthBudget(cat, month) {
  if (!cat.budgets || !cat.budgets[month]) return null
  return cat.budgets[month]
}

function getCurrentMonthBudget(cat) {
  return getMonthBudget(cat, currentMonth.value)
}

function onBudgetCardClick(cat) {
  if (quickEntry.value) {
    quickEntryCategory.value = cat
    quickEntryForm.amount = null
    quickEntryForm.category = cat.name
    quickEntryForm.accountId = accounts.accounts[0]?.id || null
    quickEntryForm.notes = ''
    quickEntryModalOpen.value = true
  } else {
    openBudgetModal(cat)
  }
}

function openBudgetModal(cat) {
  budgetModalCategory.value = cat
  budgetForm.month = currentMonth.value
  const existingBudget = getMonthBudget(cat, budgetForm.month)
  budgetForm.amount = existingBudget || null
  budgetModalOpen.value = true
}

async function saveBudget() {
  if (!budgetModalCategory.value || !budgetForm.month) return
  saving.value = true
  try {
    await categories.setMonthlyBudget(budgetModalCategory.value.id, budgetForm.month, budgetForm.amount || 0)
    $q.notify({ type: 'positive', message: t('categories.categoryUpdated'), position: 'top' })
    budgetModalOpen.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

function goToCategoryDetails() {
  if (budgetModalCategory.value) {
    $router.push(`/dashboard/category/${budgetModalCategory.value.id}/transactions`)
  }
}

async function saveQuickEntry() {
  if (!quickEntryForm.amount || quickEntryForm.amount <= 0 || !quickEntryForm.accountId) return
  saving.value = true
  try {
    const now = new Date()
    await transactions.addTransaction({
      type: 'expense',
      amount: quickEntryForm.amount,
      category: quickEntryForm.category,
      accountId: quickEntryForm.accountId,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      notes: quickEntryForm.notes || '',
    })
    await accounts.updateBalance(quickEntryForm.accountId, -quickEntryForm.amount)
    $q.notify({ type: 'positive', message: t('addExpense.expenseAdded'), position: 'top' })
    quickEntryModalOpen.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

function goToQuickEntryDetails() {
  if (quickEntryCategory.value) {
    quickEntryModalOpen.value = false
    $router.push(`/dashboard/category/${quickEntryCategory.value.id}/transactions`)
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

const balanceEmoji = computed(() => {
  const bal = accounts.totalBalance || 0
  const emojis = settings.balanceEmojis || {
    negative: { emoji: '😭', threshold: 0 },
    low: { emoji: '😟', threshold: 500 },
    high: { emoji: '🤩' }
  }

  if (bal < emojis.negative.threshold) return emojis.negative.emoji
  if (bal <= emojis.low.threshold) return emojis.low.emoji
  return emojis.high.emoji
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
    label: `${a.name} (${settings.currency}${settings.formatNumber(a.balance || 0)})`,
    value: a.id,
  })),
)

function onDeleteTx(id, reset) {
  transactions.deleteTransaction(id)
  reset()
}
</script>
