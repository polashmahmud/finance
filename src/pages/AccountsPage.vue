<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">অ্যাকাউন্টস</div>
        <div class="text-caption text-grey">{{ accountStore.accounts.length }}টি অ্যাকাউন্ট</div>
      </div>
      <q-btn round flat icon="add_circle" color="dark" size="lg" @click="openAddDialog" />
    </div>

    <!-- Total Balance Banner -->
    <q-card class="finance-card q-mb-lg">
      <q-card-section class="bg-primary-gradient" style="border-radius: 16px">
        <div class="text-center">
          <div class="text-body2" style="opacity: 0.9">মোট সম্পদ</div>
          <div class="stat-value text-white">{{ settings.currency }}{{ formatNumber(accountStore.totalBalance) }}</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Loading -->
    <div v-if="accountStore.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <template v-else>
      <!-- Account Cards -->
      <div class="q-gutter-sm">
        <q-card v-for="account in accountStore.accounts" :key="account.id" class="finance-card">
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
                  {{ settings.currency }}{{ formatNumber(getLastTx(account.id).amount) }}
                </span>
                <span class="text-grey-6 text-caption">- {{ getLastTx(account.id).date }}</span>
              </div>
              <div v-else class="text-grey-6 text-caption q-mt-xs" style="font-size: 0.7rem">কোনো লেনদেন নেই</div>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-subtitle1 text-weight-bold">{{ settings.currency }}{{
                formatNumber(account.balance) }}</q-item-label>
              <div class="row q-gutter-xs justify-end q-mt-xs">
                <q-btn flat round dense icon="edit" size="xs" color="grey-7" @click="openEditDialog(account)" />
                <q-btn flat round dense icon="delete_outline" size="xs" color="negative"
                  @click="confirmDelete(account)" />
              </div>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-if="!accountStore.accounts.length" class="text-center text-grey q-mt-xl">
        <q-icon name="account_balance_wallet" size="60px" class="q-mb-md" />
        <div class="text-h6">কোনো অ্যাকাউন্ট নেই</div>
        <div class="text-body2">+ চাপুন নতুন অ্যাকাউন্ট তৈরি করতে</div>
      </div>
    </template>

    <!-- Add/Edit Account Dialog -->
    <q-dialog v-model="showDialog" position="bottom" transition-show="slide-up" transition-hide="slide-down">
      <q-card
        style="border-top-left-radius: 28px; border-top-right-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ isEditing ? 'অ্যাকাউন্ট সম্পাদনা' : 'নতুন অ্যাকাউন্ট' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="saveAccount">
            <q-input v-model="form.name" label="অ্যাকাউন্টের নাম" outlined dense autofocus color="dark"
              :rules="[(val) => (val && val.length > 0) || 'নাম আবশ্যক']" style="margin-bottom: 10px;" />

            <q-select v-model="form.type" :options="[
              { label: 'নগদ', value: 'Cash' },
              { label: 'ব্যাংক', value: 'Bank' },
              { label: 'মোবাইল ব্যাংকিং', value: 'Mobile Banking' },
            ]" label="অ্যাকাউন্টের ধরন" outlined dense emit-value map-options color="dark"
              style="margin-bottom: 10px;" />

            <q-input v-model.number="form.balance" label="ব্যালেন্স" type="number" outlined dense color="dark"
              :prefix="settings.currency" style="margin-bottom: 10px;" />

            <!-- Icon Dropdown with visual previews -->
            <q-select v-model="form.icon" :options="iconOptions" label="আইকন" outlined dense emit-value map-options
              color="dark" style="margin-bottom: 10px;">
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
              <div class="text-caption text-grey-7 q-mb-sm">রং নির্বাচন করুন</div>
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
              :label="isEditing ? 'আপডেট করুন' : 'অ্যাকাউন্ট যোগ করুন'" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'stores/accountStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useSettingsStore } from 'stores/settingsStore'

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

const iconOptions = [
  { label: 'ওয়ালেট', value: 'account_balance_wallet' },
  { label: 'ব্যাংক', value: 'account_balance' },
  { label: 'মোবাইল', value: 'phone_android' },
  { label: 'ক্রেডিট কার্ড', value: 'credit_card' },
  { label: 'সঞ্চয়', value: 'savings' },
  { label: 'টাকা', value: 'attach_money' },
  { label: 'বিনিয়োগ', value: 'trending_up' },
  { label: 'স্টোর', value: 'store' },
]

const colorPalette = [
  '#111111', '#444444', '#777777',
  '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#3b82f6',
  '#8b5cf6', '#ec4899', '#6b7280',
]

const typeLabels = {
  Cash: 'নগদ অ্যাকাউন্ট',
  Bank: 'ব্যাংক অ্যাকাউন্ট',
  'Mobile Banking': 'মোবাইল অ্যাকাউন্ট',
}

function getTypeLabel(type) {
  return typeLabels[type] || type
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString()
}

function getLastTx(accountId) {
  if (!transactionStore.transactions || !transactionStore.transactions.length) return null

  // Find the most recent transaction where this account was involved
  const accountTxs = transactionStore.transactions.filter(t =>
    t.accountId === accountId || t.fromAccountId === accountId || t.toAccountId === accountId
  )

  if (!accountTxs.length) return null

  // They are already sorted by createdAt descending in the store
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
      $q.notify({ type: 'positive', message: 'অ্যাকাউন্ট আপডেট হয়েছে', position: 'top' })
    } else {
      await accountStore.addAccount({ ...form })
      $q.notify({ type: 'positive', message: 'অ্যাকাউন্ট যোগ হয়েছে', position: 'top' })
    }
    showDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: 'ত্রুটি: ' + err.message, position: 'top' })
  }
  saving.value = false
}

function confirmDelete(account) {
  $q.dialog({
    title: 'অ্যাকাউন্ট মুছুন',
    message: `"${account.name}" অ্যাকাউন্টটি মুছে ফেলতে চান?`,
    ok: { label: 'মুছুন', color: 'negative', flat: true },
    cancel: { label: 'বাতিল', flat: true },
  }).onOk(async () => {
    await accountStore.deleteAccount(account.id)
    $q.notify({ type: 'positive', message: 'অ্যাকাউন্ট মুছে ফেলা হয়েছে', position: 'top' })
  })
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
