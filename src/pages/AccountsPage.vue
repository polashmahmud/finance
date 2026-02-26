<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">অ্যাকাউন্টস</div>
        <div class="text-caption text-grey">{{ accounts.accounts.length }}টি অ্যাকাউন্ট</div>
      </div>
      <q-btn round flat icon="add_circle" color="primary" size="lg" @click="showAddDialog = true" />
    </div>

    <!-- Total Balance Banner -->
    <q-card class="finance-card q-mb-lg">
      <q-card-section class="bg-primary-gradient" style="border-radius: 16px">
        <div class="text-center">
          <div class="text-body2" style="opacity: 0.9">মোট সম্পদ</div>
          <div class="stat-value text-white">{{ settings.currency }}{{ formatNumber(accounts.totalBalance) }}</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Account Cards -->
    <div class="q-gutter-md">
      <q-slide-item
        v-for="account in accounts.accounts"
        :key="account.id"
        @right="({ reset }) => onDelete(account.id, reset)"
      >
        <template v-slot:right>
          <div class="row items-center q-px-md">
            <q-icon name="delete" color="negative" />
          </div>
        </template>

        <q-card class="finance-card">
          <q-card-section>
            <div class="row items-center q-gutter-md">
              <q-avatar :style="{ background: account.color + '20' }" size="48px">
                <q-icon :name="account.icon" :style="{ color: account.color }" size="24px" />
              </q-avatar>
              <div class="col">
                <div class="text-subtitle1 text-weight-bold">{{ account.name }}</div>
                <div class="text-caption text-grey">{{ getTypeLabel(account.type) }}</div>
              </div>
              <div class="text-right">
                <div class="text-subtitle1 text-weight-bold">{{ settings.currency }}{{ formatNumber(account.balance) }}</div>
                <div class="text-caption text-grey">সর্বশেষ: {{ account.lastActivity }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-slide-item>
    </div>

    <div class="swipe-hint q-mt-sm">বামে সোয়াইপ করে মুছুন</div>

    <!-- Add Account Dialog -->
    <q-dialog v-model="showAddDialog" position="bottom">
      <q-card style="width: 100%; max-width: 500px; border-radius: 16px 16px 0 0">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">নতুন অ্যাকাউন্ট</div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="addNewAccount" class="q-gutter-md">
            <q-input v-model="newAccount.name" label="অ্যাকাউন্টের নাম" outlined dense />
            <q-select
              v-model="newAccount.type"
              :options="[
                { label: 'নগদ', value: 'Cash' },
                { label: 'ব্যাংক', value: 'Bank' },
                { label: 'মোবাইল ব্যাংকিং', value: 'Mobile Banking' },
              ]"
              label="অ্যাকাউন্টের ধরন"
              outlined
              dense
              emit-value
              map-options
            />
            <q-input
              v-model.number="newAccount.balance"
              label="প্রারম্ভিক ব্যালেন্স"
              type="number"
              outlined
              dense
              :prefix="settings.currency"
            />
            <q-select
              v-model="newAccount.icon"
              :options="iconOptions"
              label="আইকন"
              outlined
              dense
              emit-value
              map-options
            />
            <q-btn
              type="submit"
              unelevated
              rounded
              color="primary"
              label="অ্যাকাউন্ট যোগ করুন"
              class="full-width q-mt-md"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'

const accounts = useAccountStore()
const settings = useSettingsStore()
const showAddDialog = ref(false)

const iconOptions = [
  { label: 'ওয়ালেট', value: 'account_balance_wallet' },
  { label: 'ব্যাংক', value: 'account_balance' },
  { label: 'মোবাইল', value: 'phone_android' },
  { label: 'ক্রেডিট কার্ড', value: 'credit_card' },
  { label: 'সঞ্চয়', value: 'savings' },
]

const colorMap = {
  Cash: '#4CAF50',
  Bank: '#1976D2',
  'Mobile Banking': '#E91E63',
}

const typeLabels = {
  Cash: 'নগদ অ্যাকাউন্ট',
  Bank: 'ব্যাংক অ্যাকাউন্ট',
  'Mobile Banking': 'মোবাইল অ্যাকাউন্ট',
}

function getTypeLabel(type) {
  return typeLabels[type] || type
}

const newAccount = reactive({
  name: '',
  type: 'Cash',
  balance: 0,
  icon: 'account_balance_wallet',
})

function addNewAccount() {
  if (!newAccount.name) return
  accounts.addAccount({
    name: newAccount.name,
    type: newAccount.type,
    balance: newAccount.balance,
    icon: newAccount.icon,
    color: colorMap[newAccount.type] || '#757575',
  })
  newAccount.name = ''
  newAccount.balance = 0
  showAddDialog.value = false
}

function onDelete(id, reset) {
  accounts.deleteAccount(id)
  reset()
}

function formatNumber(n) {
  return Number(n).toLocaleString()
}
</script>
