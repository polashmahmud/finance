<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <div class="text-h5 text-weight-bold">{{ $t('transferPage.title') }}</div>
    </div>

    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <!-- From Account -->
      <q-select v-model="form.fromAccount" :options="accountOptions" :label="$t('transferPage.fromAccount')" outlined
        dense emit-value map-options :rules="[val => !!val || $t('common.accountRequired')]" />

      <!-- To Account -->
      <q-select v-model="form.toAccount" :options="accountOptions" :label="$t('transferPage.toAccount')" outlined dense
        emit-value map-options :rules="[val => !!val || $t('common.accountRequired')]" />

      <!-- Transfer Amount -->
      <q-input v-model.number="form.amount" type="number" :label="$t('transferPage.transferAmount')" outlined dense
        :prefix="settings.currency" :rules="[val => val > 0 || $t('common.validAmount')]" />

      <!-- Transfer Fee -->
      <q-input v-model.number="form.fee" type="number" :label="$t('transferPage.transferFee')" outlined dense
        :prefix="settings.currency" />

      <!-- Date -->
      <q-input v-model="form.date" :label="$t('common.date')" outlined dense type="date"
        :rules="[val => !!val || $t('common.dateRequired')]" />

      <!-- Note -->
      <q-input v-model="form.note" :label="$t('common.noteOptional')" outlined dense autogrow />

      <!-- Submit -->
      <q-btn type="submit" :label="$t('transferPage.transferBtn')" color="dark" class="full-width" unelevated
        rounded no-caps :loading="loading" />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAccountStore } from 'stores/accountStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useSettingsStore } from 'stores/settingsStore'
import { Notify } from 'quasar'

const { t } = useI18n()
const router = useRouter()
const accounts = useAccountStore()
const transactions = useTransactionStore()
const settings = useSettingsStore()
const loading = ref(false)

const form = ref({
  fromAccount: null,
  toAccount: null,
  amount: null,
  fee: 0,
  date: new Date().toISOString().slice(0, 10),
  note: '',
})

const accountOptions = computed(() =>
  accounts.accounts.map((a) => ({
    label: a.name,
    value: a.name,
  })),
)

async function onSubmit() {
  if (!form.value.fromAccount || !form.value.toAccount) {
    Notify.create({ message: t('transferPage.selectBothAccounts'), color: 'negative' })
    return
  }
  if (form.value.fromAccount === form.value.toAccount) {
    Notify.create({ message: t('transferPage.selectDifferentAccounts'), color: 'negative' })
    return
  }

  loading.value = true
  try {
    await transactions.addTransaction({
      type: 'transfer',
      amount: form.value.amount,
      fee: form.value.fee || 0,
      fromAccount: form.value.fromAccount,
      toAccount: form.value.toAccount,
      account: form.value.fromAccount,
      date: form.value.date,
      note: form.value.note,
      category: t('common.transfer'),
    })
    Notify.create({ message: t('transferPage.transferSuccess'), color: 'positive' })
    router.push('/')
  } catch (e) {
    Notify.create({ message: t('common.error') + e.message, color: 'negative' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  accounts.listenAccounts()
})

onUnmounted(() => {
  accounts.stopListening()
})
</script>
