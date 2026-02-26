<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Accounts</div>
        <div class="text-caption text-grey">{{ accounts.accounts.length }} accounts</div>
      </div>
      <q-btn round flat icon="add_circle" color="primary" size="lg" @click="showAddDialog = true" />
    </div>

    <!-- Total Balance Banner -->
    <q-card class="finance-card q-mb-lg bg-primary text-white">
      <q-card-section>
        <div class="text-center">
          <div class="stat-label text-white">Total Balance</div>
          <div class="stat-value">{{ settings.currency }} {{ formatNumber(accounts.totalBalance) }}</div>
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
                <div class="text-caption text-grey">{{ account.type }}</div>
              </div>
              <div class="text-right">
                <div class="text-subtitle1 text-weight-bold">{{ settings.currency }} {{ formatNumber(account.balance) }}</div>
                <div class="text-caption text-grey">Last: {{ account.lastActivity }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-slide-item>
    </div>

    <div class="swipe-hint q-mt-sm">Swipe left to delete</div>

    <!-- Add Account Dialog -->
    <q-dialog v-model="showAddDialog" position="bottom">
      <q-card style="width: 100%; max-width: 500px; border-radius: 16px 16px 0 0">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">New Account</div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="addNewAccount" class="q-gutter-md">
            <q-input v-model="newAccount.name" label="Account Name" outlined dense />
            <q-select
              v-model="newAccount.type"
              :options="['Cash', 'Bank', 'Mobile Banking']"
              label="Account Type"
              outlined
              dense
            />
            <q-input
              v-model.number="newAccount.balance"
              label="Opening Balance"
              type="number"
              outlined
              dense
              :prefix="settings.currency"
            />
            <q-select
              v-model="newAccount.icon"
              :options="iconOptions"
              label="Icon"
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
              label="Add Account"
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
  { label: 'Wallet', value: 'account_balance_wallet' },
  { label: 'Bank', value: 'account_balance' },
  { label: 'Phone', value: 'phone_android' },
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'Savings', value: 'savings' },
]

const colorMap = {
  Cash: '#4CAF50',
  Bank: '#2196F3',
  'Mobile Banking': '#E91E63',
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
