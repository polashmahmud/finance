<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">{{ $t('accounts.title') }}</div>
        <div class="text-caption text-grey">{{ accountStore.accounts.length }}{{ $t('accounts.countSuffix') }}</div>
      </div>
      <q-btn round flat icon="add_circle" color="dark" size="lg" @click="openAddDialog" />
    </div>

    <!-- Total Balance Banner -->
    <q-card class="finance-card q-mb-lg">
      <q-card-section class="bg-primary-gradient" style="border-radius: 16px">
        <div class="text-center">
          <div class="text-body2" style="opacity: 0.9">{{ $t('accounts.totalAssets') }}</div>
          <div class="stat-value text-white">{{ settings.currency }}{{ settings.formatNumber(accountStore.totalBalance)
            }}</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Loading -->
    <div v-if="accountStore.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <template v-else>
      <!-- Account Cards -->
      <div class="row q-col-gutter-sm">
        <div v-for="account in accountStore.accounts" :key="account.id" class="col-12 col-md-6">
        <q-slide-item @left="(obj) => onSwipe(obj, 'edit', account)" @right="(obj) => onSwipe(obj, 'delete', account)"
          class="finance-card">
          <template v-slot:left>
            <q-icon name="edit" color="dark" />
          </template>
          <template v-slot:right>
            <q-icon name="delete" color="negative" />
          </template>

          <q-card class="finance-card">
            <q-item class="touch-target">
              <q-item-section avatar>
                <q-avatar :style="{ background: (account.color || '#111') + '18' }" size="48px">
                  <q-icon :name="account.icon || 'account_balance_wallet'" :style="{ color: account.color || '#111' }"
                    size="24px" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ account.name }}</q-item-label>
                <q-item-label caption>{{ getTypeLabel(account.type) }}</q-item-label>

                <!-- Last Transaction Info -->
                <div v-if="getLastTx(account.id)" class="row items-center q-mt-xs q-gutter-x-xs"
                  style="font-size: 0.75rem">
                  <q-icon
                    :name="getLastTx(account.id).type === 'income' ? 'arrow_downward' : (getLastTx(account.id).type === 'expense' ? 'arrow_upward' : 'sync_alt')"
                    :color="getLastTx(account.id).type === 'income' ? 'positive' : (getLastTx(account.id).type === 'expense' ? 'negative' : 'blue')"
                    size="12px" />
                  <span
                    :class="getLastTx(account.id).type === 'income' ? 'text-positive' : (getLastTx(account.id).type === 'expense' ? 'text-negative' : 'text-blue')">
                    {{ settings.currency }}{{ settings.formatNumber(getLastTx(account.id).amount) }}
                  </span>
                  <span class="text-grey-6 text-caption">- {{ settings.formatDate(getLastTx(account.id).date) }}</span>
                </div>
                <div v-else class="text-grey-6 text-caption q-mt-xs" style="font-size: 0.7rem">{{
                  $t('accounts.noTransactions') }}
                </div>
              </q-item-section>
              <q-item-section side top>
                <q-item-label class="text-subtitle1 text-weight-bold q-mt-sm">{{ settings.currency }}{{
                  settings.formatNumber(account.balance) }}</q-item-label>
                <!-- Desktop action buttons -->
                <div class="row q-gutter-xs q-mt-xs gt-sm">
                  <q-btn flat round dense icon="edit" size="sm" color="dark" @click.stop="openEditDialog(account)" />
                  <q-btn flat round dense icon="delete_outline" size="sm" color="negative" @click.stop="confirmDelete(account)" />
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </q-slide-item>
        </div>
      </div>

      <!-- Swipe Hint -->
      <div v-if="accountStore.accounts.length" class="text-center q-pa-md text-grey-6 q-mt-sm" style="font-size: 12px;">
        <q-icon name="swipe" size="16px" class="q-mr-xs" />
        {{ $t('categories.swipeHint') }}
      </div>

      <!-- Empty State -->
      <div v-if="!accountStore.accounts.length" class="text-center text-grey q-mt-xl">
        <q-icon name="account_balance_wallet" size="60px" class="q-mb-md" />
        <div class="text-h6">{{ $t('accounts.noAccounts') }}</div>
        <div class="text-body2">{{ $t('accounts.addPrompt') }}</div>
      </div>
    </template>

    <!-- Add/Edit Account Dialog -->
    <q-dialog v-model="showDialog">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ isEditing ? $t('accounts.editAccount') : $t('accounts.newAccount') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="saveAccount">
            <q-input v-model="form.name" :label="$t('accounts.accountName')" outlined dense autofocus color="dark"
              :rules="[(val) => (val && val.length > 0) || $t('common.nameRequired')]" style="margin-bottom: 10px;" />

            <q-select v-model="form.type" :options="accountTypeOptions" :label="$t('accounts.accountType')" outlined
              dense emit-value map-options color="dark" style="margin-bottom: 10px;" />

            <q-input v-model.number="form.balance" :label="$t('common.balance')" type="number" outlined dense
              color="dark" :prefix="settings.currency" style="margin-bottom: 10px;" />

            <!-- Icon Dropdown with visual previews -->
            <q-select v-model="form.icon" :options="iconOptions" :label="$t('common.icon')" outlined dense emit-value
              map-options color="dark" style="margin-bottom: 10px;">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.value" size="24px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <div class="row items-center q-gutter-sm">
                  <q-icon :name="scope.opt.value || scope.opt" size="20px" />
                  <span>{{ scope.opt.label || scope.opt }}</span>
                </div>
              </template>
            </q-select>

            <!-- Color Palette -->
            <div style="margin-bottom: 14px;">
              <div class="text-caption text-grey-7 q-mb-sm">{{ $t('common.selectColor') }}</div>
              <div class="row q-gutter-sm">
                <div v-for="color in colorPalette" :key="color" class="cursor-pointer" :style="{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: color,
                  border: form.color === color ? '3px solid #000' : '2px solid #e5e7eb',
                  transition: 'all 0.15s',
                }" @click="form.color = color" />
              </div>
            </div>

            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="isEditing ? $t('common.update') : $t('accounts.addAccount')" :loading="saving" />
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
import { useSettingsStore } from 'stores/settingsStore'

