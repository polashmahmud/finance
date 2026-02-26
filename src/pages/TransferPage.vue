<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.back()" />
      <div class="text-h6 text-weight-bold q-ml-sm">ট্রান্সফার</div>
    </div>

    <q-card class="finance-card">
      <q-card-section>
        <q-form @submit.prevent="saveTransfer">
          <!-- From and To Accounts -->
          <div class="row q-col-gutter-sm items-center position-relative" style="margin-bottom: 15px;">
            <div class="col-5">
              <q-select v-model="form.fromAccountId" :options="accountOptions" label="যে অ্যাকাউন্ট থেকে" outlined
                color="dark" emit-value map-options />
            </div>

            <div class="col-2 text-center q-px-none">
              <q-icon name="arrow_forward" color="dark" size="28px" class="bg-grey-2 q-pa-xs rounded-borders" />
            </div>

            <div class="col-5">
              <q-select v-model="form.toAccountId" :options="accountOptions" label="যে অ্যাকাউন্টে" outlined
                color="dark" emit-value map-options />
            </div>
          </div>

          <!-- Amount -->
          <q-input v-model.number="form.amount" label="ট্রান্সফারের পরিমাণ" type="number" outlined color="dark"
            :prefix="settings.currency" :rules="[val => val > 0 || 'সঠিক পরিমাণ লিখুন']"
            input-class="text-h5 text-weight-bold" style="margin-bottom: 10px;" />

          <!-- Fee and Date -->
          <div class="row q-col-gutter-md" style="margin-bottom: 10px;">
            <div class="col-6">
              <q-input v-model.number="form.fee" label="ট্রান্সফার ফি" type="number" outlined color="dark"
                :prefix="settings.currency" />
            </div>
            <div class="col-6">
              <q-input v-model="form.date" label="তারিখ" outlined color="dark" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.date" mask="YYYY-MM-DD" color="dark" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <!-- Notes -->
          <q-input v-model="form.notes" label="নোট (ঐচ্ছিক)" outlined color="dark" type="textarea" rows="2"
            style="margin-bottom: 15px;" />

          <!-- Submit -->
          <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated size="lg"
            icon="sync_alt" label="ট্রান্সফার করুন" :loading="saving" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useTransactionStore } from 'stores/transactionStore'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'

const router = useRouter()
const $q = useQuasar()
const transactions = useTransactionStore()
const accounts = useAccountStore()
const settings = useSettingsStore()
const saving = ref(false)

const now = new Date()
const form = reactive({
  fromAccountId: null,
  toAccountId: null,
  amount: null,
  fee: 0,
  date: now.toISOString().slice(0, 10),
  time: now.toTimeString().slice(0, 5),
  notes: '',
})

const accountOptions = computed(() => {
  if (!accounts.accounts) return []
  return accounts.accounts.map((a) => ({
    label: `${a.name} (${settings.currency}${Number(a.balance || 0).toLocaleString()})`,
    value: a.id
  }))
})

async function saveTransfer() {
  if (!form.amount || form.amount <= 0) return
  if (!form.fromAccountId || !form.toAccountId) {
    $q.notify({ type: 'warning', message: 'উভয় অ্যাকাউন্ট নির্বাচন করুন', position: 'top' })
    return
  }
  if (form.fromAccountId === form.toAccountId) {
    $q.notify({ type: 'warning', message: 'ভিন্ন অ্যাকাউন্ট নির্বাচন করুন', position: 'top' })
    return
  }

  saving.value = true
  try {
    const feeAmount = form.fee ? Number(form.fee) : 0
    await transactions.addTransaction({ ...form, fee: feeAmount, type: 'transfer' })
    await accounts.updateBalance(form.fromAccountId, -(form.amount + feeAmount))
    await accounts.updateBalance(form.toAccountId, form.amount)
    $q.notify({ type: 'positive', message: 'ট্রান্সফার সফল হয়েছে', position: 'top' })
    router.back()
  } catch (err) {
    $q.notify({ type: 'negative', message: 'ত্রুটি: ' + err.message, position: 'top' })
  }
  saving.value = false
}

onMounted(() => {
  transactions.listenTransactions()
  accounts.listenAccounts()
})

onUnmounted(() => {
  transactions.stopListening()
  accounts.stopListening()
})
</script>
