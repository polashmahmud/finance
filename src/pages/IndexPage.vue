<template>
  <q-page class="dashboard-page">
    <div class="row q-col-gutter-lg">

      <!-- LEFT COLUMN -->
      <div class="col-12 col-md-7">

        <!-- Greeting -->
        <div class="greeting-header q-mb-md q-mt-xs">
          <div class="col">
            <div class="text-h5 text-weight-bold" style="color: #1a1a2e; letter-spacing: -0.02em;">
              {{ $t('dashboard.hello') }}, {{ userName }}!
            </div>
            <div class="text-body2" style="color: #8e8ea0; margin-top: 2px;">{{ greeting }}</div>
          </div>
          <div class="greeting-icon-wrap">
            <img :src="greetingIcon.src" :alt="greetingIcon.alt"
              style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover;" />
          </div>
        </div>

        <!-- Total Balance Card -->
        <q-card class="balance-overview-card q-mb-lg cursor-pointer" @click="$router.push('/dashboard/accounts')"
          v-ripple>
          <q-card-section class="balance-card-gradient">
            <!-- Animated orbs -->
            <div class="balance-orb balance-orb-1"></div>
            <div class="balance-orb balance-orb-2"></div>
            <div class="balance-orb balance-orb-3"></div>
            <div class="balance-shimmer"></div>
            <div class="row items-center no-wrap" style="position: relative; z-index: 1;">
              <div class="col">
                <div class="balance-label">{{ $t('dashboard.totalBalance') }}</div>
                <div class="balance-amount">{{ settings.currency }}{{ settings.formatNumber(accounts.totalBalance) }}
                </div>
                <div class="row q-gutter-sm q-mt-sm">
                  <div class="income-chip">
                    <q-icon name="arrow_upward" size="14px" style="color: #4ade80;" />
                    <span class="ie-label">{{ $t('common.income') }}</span>
                    <span class="ie-value income-value">{{ settings.currency }}{{
                      settings.formatNumber(transactions.totalIncome) }}</span>
                  </div>
                  <div class="expense-chip">
                    <q-icon name="arrow_downward" size="14px" style="color: #f87171;" />
                    <span class="ie-label">{{ $t('common.expense') }}</span>
                    <span class="ie-value expense-value">{{ settings.currency }}{{
                      settings.formatNumber(transactions.totalExpense) }}</span>
                  </div>
                </div>
              </div>
              <div class="balance-emoji">
                {{ balanceEmoji }}
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Recent Transactions (desktop: in left col) -->
        <template v-if="$q.screen.gt.sm">
          <div class="dash-section-header row items-center justify-between q-mb-sm">
            <div class="dash-section-title">{{ $t('dashboard.recentTransactions') }}</div>
            <q-btn flat dense no-caps color="dark" :label="$t('allTransactions.viewAll')" icon-right="chevron_right"
              @click="$router.push('/dashboard/all-transactions')" size="sm" />
          </div>
          <q-card class="finance-card tx-card" style="overflow: hidden;">
            <q-list separator>
              <q-slide-item v-for="tx in transactions.recentTransactions" :key="tx.id"
                @left="({ reset }) => onEditTx(tx, reset)" @right="({ reset }) => onDeleteTx(tx, reset)">
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

      <!-- RIGHT COLUMN -->
      <div class="col-12 col-md-5">

        <!-- Accounts -->
        <div class="dash-section-header row items-center justify-between q-mb-sm">
          <div class="dash-section-title">{{ $t('dashboard.accounts') }}</div>
        </div>
        <div class="accounts-scroll-row q-mb-md">
          <q-card v-for="account in accounts.accounts" :key="account.id"
            class="finance-card account-card cursor-pointer"
            @click="$router.push('/dashboard/account/' + account.id + '/transactions')" v-ripple>
            <q-card-section class="q-pa-md">
              <div class="row items-center no-wrap q-gutter-sm">
                <q-avatar :style="{ background: (account.color || '#757575') + '15' }" size="42px">
                  <q-icon :name="account.icon" :style="{ color: account.color || '#757575' }" size="22px" />
                </q-avatar>
                <div>
                  <div style="font-size: 0.78rem; color: #8e8ea0; font-weight: 500;">
                    {{ account.type === 'Cash' ? $t('dashboard.cash') : account.type === 'Bank' ? $t('dashboard.bank') :
                      $t('dashboard.mobile') }}
                  </div>
                  <div class="text-subtitle2 text-weight-bold" style="color: #1a1a2e;">
                    {{ settings.currency }}{{ settings.formatNumber(account.balance) }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Budget Status -->
        <div class="dash-section-header row items-center justify-between q-mb-sm">
          <div class="dash-section-title">{{ $t('dashboard.budgetStatus') }}</div>
          <div class="row items-center q-gutter-xs">
            <span class="text-caption" style="color: #8e8ea0;">{{ $t('dashboard.quickEntry') }}</span>
            <q-toggle v-model="quickEntry" color="dark" dense @update:model-value="onQuickEntryChange" />
          </div>
        </div>
        <div class="budget-scroll-container q-mb-md">
          <div v-for="cat in categories.expenseCategories" :key="cat.id" class="budget-scroll-item">
            <q-card class="budget-fill-card finance-card cursor-pointer" @click="onBudgetCardClick(cat)">
              <!-- Fill overlay: rises from bottom based on spent percentage -->
              <div v-if="getCurrentMonthBudget(cat)" class="budget-fill-bg" :style="{
                background: getCategorySpent(cat.name) > getCurrentMonthBudget(cat) ? '#ef444430' : cat.color + '25',
                height: Math.min((getCategorySpent(cat.name) / getCurrentMonthBudget(cat)) * 100, 100) + '%'
              }"></div>
              <q-card-section class="column items-center q-pa-sm budget-fill-content">
                <q-avatar :style="{ background: cat.color + '18' }" size="40px" class="q-mb-xs">
                  <q-icon :name="cat.icon" :style="{ color: cat.color }" size="20px" />
                </q-avatar>
                <div class="text-center ellipsis full-width" style="font-size: 11px; font-weight: 600; color: #1a1a2e;">
                  {{ cat.name }}
                </div>
                <div v-if="getCurrentMonthBudget(cat)" class="text-caption q-mt-xs"
                  style="font-size: 9px; color: #8e8ea0;">
                  {{ settings.currency }}{{ formatShort(getCurrentMonthBudget(cat)) }}
                </div>
                <div v-else class="text-caption q-mt-xs text-center"
                  style="font-size: 9px; color: #b0b0c0; line-height: 1.2;">
                  {{ $t('dashboard.tapToSetBudget') }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Recent Transactions (mobile/tablet: at bottom of page) -->
        <template v-if="!$q.screen.gt.sm">
          <div class="dash-section-header row items-center justify-between q-mb-sm">
            <div class="dash-section-title">{{ $t('dashboard.recentTransactions') }}</div>
            <q-btn flat dense no-caps color="dark" :label="$t('allTransactions.viewAll')" icon-right="chevron_right"
              @click="$router.push('/dashboard/all-transactions')" size="sm" />
          </div>
          <q-card class="finance-card tx-card" style="overflow: hidden;">
            <q-list separator>
              <q-slide-item v-for="tx in transactions.recentTransactions" :key="tx.id"
                @left="({ reset }) => onEditTx(tx, reset)" @right="({ reset }) => onDeleteTx(tx, reset)">
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
                <div class="text-weight-medium">{{ deleteTxData?.category }}</div>
                <div class="text-caption text-grey">{{ settings.formatDate(deleteTxData?.date) }}</div>
              </div>
              <q-space />
              <div :class="deleteTxData?.type === 'income' ? 'amount-income' : 'amount-expense'"
                class="text-weight-bold">
                {{ deleteTxData?.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{
                  settings.formatNumber(deleteTxData?.amount) }}
              </div>
            </div>
          </div>

          <!-- Account balance question -->
          <div v-if="deleteTxData?.accountId" class="text-body2 q-mb-md text-grey-8">
            <template v-if="deleteTxData.type === 'expense'">
              {{ $t('dashboard.deleteExpenseConfirm', {
                amount: settings.currency +
                  settings.formatNumber(deleteTxData.amount), account: getAccountName(deleteTxData.accountId)
              }) }}
            </template>
            <template v-else-if="deleteTxData.type === 'income'">
              {{ $t('dashboard.deleteIncomeConfirm', {
                amount: settings.currency +
                  settings.formatNumber(deleteTxData.amount), account: getAccountName(deleteTxData.accountId)
              }) }}
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
import { useAuthStore } from 'stores/authStore'

const { t } = useI18n()
const $q = useQuasar()
const $router = useRouter()
const accounts = useAccountStore()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const settings = useSettingsStore()
const authStore = useAuthStore()

const editDialogOpen = ref(false)
const saving = ref(false)

// Delete Confirmation
const deleteConfirmOpen = ref(false)
const deleteTxData = ref(null)
let deleteTxResetFn = null

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
  } finally {
    saving.value = false
  }
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
  } finally {
    saving.value = false
  }
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

