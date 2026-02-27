<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.back()" />
      <div class="text-h6 text-weight-bold q-ml-sm">আয় যোগ করুন</div>
    </div>

    <q-card class="finance-card">
      <q-card-section>
        <q-form @submit.prevent="saveIncome">
          <!-- Amount -->
          <q-input v-model.number="form.amount" label="পরিমাণ" type="number" outlined color="dark"
            :prefix="settings.currency" :rules="[val => val > 0 || 'সঠিক পরিমাণ লিখুন']" autofocus
            input-class="text-h5 text-weight-bold" style="margin-bottom: 10px;" />

          <!-- Category & Account -->
          <div class="row q-col-gutter-md" style="margin-bottom: 10px;">
            <div class="col-6">
              <q-select v-model="form.category" :options="incomeCategoryOptions" label="ক্যাটাগরি" outlined color="dark"
                emit-value map-options :rules="[val => !!val || 'ক্যাটাগরি আবশ্যক']">
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar :style="{ background: scope.opt.color + '18' }" size="32px">
                        <q-icon :name="scope.opt.icon" :style="{ color: scope.opt.color }" size="16px" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <q-select v-model="form.accountId" :options="accountOptions" label="অ্যাকাউন্ট" outlined color="dark"
                emit-value map-options :rules="[val => !!val || 'অ্যাকাউন্ট আবশ্যক']" />
            </div>
          </div>

          <!-- Date & Time -->
          <div class="row q-col-gutter-md" style="margin-bottom: 10px;">
            <div class="col-6">
              <q-input v-model="form.date" label="তারিখ" outlined color="dark" readonly
                :rules="[val => !!val || 'তারিখ আবশ্যক']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.date" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input v-model="form.time" label="সময়" outlined color="dark" readonly
                :rules="[val => !!val || 'সময় আবশ্যক']">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="form.time" mask="HH:mm" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <!-- Notes -->
          <q-input v-model="form.notes" label="নোট (ঐচ্ছিক)" outlined color="dark" type="textarea" rows="2"
            style="margin-bottom: 10px;" />

          <!-- Submit -->
          <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated size="lg"
            icon="check" label="আয় সংরক্ষণ করুন" :loading="saving" />
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
import { useCategoryStore } from 'stores/categoryStore'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'

const router = useRouter()
const $q = useQuasar()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const accounts = useAccountStore()
const settings = useSettingsStore()
const saving = ref(false)

const now = new Date()
const form = reactive({
  amount: null,
  category: '',
  accountId: null,
  date: now.toISOString().slice(0, 10),
  time: now.toTimeString().slice(0, 5),
  notes: '',
})

// Income categories from Firebase
const incomeCategoryOptions = computed(() =>
  categories.incomeCategories.map((c) => ({
    label: c.name,
    value: c.name,
    icon: c.icon,
    color: c.color,
  })),
)

const accountOptions = computed(() =>
  accounts.accounts.map((a) => ({
    label: `${a.name} (${settings.currency}${Number(a.balance || 0).toLocaleString()})`,
    value: a.id
  })),
)

async function saveIncome() {
  if (!form.amount || form.amount <= 0) return
  saving.value = true
  try {
    await transactions.addTransaction({ ...form, type: 'income' })
    await accounts.updateBalance(form.accountId, form.amount)
    $q.notify({ type: 'positive', message: 'আয় সফলভাবে যোগ হয়েছে', position: 'top' })
    router.back()
  } catch (err) {
    $q.notify({ type: 'negative', message: 'ত্রুটি: ' + err.message, position: 'top' })
  }
  saving.value = false
}

onMounted(() => {
  categories.listenCategories()
  accounts.listenAccounts()
  transactions.listenTransactions()
})

onUnmounted(() => {
  categories.stopListening()
  accounts.stopListening()
  transactions.stopListening()
})
</script>
