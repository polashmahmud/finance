<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center">
        <q-btn flat round icon="arrow_back" @click="$router.back()" />
        <div class="text-h6 text-weight-bold q-ml-sm">ক্যাটাগরি ও বাজেট</div>
      </div>
      <q-btn round flat icon="add" color="dark" @click="openAddDialog" />
    </div>

    <!-- Tabs -->
    <q-card class="finance-card q-mb-md">
      <q-tabs v-model="tab" dense active-color="dark" indicator-color="dark" class="text-grey-6" align="justify">
        <q-tab name="expense" label="ব্যয়" />
        <q-tab name="income" label="আয়" />
      </q-tabs>
    </q-card>

    <!-- Loading -->
    <div v-if="categoryStore.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <!-- Category List -->
    <template v-else>
      <q-tab-panels v-model="tab" animated class="bg-transparent">
        <!-- Expense Categories -->
        <q-tab-panel name="expense" class="q-pa-none">
          <div v-if="categoryStore.expenseCategories.length === 0" class="text-center text-grey q-pa-xl">
            <q-icon name="category" size="48px" class="q-mb-sm" />
            <div>কোনো ব্যয় ক্যাটাগরি নেই</div>
          </div>
          <div class="q-gutter-sm">
            <q-card v-for="cat in categoryStore.expenseCategories" :key="cat.id" class="finance-card">
              <q-item class="touch-target">
                <q-item-section avatar>
                  <q-avatar :style="{ background: cat.color + '18' }" size="44px">
                    <q-icon :name="cat.icon" :style="{ color: cat.color }" size="22px" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ cat.name }}</q-item-label>
                  <q-item-label caption v-if="cat.budget">
                    বাজেট: {{ settings.currency }}{{ Number(cat.budget).toLocaleString() }}/মাস
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row q-gutter-xs">
                    <q-btn flat round dense icon="edit" size="sm" color="grey-7" @click="openEditDialog(cat)" />
                    <q-btn flat round dense icon="delete_outline" size="sm" color="negative"
                      @click="confirmDelete(cat)" />
                  </div>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </q-tab-panel>

        <!-- Income Categories -->
        <q-tab-panel name="income" class="q-pa-none">
          <div v-if="categoryStore.incomeCategories.length === 0" class="text-center text-grey q-pa-xl">
            <q-icon name="category" size="48px" class="q-mb-sm" />
            <div>কোনো আয় ক্যাটাগরি নেই</div>
          </div>
          <div class="q-gutter-sm">
            <q-card v-for="cat in categoryStore.incomeCategories" :key="cat.id" class="finance-card">
              <q-item class="touch-target">
                <q-item-section avatar>
                  <q-avatar :style="{ background: cat.color + '18' }" size="44px">
                    <q-icon :name="cat.icon" :style="{ color: cat.color }" size="22px" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ cat.name }}</q-item-label>
                  <q-item-label caption v-if="cat.budget">
                    বাজেট: {{ settings.currency }}{{ Number(cat.budget).toLocaleString() }}/মাস
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row q-gutter-xs">
                    <q-btn flat round dense icon="edit" size="sm" color="grey-7" @click="openEditDialog(cat)" />
                    <q-btn flat round dense icon="delete_outline" size="sm" color="negative"
                      @click="confirmDelete(cat)" />
                  </div>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <!-- Add/Edit Category Dialog -->
    <q-dialog v-model="showDialog" position="bottom" transition-show="slide-up" transition-hide="slide-down">
      <q-card
        style="border-top-left-radius: 28px; border-top-right-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <!-- Dialog Header -->
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ isEditing ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveCategory" class="q-gutter-md">
            <!-- Type -->
            <q-select v-model="form.type" :options="[
              { label: 'ব্যয়', value: 'expense' },
              { label: 'আয়', value: 'income' },
            ]" label="ক্যাটাগরি ধরন" outlined dense emit-value map-options color="dark" />

            <!-- Name -->
            <q-input v-model="form.name" label="ক্যাটাগরি নাম" outlined dense color="dark"
              :rules="[(val) => (val && val.length > 0) || 'নাম আবশ্যক']" />

            <!-- Icon Dropdown -->
            <q-select v-model="form.icon" :options="iconOptions" label="আইকন" outlined dense emit-value map-options
              color="dark">
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
            <div>
              <div class="text-caption text-grey-7 q-mb-sm">রং নির্বাচন করুন</div>
              <div class="row q-gutter-sm">
                <div v-for="color in colorPalette" :key="color" class="cursor-pointer" :style="{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: color,
                  border: form.color === color ? '3px solid #000' : '2px solid #e5e7eb',
                  transition: 'all 0.15s',
                }" @click="form.color = color" />
              </div>
            </div>

            <!-- Budget -->
            <q-input v-model.number="form.budget" label="মাসিক বাজেট" type="number" outlined dense color="dark"
              :prefix="settings.currency" />

            <!-- Submit Button -->
            <q-btn type="submit" :label="isEditing ? 'আপডেট করুন' : 'ক্যাটাগরি যোগ করুন'"
              class="full-width bg-primary-gradient" text-color="white" size="md" rounded unelevated
              :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'

