<template>
  <q-page class="page-container">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="page-title">{{ $t('loans.title') }}</div>
        <div class="page-subtitle">{{ loanStore.loans.length }}{{ $t('loans.countSuffix') }}</div>
      </div>
      <q-btn round flat dense icon="add_circle" size="md"
        style="color: #1a1a2e; background: rgba(26,26,46,0.06); border-radius: 14px;" @click="openAddDialog" />
    </div>

    <!-- Summary Cards -->
    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-6">
        <q-card class="finance-card" style="border-left: 4px solid #22c55e;">
          <q-card-section class="q-py-sm q-px-md">
            <div class="text-caption text-grey-7">{{ $t('loans.totalReceivable') }}</div>
            <div class="text-h6 text-weight-bold" style="color: #22c55e;">
              {{ settings.currency }}{{ settings.formatNumber(loanStore.totalReceivable) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6">
        <q-card class="finance-card" style="border-left: 4px solid #ef4444;">
          <q-card-section class="q-py-sm q-px-md">
            <div class="text-caption text-grey-7">{{ $t('loans.totalPayable') }}</div>
            <div class="text-h6 text-weight-bold" style="color: #ef4444;">
              {{ settings.currency }}{{ settings.formatNumber(loanStore.totalPayable) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loanStore.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <template v-else>
      <!-- Tabs -->
      <q-tabs v-model="activeTab" dense active-color="dark" indicator-color="dark" class="text-grey-6 q-mb-md"
        narrow-indicator>
        <q-tab name="receivable" :label="$t('loans.receivable')" />
        <q-tab name="payable" :label="$t('loans.payable')" />
      </q-tabs>

      <!-- Receivable Tab -->
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="receivable" class="q-pa-none">
          <div v-if="activeLoans(loanStore.receivables).length" class="q-mb-md">
            <div class="page-section-title">{{ $t('loans.activeLoans') }}</div>
            <div class="row q-col-gutter-sm">
              <div v-for="loan in activeLoans(loanStore.receivables)" :key="loan.id" class="col-12 col-md-6">
                <loan-card :loan="loan" color="#22c55e" @click="openDetail(loan)" @delete="confirmDelete(loan)"
                  @pay="openPaymentDialog(loan)" />
              </div>
            </div>
          </div>

          <div v-if="settledLoans(loanStore.receivables).length" class="q-mb-md">
            <div class="page-section-title">{{ $t('loans.settledLoans') }}</div>
            <div class="row q-col-gutter-sm">
              <div v-for="loan in settledLoans(loanStore.receivables)" :key="loan.id" class="col-12 col-md-6">
                <loan-card :loan="loan" color="#22c55e" settled @click="openDetail(loan)"
                  @delete="confirmDelete(loan)" />
              </div>
            </div>
          </div>

          <div v-if="!loanStore.receivables.length" class="empty-state">
            <q-icon name="account_balance" size="60px" />
            <div class="empty-state-title">{{ $t('loans.noReceivables') }}</div>
            <div class="empty-state-subtitle">{{ $t('loans.addPrompt') }}</div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="payable" class="q-pa-none">
          <div v-if="activeLoans(loanStore.payables).length" class="q-mb-md">
            <div class="page-section-title">{{ $t('loans.activeLoans') }}</div>
            <div class="row q-col-gutter-sm">
              <div v-for="loan in activeLoans(loanStore.payables)" :key="loan.id" class="col-12 col-md-6">
                <loan-card :loan="loan" color="#ef4444" @click="openDetail(loan)" @delete="confirmDelete(loan)"
                  @pay="openPaymentDialog(loan)" />
              </div>
            </div>
          </div>

          <div v-if="settledLoans(loanStore.payables).length" class="q-mb-md">
            <div class="page-section-title">{{ $t('loans.settledLoans') }}</div>
            <div class="row q-col-gutter-sm">
              <div v-for="loan in settledLoans(loanStore.payables)" :key="loan.id" class="col-12 col-md-6">
                <loan-card :loan="loan" color="#ef4444" settled @click="openDetail(loan)"
                  @delete="confirmDelete(loan)" />
              </div>
            </div>
          </div>

          <div v-if="!loanStore.payables.length" class="empty-state">
            <q-icon name="account_balance" size="60px" />
            <div class="empty-state-title">{{ $t('loans.noPayables') }}</div>
            <div class="empty-state-subtitle">{{ $t('loans.addPrompt') }}</div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <!-- Add Loan Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ $t('loans.newLoan') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="saveLoan">
            <!-- Type -->
            <q-option-group v-model="addForm.type" :options="loanTypeOptions" inline color="dark" class="q-mb-md" />

            <!-- Person Name -->
            <q-input v-model="addForm.personName" :label="$t('loans.personName')" outlined dense color="dark"
              :rules="[(val) => (val && val.length > 0) || $t('common.nameRequired')]" style="margin-bottom: 10px;" />

            <!-- Amount -->
            <q-input v-model.number="addForm.amount" :label="$t('common.amount')" type="number" outlined dense
              color="dark" :prefix="settings.currency"
              :rules="[val => val > 0 || $t('common.validAmount')]" style="margin-bottom: 10px;" />

            <!-- Date -->
            <q-input v-model="addForm.date" :label="$t('common.date')" outlined dense color="dark" readonly
              :rules="[val => !!val || $t('common.dateRequired')]" style="margin-bottom: 10px;">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="addForm.date" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- Notes -->
            <q-input v-model="addForm.notes" :label="$t('common.noteOptional')" outlined dense color="dark"
              type="textarea" rows="2" style="margin-bottom: 10px;" />

            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="$t('loans.addLoan')" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Payment Dialog -->
    <q-dialog v-model="showPaymentDialog">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ payingLoan?.type === 'receivable' ? $t('loans.receivePayment') : $t('loans.makePayment') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <!-- Loan Info -->
          <div class="q-mb-md" style="background: #f8fafc; border-radius: 12px; padding: 12px;">
            <div class="row items-center justify-between">
              <div>
                <div class="text-subtitle2 text-weight-bold">{{ payingLoan?.personName }}</div>
                <div class="text-caption text-grey-7">
                  {{ $t('loans.remaining') }}:
                  {{ settings.currency }}{{ settings.formatNumber((payingLoan?.amount || 0) - (payingLoan?.paidAmount || 0)) }}
                </div>
              </div>
            </div>
          </div>

          <q-form @submit.prevent="savePayment">
            <!-- Amount -->
            <q-input v-model.number="payForm.amount" :label="$t('common.amount')" type="number" outlined dense
              color="dark" :prefix="settings.currency"
              :rules="[val => val > 0 || $t('common.validAmount'), val => val <= remainingAmount || $t('loans.exceedsRemaining')]"
              style="margin-bottom: 10px;" />

            <!-- Account -->
            <q-select v-model="payForm.accountId" :options="accountOptions" :label="$t('common.account')" outlined
              dense color="dark" emit-value map-options
              :rules="[val => !!val || $t('common.accountRequired')]" style="margin-bottom: 10px;" />

            <!-- Date -->
            <q-input v-model="payForm.date" :label="$t('common.date')" outlined dense color="dark" readonly
              :rules="[val => !!val || $t('common.dateRequired')]" style="margin-bottom: 10px;">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="payForm.date" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- Notes -->
            <q-input v-model="payForm.notes" :label="$t('common.noteOptional')" outlined dense color="dark"
              type="textarea" rows="2" style="margin-bottom: 10px;" />

            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="payingLoan?.type === 'receivable' ? $t('loans.receiveBtn') : $t('loans.payBtn')"
              :loading="paymentSaving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Loan Detail Dialog -->
    <q-dialog v-model="showDetailDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card style="background: #f8fafc;">
        <!-- Detail Header -->
        <q-toolbar class="bg-white text-dark" style="border-bottom: 1px solid #e2e8f0;">
          <q-btn flat round dense icon="arrow_back" @click="showDetailDialog = false" />
          <q-toolbar-title class="text-weight-bold" style="font-size: 1.1rem;">
            {{ detailLoan?.personName }}
          </q-toolbar-title>
          <q-chip :color="detailLoan?.settled ? 'positive' : 'warning'" text-color="white" dense size="sm">
            {{ detailLoan?.settled ? $t('loans.settled') : $t('loans.active') }}
          </q-chip>
        </q-toolbar>

        <q-page-container>
          <div style="max-width: 700px; margin: 0 auto; padding: 16px;">
            <!-- Summary Card -->
            <q-card class="finance-card q-mb-md"
              :style="{ borderLeft: '4px solid ' + (detailLoan?.type === 'receivable' ? '#22c55e' : '#ef4444') }">
              <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-caption text-grey-7">
                    {{ detailLoan?.type === 'receivable' ? $t('loans.lentTo') : $t('loans.borrowedFrom') }}
                  </div>
                  <div class="text-caption text-grey-7">{{ formatDate(detailLoan?.date) }}</div>
                </div>
                <div class="text-h5 text-weight-bold q-mb-sm">
                  {{ settings.currency }}{{ settings.formatNumber(detailLoan?.amount || 0) }}
                </div>
                <q-linear-progress :value="progressValue" rounded size="8px" class="q-mb-xs"
                  :color="detailLoan?.type === 'receivable' ? 'positive' : 'negative'" track-color="grey-3" />
                <div class="row items-center justify-between">
                  <div class="text-caption text-grey-7">
                    {{ $t('loans.paid') }}: {{ settings.currency }}{{ settings.formatNumber(detailLoan?.paidAmount || 0) }}
                  </div>
                  <div class="text-caption text-weight-medium"
                    :style="{ color: detailLoan?.type === 'receivable' ? '#22c55e' : '#ef4444' }">
                    {{ $t('loans.remaining') }}: {{ settings.currency }}{{ settings.formatNumber(detailRemaining) }}
                  </div>
                </div>
                <div v-if="detailLoan?.notes" class="text-caption text-grey-7 q-mt-sm">
                  {{ detailLoan.notes }}
                </div>
              </q-card-section>
            </q-card>

            <!-- Payment History -->
            <div class="page-section-title">{{ $t('loans.paymentHistory') }}</div>
            <div v-if="detailLoan?.payments?.length">
              <q-card v-for="(p, idx) in sortedPayments" :key="idx" class="finance-card q-mb-sm">
                <q-card-section class="q-py-sm">
                  <div class="row items-center justify-between">
                    <div>
                      <div class="text-subtitle2 text-weight-bold"
                        :style="{ color: detailLoan?.type === 'receivable' ? '#22c55e' : '#ef4444' }">
                        {{ settings.currency }}{{ settings.formatNumber(p.amount) }}
                      </div>
                      <div class="text-caption text-grey-7">{{ formatDate(p.date) }}</div>
                      <div v-if="p.notes" class="text-caption text-grey-6">{{ p.notes }}</div>
                    </div>
                    <q-icon name="check_circle"
                      :color="detailLoan?.type === 'receivable' ? 'positive' : 'negative'" size="24px" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div v-else class="empty-state q-mt-md">
              <q-icon name="history" size="48px" />
              <div class="empty-state-title">{{ $t('loans.noPayments') }}</div>
            </div>

            <!-- Pay Button -->
            <q-btn v-if="!detailLoan?.settled" class="full-width bg-primary-gradient q-mt-md" text-color="white"
              rounded unelevated size="lg"
              :icon="detailLoan?.type === 'receivable' ? 'call_received' : 'call_made'"
              :label="detailLoan?.type === 'receivable' ? $t('loans.receivePayment') : $t('loans.makePayment')"
              @click="openPaymentFromDetail" />
          </div>
        </q-page-container>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useLoanStore } from 'stores/loanStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'
import LoanCard from 'components/LoanCard.vue'

const { t } = useI18n()
const $q = useQuasar()
const loanStore = useLoanStore()
const transactionStore = useTransactionStore()
const accountStore = useAccountStore()
const settings = useSettingsStore()

const activeTab = ref('receivable')
const showAddDialog = ref(false)
const showPaymentDialog = ref(false)
const showDetailDialog = ref(false)
const saving = ref(false)
const paymentSaving = ref(false)
const payingLoan = ref(null)
const detailLoan = ref(null)

const now = new Date()

const addForm = reactive({
  type: 'receivable',
  personName: '',
  amount: null,
  date: now.toISOString().slice(0, 10),
  notes: '',
})

const payForm = reactive({
  amount: null,
  accountId: null,
  date: now.toISOString().slice(0, 10),
  notes: '',
})

const loanTypeOptions = computed(() => [
  { label: t('loans.receivable'), value: 'receivable' },
  { label: t('loans.payable'), value: 'payable' },
])

const accountOptions = computed(() =>
  accountStore.accounts.map((a) => ({
    label: `${a.name} (${settings.currency}${settings.formatNumber(a.balance || 0)})`,
    value: a.id,
  })),
)

const remainingAmount = computed(() => {
  if (!payingLoan.value) return 0
  return (payingLoan.value.amount || 0) - (payingLoan.value.paidAmount || 0)
})

const detailRemaining = computed(() => {
  if (!detailLoan.value) return 0
  return (detailLoan.value.amount || 0) - (detailLoan.value.paidAmount || 0)
})

const progressValue = computed(() => {
  if (!detailLoan.value || !detailLoan.value.amount) return 0
  return (detailLoan.value.paidAmount || 0) / detailLoan.value.amount
})

const sortedPayments = computed(() => {
  if (!detailLoan.value?.payments) return []
  return [...detailLoan.value.payments].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
})

function activeLoans(list) {
  return list.filter((l) => !l.settled)
}

function settledLoans(list) {
  return list.filter((l) => l.settled)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const locale = settings.language === 'bn' ? 'bn-BD' : 'en-US'
  return new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
}

function openAddDialog() {
  addForm.type = activeTab.value
  addForm.personName = ''
  addForm.amount = null
  addForm.date = new Date().toISOString().slice(0, 10)
  addForm.notes = ''
  showAddDialog.value = true
}

async function saveLoan() {
  if (!addForm.personName || !addForm.amount || addForm.amount <= 0) return
  saving.value = true
  try {
    await loanStore.addLoan({ ...addForm })
    $q.notify({ type: 'positive', message: t('loans.loanAdded'), position: 'top' })
    showAddDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

function openPaymentDialog(loan) {
  payingLoan.value = loan
  payForm.amount = null
  payForm.accountId = null
  payForm.date = new Date().toISOString().slice(0, 10)
  payForm.notes = ''
  showPaymentDialog.value = true
}

function openPaymentFromDetail() {
  openPaymentDialog(detailLoan.value)
}

async function savePayment() {
  if (!payForm.amount || payForm.amount <= 0 || !payForm.accountId) return
  paymentSaving.value = true
  try {
    const loan = payingLoan.value
    const isReceivable = loan.type === 'receivable'

    // Create transaction (income for receivable, expense for payable)
    const txData = {
      type: isReceivable ? 'income' : 'expense',
      amount: payForm.amount,
      category: isReceivable ? t('loans.loanRepayment') : t('loans.loanPayment'),
      accountId: payForm.accountId,
      date: payForm.date,
      time: new Date().toTimeString().slice(0, 5),
      notes: `${isReceivable ? t('loans.receivedFrom') : t('loans.paidTo')} ${loan.personName}${payForm.notes ? ' - ' + payForm.notes : ''}`,
    }
    await transactionStore.addTransaction(txData)

    // Update account balance
    const balanceChange = isReceivable ? payForm.amount : -payForm.amount
    await accountStore.updateBalance(payForm.accountId, balanceChange)

    // Record payment in loan
    await loanStore.addPayment(loan.id, {
      amount: payForm.amount,
      date: payForm.date,
      notes: payForm.notes,
    })

    // Refresh detail if open
    if (showDetailDialog.value && detailLoan.value?.id === loan.id) {
      detailLoan.value = loanStore.loans.find((l) => l.id === loan.id)
    }

    $q.notify({ type: 'positive', message: t('loans.paymentRecorded'), position: 'top' })
    showPaymentDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  paymentSaving.value = false
}

function openDetail(loan) {
  detailLoan.value = loan
  showDetailDialog.value = true
}

function confirmDelete(loan) {
  $q.dialog({
    title: t('loans.deleteLoan'),
    message: `"${loan.personName}" - ${settings.currency}${settings.formatNumber(loan.amount)} ${t('loans.deleteConfirm')}`,
    ok: { label: t('common.delete'), color: 'negative', flat: true },
    cancel: { label: t('common.cancel'), flat: true },
  }).onOk(async () => {
    await loanStore.deleteLoan(loan.id)
    if (showDetailDialog.value && detailLoan.value?.id === loan.id) {
      showDetailDialog.value = false
    }
    $q.notify({ type: 'positive', message: t('loans.loanDeleted'), position: 'top' })
  })
}

onMounted(() => {
  loanStore.listenLoans()
  accountStore.listenAccounts()
  transactionStore.listenTransactions()
})

onUnmounted(() => {
  loanStore.stopListening()
  accountStore.stopListening()
  transactionStore.stopListening()
})
</script>
