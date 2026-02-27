<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center">
        <q-btn flat round icon="arrow_back" @click="$router.back()" />
        <div class="text-h6 text-weight-bold q-ml-sm">{{ $t('categories.title') }}</div>
      </div>
      <q-btn round flat icon="add" color="dark" @click="openAddDialog" />
    </div>

    <!-- Tabs -->
    <q-card class="finance-card q-mb-md">
      <q-tabs v-model="tab" dense active-color="dark" indicator-color="dark" class="text-grey-6" align="justify">
        <q-tab name="expense" :label="$t('common.expense')" />
        <q-tab name="income" :label="$t('common.income')" />
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
            <div>{{ $t('categories.noExpenseCategories') }}</div>
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
                    {{ $t('categories.budgetPrefix') }} {{ settings.currency }}{{ Number(cat.budget).toLocaleString() }}{{ $t('categories.perMonth') }}
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
            <div>{{ $t('categories.noIncomeCategories') }}</div>
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
                    {{ $t('categories.budgetPrefix') }} {{ settings.currency }}{{ Number(cat.budget).toLocaleString() }}{{ $t('categories.perMonth') }}
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
            {{ isEditing ? $t('categories.editCategory') : $t('categories.newCategory') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveCategory" class="q-gutter-md">
            <!-- Type -->
            <q-select v-model="form.type" :options="[
              { label: $t('common.expense'), value: 'expense' },
              { label: $t('common.income'), value: 'income' },
            ]" :label="$t('categories.categoryType')" outlined dense emit-value map-options color="dark" />

            <!-- Name -->
            <q-input v-model="form.name" :label="$t('categories.categoryName')" outlined dense color="dark"
              :rules="[(val) => (val && val.length > 0) || $t('common.nameRequired')]" />

            <!-- Icon Dropdown -->
            <q-select v-model="form.icon" :options="iconOptions" :label="$t('common.icon')" outlined dense emit-value map-options
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
              <div class="text-caption text-grey-7 q-mb-sm">{{ $t('common.selectColor') }}</div>
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
            <q-input v-model.number="form.budget" :label="$t('categories.monthlyBudget')" type="number" outlined dense color="dark"
              :prefix="settings.currency" />

            <!-- Submit Button -->
            <q-btn type="submit" :label="isEditing ? $t('common.update') : $t('categories.addCategory')"
              class="full-width bg-primary-gradient" text-color="white" size="md" rounded unelevated
              :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'

const { t } = useI18n()
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
const iconOptions = computed(() => [
  { label: t('categories.iconRestaurant'), value: 'restaurant' },
  { label: t('categories.iconShopping'), value: 'shopping_bag' },
  { label: t('categories.iconTransport'), value: 'directions_car' },
  { label: t('categories.iconHealth'), value: 'local_hospital' },
  { label: t('categories.iconEducation'), value: 'school' },
  { label: t('categories.iconEntertainment'), value: 'movie' },
  { label: t('categories.iconBills'), value: 'receipt' },
  { label: t('categories.iconHome'), value: 'home' },
  { label: t('categories.iconWork'), value: 'work' },
  { label: t('categories.iconLaptop'), value: 'laptop' },
  { label: t('categories.iconPhone'), value: 'phone_android' },
  { label: t('categories.iconSavings'), value: 'savings' },
  { label: t('categories.iconTrendingUp'), value: 'trending_up' },
  { label: t('categories.iconGift'), value: 'card_giftcard' },
  { label: t('categories.iconMoney'), value: 'attach_money' },
  { label: t('categories.iconGym'), value: 'fitness_center' },
  { label: t('categories.iconFlight'), value: 'flight' },
  { label: t('categories.iconPet'), value: 'pets' },
  { label: t('categories.iconCoffee'), value: 'local_cafe' },
  { label: t('categories.iconSports'), value: 'sports_soccer' },
  { label: t('categories.iconMusic'), value: 'music_note' },
  { label: t('categories.iconBook'), value: 'menu_book' },
  { label: t('categories.iconCamera'), value: 'camera_alt' },
  { label: t('categories.iconElectricity'), value: 'bolt' },
  { label: t('categories.iconWater'), value: 'water_drop' },
  { label: t('categories.iconWifi'), value: 'wifi' },
  { label: t('categories.iconBaby'), value: 'child_care' },
  { label: t('categories.iconOther'), value: 'more_horiz' },
])

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
      $q.notify({ type: 'positive', message: t('categories.categoryUpdated'), position: 'top' })
    } else {
      await categoryStore.addCategory({ ...form })
      $q.notify({ type: 'positive', message: t('categories.categoryAdded'), position: 'top' })
    }
    showDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

function confirmDelete(cat) {
  $q.dialog({
    title: t('categories.deleteCategory'),
    message: `"${cat.name}" ${t('categories.deleteConfirm')}`,
    ok: { label: t('common.delete'), color: 'negative', flat: true },
    cancel: { label: t('common.cancel'), flat: true },
  }).onOk(async () => {
    await categoryStore.deleteCategory(cat.id)
    $q.notify({ type: 'positive', message: t('categories.categoryDeleted'), position: 'top' })
  })
}

onMounted(() => {
  categoryStore.listenCategories()
})

onUnmounted(() => {
  categoryStore.stopListening()
})
</script>
