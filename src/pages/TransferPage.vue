<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.back()" />
      <div class="text-h6 text-weight-bold q-ml-sm">ট্রান্সফার</div>
    </div>

    <q-card class="finance-card">
      <q-card-section>
        <q-form @submit.prevent="saveTransfer" class="q-gutter-md">
          <!-- From Account -->
          <q-select
            v-model="form.fromAccountId"
            :options="accountOptions"
            label="যে অ্যাকাউন্ট থেকে"
            outlined
            emit-value
            map-options
          />

          <!-- Transfer Arrow -->
          <div class="text-center">
            <q-icon name="swap_vert" color="secondary" size="36px" />
          </div>

          <!-- To Account -->
          <q-select
            v-model="form.toAccountId"
            :options="accountOptions"
            label="যে অ্যাকাউন্টে"
            outlined
            emit-value
            map-options
          />

          <!-- Amount -->
          <q-input
            v-model.number="form.amount"
            label="ট্রান্সফারের পরিমাণ"
            type="number"
            outlined
            :prefix="settings.currency"
            :rules="[val => val > 0 || 'সঠিক পরিমাণ লিখুন']"
            input-class="text-h5 text-weight-bold"
          />

          <!-- Fee -->
          <q-input
            v-model.number="form.fee"
            label="ট্রান্সফার ফি (ঐচ্ছিক)"
            type="number"
            outlined
            :prefix="settings.currency"
          />

          <!-- Date -->
          <q-input v-model="form.date" label="তারিখ" outlined readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.date" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- Notes -->
          <q-input v-model="form.notes" label="নোট (ঐচ্ছিক)" outlined type="textarea" rows="2" />

          <!-- Submit -->
          <q-btn
            type="submit"
            unelevated
            rounded
            color="secondary"
            label="ট্রান্সফার করুন"
            class="full-width"
            size="lg"
            icon="swap_horiz"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from 'stores/transactionStore'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'
import { Notify } from 'quasar'

const router = useRouter()
const transactions = useTransactionStore()
const accounts = useAccountStore()
const settings = useSettingsStore()

const now = new Date()
const form = reactive({
  fromAccountId: accounts.accounts[0]?.id,
  toAccountId: accounts.accounts[1]?.id,
  amount: null,
  fee: 0,
  date: now.toISOString().slice(0, 10),
  time: now.toTimeString().slice(0, 5),
  notes: '',
})

const accountOptions = computed(() =>
  accounts.accounts.map((a) => ({ label: `${a.name} (${settings.currency}${a.balance.toLocaleString()})`, value: a.id })),
)

function saveTransfer() {
  if (!form.amount || form.amount <= 0) return
  if (form.fromAccountId === form.toAccountId) {
    Notify.create({ type: 'warning', message: 'ভিন্ন অ্যাকাউন্ট নির্বাচন করুন' })
    return
  }
  transactions.addTransaction({ ...form, type: 'transfer' })
  accounts.updateBalance(form.fromAccountId, -(form.amount + (form.fee || 0)))
  accounts.updateBalance(form.toAccountId, form.amount)
  Notify.create({ type: 'positive', message: 'ট্রান্সফার সফল হয়েছে' })
  router.back()
}
</script>