const userName = computed(() => {
  return authStore.userProfile?.name || authStore.user?.email?.split('@')[0] || t('dashboard.user')
})

const greetingIcon = computed(() => {
  // Returns image paths for different times of day
  // sunrise.png - morning (5am-12pm)
  // mid-day.png - afternoon (12pm-5pm)
  // sunset.png - evening (5pm-8pm)
  // night.png - night (8pm-5am)
  if (hour >= 5 && hour < 12) return { src: '/img/sunrise.png', alt: 'morning' }
  if (hour >= 12 && hour < 17) return { src: '/img/mid-day.png', alt: 'afternoon' }
  if (hour >= 17 && hour < 20) return { src: '/img/sunset.png', alt: 'evening' }
  return { src: '/img/night.png', alt: 'night' }
})

function getCategorySpent(categoryName) {
  return transactions.transactions
    .filter((t) => t.type === 'expense' && t.category === categoryName)
    .reduce((sum, t) => sum + t.amount, 0)
}

function formatShort(num) {
  if (num == null) return '0'
  const n = Math.abs(num)
  if (n >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr'
  if (n >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L'
  if (n >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return settings.formatNumber(num)
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
  } finally {
    saving.value = false
  }
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
</script>

<style scoped>
.dashboard-page {
  padding: 12px 16px 80px;
}

/* Greeting header */
.greeting-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.greeting-icon-wrap {
  flex-shrink: 0;
  margin-left: 12px;
}

/* Section headers */
.dash-section-header {
  padding: 8px 4px 0;
}

.dash-section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.75);
  letter-spacing: -0.01em;
}

/* Balance Card */
.balance-overview-card {
  border-radius: 20px !important;
  border: none !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18) !important;
  overflow: hidden;
}

