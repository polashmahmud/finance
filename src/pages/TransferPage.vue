<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-7">
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.back()" />
          <div class="text-h6 text-weight-bold q-ml-sm">{{ $t('transferPage.title') }}</div>
        </div>

        <q-card class="finance-card">
          <q-card-section>
            <q-form @submit.prevent="onSubmit">
              <!-- Amount -->
              <q-input v-model.number="form.amount" :label="$t('transferPage.transferAmount')" type="number" outlined
                color="dark" :prefix="settings.currency" :rules="[val => val > 0 || $t('common.validAmount')]" autofocus
                input-class="text-h5 text-weight-bold" style="margin-bottom: 10px;" />

              <!-- From & To Accounts -->
              <div class="row q-col-gutter-md" style="margin-bottom: 10px;">
                <div class="col-6">
                  <q-select v-model="form.fromAccount" :options="accounts.accounts" option-value="id"
                    :option-label="(opt) => opt.name + ' (' + settings.currency + settings.formatNumber(opt.balance || 0) + ')'"
                    :label="$t('common.account')" outlined color="dark" emit-value map-options
                    :rules="[val => !!val || $t('common.accountRequired')]" />
                </div>
                <div class="col-6">
                  <q-select v-model="form.toAccount" :options="accountOptions" :label="$t('transferPage.toAccount')"
                    outlined color="dark" emit-value map-options
                    :rules="[val => !!val || $t('common.accountRequired')]" />
                </div>
              </div>

              <!-- Transfer Fee -->
              <q-input v-model.number="form.fee" type="number" :label="$t('transferPage.transferFee')" outlined
                color="dark" :prefix="settings.currency" style="margin-bottom: 10px;" />

              <!-- Date -->
              <q-input v-model="form.date" :label="$t('common.date')" outlined color="dark" type="date"
                :rules="[val => !!val || $t('common.dateRequired')]" style="margin-bottom: 10px;" />

              <!-- Note -->
              <q-input v-model="form.note" :label="$t('common.noteOptional')" outlined color="dark" type="textarea"
                rows="2" style="margin-bottom: 10px;" />

              <!-- Submit -->
              <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
                size="lg" icon="sync_alt" :label="$t('transferPage.transferBtn')" :loading="loading" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
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
    label: `${a.name} (${settings.currency}${settings.formatNumber(a.balance || 0)})`,
    value: a.id,
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
    const fee = form.value.fee || 0
    await transactions.addTransaction({
      type: 'transfer',
      amount: form.value.amount,
      fee,
      fromAccountId: form.value.fromAccount,
      toAccountId: form.value.toAccount,
      accountId: form.value.fromAccount,
      date: form.value.date,
      notes: form.value.note,
      category: t('common.transfer'),
    })
    // Update account balances: subtract from source (amount + fee), add to destination (amount only)
    await accounts.updateBalance(form.value.fromAccount, -(form.value.amount + fee))
    await accounts.updateBalance(form.value.toAccount, form.value.amount)
    Notify.create({ message: t('transferPage.transferSuccess'), color: 'positive' })
    router.push('/dashboard')
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