const $q = useQuasar()
const categoryStore = useCategoryStore()
const settings = useSettingsStore()

const tab = ref('expense')
const showDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const saving = ref(false)

const form = reactive({
  type: 'expense',
  name: '',
  icon: 'category',
  color: '#111111',
  budget: 0,
})

// Available icons
const iconOptions = [
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Shopping', value: 'shopping_bag' },
  { label: 'Transport', value: 'directions_car' },
  { label: 'Health', value: 'local_hospital' },
  { label: 'Education', value: 'school' },
  { label: 'Entertainment', value: 'movie' },
  { label: 'Bills', value: 'receipt' },
  { label: 'Home', value: 'home' },
  { label: 'Work', value: 'work' },
  { label: 'Laptop', value: 'laptop' },
  { label: 'Phone', value: 'phone_android' },
  { label: 'Savings', value: 'savings' },
  { label: 'Trending Up', value: 'trending_up' },
  { label: 'Gift', value: 'card_giftcard' },
  { label: 'Money', value: 'attach_money' },
  { label: 'Gym', value: 'fitness_center' },
  { label: 'Flight', value: 'flight' },
  { label: 'Pet', value: 'pets' },
  { label: 'Coffee', value: 'local_cafe' },
  { label: 'Sports', value: 'sports_soccer' },
  { label: 'Music', value: 'music_note' },
  { label: 'Book', value: 'menu_book' },
  { label: 'Camera', value: 'camera_alt' },
  { label: 'Electricity', value: 'bolt' },
  { label: 'Water', value: 'water_drop' },
  { label: 'Wifi', value: 'wifi' },
  { label: 'Baby', value: 'child_care' },
  { label: 'Other', value: 'more_horiz' },
]

// Color palette
const colorPalette = [
  '#111111', '#444444', '#777777',
  '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#3b82f6',
  '#8b5cf6', '#ec4899', '#6b7280',
]

function openAddDialog() {
  isEditing.value = false
  editingId.value = null
  form.type = tab.value
  form.name = ''
  form.icon = 'category'
  form.color = '#111111'
  form.budget = 0
  showDialog.value = true
}

function openEditDialog(cat) {
  isEditing.value = true
  editingId.value = cat.id
  form.type = cat.type
  form.name = cat.name
  form.icon = cat.icon
  form.color = cat.color
  form.budget = cat.budget || 0
  showDialog.value = true
}

async function saveCategory() {
  if (!form.name) return
  saving.value = true
  try {
    if (isEditing.value) {
      await categoryStore.updateCategory(editingId.value, { ...form })
      $q.notify({ type: 'positive', message: 'ক্যাটাগরি আপডেট হয়েছে', position: 'top' })
    } else {
      await categoryStore.addCategory({ ...form })
      $q.notify({ type: 'positive', message: 'ক্যাটাগরি যোগ হয়েছে', position: 'top' })
    }
    showDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: 'ত্রুটি: ' + err.message, position: 'top' })
  }
  saving.value = false
}

function confirmDelete(cat) {
  $q.dialog({
    title: 'ক্যাটাগরি মুছুন',
    message: `"${cat.name}" ক্যাটাগরিটি মুছে ফেলতে চান?`,
    ok: { label: 'মুছুন', color: 'negative', flat: true },
    cancel: { label: 'বাতিল', flat: true },
  }).onOk(async () => {
    await categoryStore.deleteCategory(cat.id)
    $q.notify({ type: 'positive', message: 'ক্যাটাগরি মুছে ফেলা হয়েছে', position: 'top' })
  })
}

onMounted(() => {
  categoryStore.listenCategories()
})

onUnmounted(() => {
  categoryStore.stopListening()
})
</script>