.balance-card-gradient {
  background: linear-gradient(145deg, #2d2d3a 0%, #1a1a2a 50%, #111118 100%) !important;
  background-size: 200% 200% !important;
  animation: gradientShift 8s ease infinite;
  padding: 22px 24px !important;
  position: relative;
  overflow: hidden;
}

.balance-card-gradient::before {
  content: '';
  position: absolute;
  top: -60%;
  right: -15%;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* Floating orbs */
.balance-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(40px);
  opacity: 0.35;
}

.balance-orb-1 {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #6366f1 0%, transparent 70%);
  top: -30px;
  right: -20px;
  animation: orbFloat1 6s ease-in-out infinite;
}

.balance-orb-2 {
  width: 90px;
  height: 90px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  bottom: -20px;
  left: 20%;
  animation: orbFloat2 8s ease-in-out infinite;
}

.balance-orb-3 {
  width: 70px;
  height: 70px;
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
  top: 50%;
  right: 30%;
  animation: orbFloat3 7s ease-in-out infinite;
}

/* Shimmer sweep */
.balance-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(105deg,
      transparent 0%,
      rgba(255, 255, 255, 0.03) 40%,
      rgba(255, 255, 255, 0.07) 50%,
      rgba(255, 255, 255, 0.03) 60%,
      transparent 100%);
  animation: shimmerSweep 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes gradientShift {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes orbFloat1 {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(-15px, 10px) scale(1.1);
  }

  66% {
    transform: translate(10px, -8px) scale(0.95);
  }
}

@keyframes orbFloat2 {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  40% {
    transform: translate(20px, -12px) scale(1.15);
  }

  70% {
    transform: translate(-10px, 8px) scale(0.9);
  }
}

@keyframes orbFloat3 {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(-12px, -15px) scale(1.1);
  }
}

@keyframes shimmerSweep {
  0% {
    left: -100%;
  }

  100% {
    left: 200%;
  }
}

.balance-label {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
  letter-spacing: 0.03em;
}

.balance-amount {
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-top: 4px;
}

.income-chip,
.expense-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
}

.income-chip {
  background: rgba(74, 222, 128, 0.12);
}

.expense-chip {
  background: rgba(248, 113, 113, 0.12);
}

.ie-label {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.7rem;
  font-weight: 500;
}

.ie-value {
  font-weight: 700;
  font-size: 0.8rem;
}

.income-value {
  color: #4ade80;
}

.expense-value {
  color: #f87171;
}

.balance-emoji {
  font-size: 4.5rem;
  user-select: none;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
  line-height: 1;
  flex-shrink: 0;
  margin-left: 12px;
}

/* Account cards */
.accounts-scroll-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.accounts-scroll-row::-webkit-scrollbar {
  display: none;
}

.account-card {
  min-width: 155px;
  flex-shrink: 0;
}

/* Budget scroll */
.budget-scroll-container {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.budget-scroll-container::-webkit-scrollbar {
  display: none;
}

.budget-scroll-item {
  flex: 0 0 auto;
  width: 80px;
}

/* Budget fill card */
.budget-fill-card {
  position: relative;
  overflow: hidden;
  min-height: 108px;
}

.budget-fill-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transition: height 0.5s ease;
  border-radius: 0 0 16px 16px;
  pointer-events: none;
}

.budget-fill-content {
  position: relative;
  z-index: 1;
}

/* Transaction card */
.tx-card {
  border-radius: 18px !important;
}

/* Desktop refinements */
@media (min-width: 600px) {
  .dashboard-page {
    padding-bottom: 24px;
  }

  .accounts-scroll-row {
    flex-wrap: wrap;
  }

  .account-card {
    flex: 1 1 calc(50% - 6px);
    min-width: 0;
  }

  .budget-scroll-container {
    flex-wrap: wrap;
  }

  .budget-scroll-item {
    width: calc(33.33% - 6px);
  }
}
</style>
