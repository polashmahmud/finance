<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.back()" />
      <div class="text-h6 text-weight-bold q-ml-sm">ব্যয় যোগ করুন</div>
    </div>

    <q-card class="finance-card">
      <q-card-section>
        <q-form @submit.prevent="saveExpense" class="q-gutter-md">
          <!-- Amount -->
          <q-input
            v-model.number="form.amount"
            label="পরিমাণ"
            type="number"
            outlined
            :prefix="settings.currency"
            :rules="[val => val > 0 || 'সঠিক পরিমাণ লিখুন']"
            autofocus
            input-class="text-h5 text-weight-bold"
          />

          <!-- Category -->
          <q-select
            v-model="form.category"
            :options="categories.expenseCategories.map(c => c.name)"
            label="ক্যাটাগরি"
            outlined
            @update:model-value="onCategoryChange"
          />

          <!-- Subcategory -->
          <q-select
            v-if="subcategoryOptions.length"
            v-model="form.subcategory"
            :options="subcategoryOptions"
            label="সাব-ক্যাটাগরি"
            outlined
          />

          <!-- Account -->
          <q-select
            v-model="form.accountId"
            :options="accountOptions"
            label="অ্যাকাউন্ট"
            outlined
            emit-value
            map-options
          />

          <!-- Date & Time -->
          <div class="row q-gutter-md">
            <q-input v-model="form.date" label="তারিখ" outlined class="col" readonly>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.date" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input v-model="form.time" label="সময়" outlined class="col" readonly>
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
          <q-input v-model="form.notes" label="নোট (ঐচ্ছিক)" outlined type="textarea" rows="2" />

          <!-- Submit -->
          <q-btn
            type="submit"
            unelevated
            rounded
            color="negative"
            label="ব্যয় সংরক্ষণ করুন"
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
  category: categories.expenseCategories[0]?.name || 'খাবার',
  subcategory: '',
  accountId: accounts.accounts[0]?.id,
  date: now.toISOString().slice(0, 10),
  time: now.toTimeString().slice(0, 5),
  notes: '',
})

const subcategoryOptions = computed(() => {
  const cat = categories.expenseCategories.find((c) => c.name === form.category)
  return cat?.subcategories || []
})

const accountOptions = computed(() =>
  accounts.accounts.map((a) => ({ label: a.name, value: a.id })),
)

function onCategoryChange() {
  form.subcategory = ''
}

function saveExpense() {
  if (!form.amount || form.amount <= 0) return
  transactions.addTransaction({ ...form, type: 'expense' })
  accounts.updateBalance(form.accountId, -form.amount)
  Notify.create({ type: 'positive', message: 'ব্যয় সফলভাবে যোগ হয়েছে' })
  router.back()
}
</script>