const { t } = useI18n()
const $q = useQuasar()
const accountStore = useAccountStore()
const transactionStore = useTransactionStore()
const settings = useSettingsStore()

const showDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = reactive({
  name: '',
  type: 'Cash',
  balance: 0,
  icon: 'account_balance_wallet',
  color: '#111111',
})

const iconOptions = computed(() => [
  { label: t('accounts.iconWallet'), value: 'account_balance_wallet' },
  { label: t('accounts.iconBank'), value: 'account_balance' },
  { label: t('accounts.iconMobile'), value: 'phone_android' },
  { label: t('accounts.iconCreditCard'), value: 'credit_card' },
  { label: t('accounts.iconSavings'), value: 'savings' },
  { label: t('accounts.iconMoney'), value: 'attach_money' },
  { label: t('accounts.iconInvestment'), value: 'trending_up' },
  { label: t('accounts.iconStore'), value: 'store' },
])

const accountTypeOptions = computed(() => [
  { label: t('accounts.cashType'), value: 'Cash' },
  { label: t('accounts.bankType'), value: 'Bank' },
  { label: t('accounts.mobileBankingType'), value: 'Mobile Banking' },
])

const colorPalette = [
  '#111111', '#444444', '#777777',
  '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#3b82f6',
  '#8b5cf6', '#ec4899', '#6b7280',
]

const typeLabels = computed(() => ({
  Cash: t('accounts.cashAccount'),
  Bank: t('accounts.bankAccount'),
  'Mobile Banking': t('accounts.mobileAccount'),
}))

function getTypeLabel(type) {
  return typeLabels.value[type] || type
}

function getLastTx(accountId) {
  if (!transactionStore.transactions || !transactionStore.transactions.length) return null
  const accountTxs = transactionStore.transactions.filter(t =>
    t.accountId === accountId || t.fromAccountId === accountId || t.toAccountId === accountId
  )
  if (!accountTxs.length) return null
  return accountTxs[0]
}

function openAddDialog() {
  isEditing.value = false
  editingId.value = null
  form.name = ''
  form.type = 'Cash'
  form.balance = 0
  form.icon = 'account_balance_wallet'
  form.color = '#111111'
  showDialog.value = true
}

function openEditDialog(account) {
  isEditing.value = true
  editingId.value = account.id
  form.name = account.name
  form.type = account.type
  form.balance = account.balance || 0
  form.icon = account.icon || 'account_balance_wallet'
  form.color = account.color || '#111111'
  showDialog.value = true
}

async function saveAccount() {
  if (!form.name) return
  saving.value = true
  try {
    if (isEditing.value) {
      await accountStore.updateAccount(editingId.value, { ...form })
      $q.notify({ type: 'positive', message: t('accounts.accountUpdated'), position: 'top' })
    } else {
      await accountStore.addAccount({ ...form })
      $q.notify({ type: 'positive', message: t('accounts.accountAdded'), position: 'top' })
    }
    showDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

function confirmDelete(account) {
  $q.dialog({
    title: t('accounts.deleteAccount'),
    message: `"${account.name}" ${t('accounts.deleteConfirm')}`,
    ok: { label: t('common.delete'), color: 'negative', flat: true },
    cancel: { label: t('common.cancel'), flat: true },
  }).onOk(async () => {
    await accountStore.deleteAccount(account.id)
    $q.notify({ type: 'positive', message: t('accounts.accountDeleted'), position: 'top' })
  })
}

function onSwipe({ reset }, action, account) {
  setTimeout(() => {
    if (action === 'edit') {
      openEditDialog(account)
    } else if (action === 'delete') {
      confirmDelete(account)
    }
  }, 300)
  setTimeout(() => {
    reset()
  }, 100)
}

onMounted(() => {
  accountStore.listenAccounts()
  transactionStore.listenTransactions()
})

onUnmounted(() => {
  accountStore.stopListening()
  transactionStore.stopListening()
})
</script>
