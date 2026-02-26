<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.back()" />
      <div class="text-h6 text-weight-bold q-ml-sm">Add Income</div>
    </div>

    <q-card class="finance-card">
      <q-card-section>
        <q-form @submit.prevent="saveIncome" class="q-gutter-md">
          <!-- Amount -->
          <q-input
            v-model.number="form.amount"
            label="Amount"
            type="number"
            outlined
            :prefix="settings.currency"
            :rules="[val => val > 0 || 'Enter a valid amount']"
            autofocus
            input-class="text-h5 text-weight-bold"
          />

          <!-- Category -->
          <q-select
            v-model="form.category"
            :options="categories.incomeCategories.map(c => c.name)"
            label="Category"
            outlined
          />

          <!-- Account -->
          <q-select
            v-model="form.accountId"
            :options="accountOptions"
            label="Account"
            outlined
            emit-value
            map-options
          />

          <!-- Date & Time -->
          <div class="row q-gutter-md">
            <q-input
              v-model="form.date"
              label="Date"
              outlined
              class="col"
              readonly
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.date" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              v-model="form.time"
              label="Time"
              outlined
              class="col"
              readonly
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="form.time" mask="HH:mm" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- Notes -->
          <q-input v-model="form.notes" label="Notes (optional)" outlined type="textarea" rows="2" />

          <!-- Submit -->
          <q-btn
            type="submit"
            unelevated
            rounded
            color="positive"
            label="Save Income"
            class="full-width"
            size="lg"
            icon="check"
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
import { useCategoryStore } from 'stores/categoryStore'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'
import { Notify } from 'quasar'

const router = useRouter()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const accounts = useAccountStore()
const settings = useSettingsStore()

const now = new Date()
const form = reactive({
  amount: null,
  category: 'Salary',
  subcategory: '',
  accountId: accounts.accounts[0]?.id,
  date: now.toISOString().slice(0, 10),
  time: now.toTimeString().slice(0, 5),
  notes: '',
})

const accountOptions = computed(() =>
  accounts.accounts.map((a) => ({ label: a.name, value: a.id })),
)

function saveIncome() {
  if (!form.amount || form.amount <= 0) return
  transactions.addTransaction({ ...form, type: 'income' })
  accounts.updateBalance(form.accountId, form.amount)
  Notify.create({ type: 'positive', message: 'Income added successfully' })
  router.back()
}
</script>
