<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.back()" />
      <div class="text-h6 text-weight-bold q-ml-sm">Categories & Budget</div>
    </div>

    <!-- Tabs -->
    <q-tabs v-model="tab" dense active-color="primary" indicator-color="primary" class="q-mb-md" align="justify">
      <q-tab name="expense" label="Expense" />
      <q-tab name="income" label="Income" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <!-- Expense Categories -->
      <q-tab-panel name="expense" class="q-pa-none">
        <q-list separator>
          <q-slide-item
            v-for="cat in categories.expenseCategories"
            :key="cat.id"
            @right="({ reset }) => { categories.deleteCategory('expense', cat.id); reset() }"
          >
            <template v-slot:right>
              <div class="row items-center q-px-md">
                <q-icon name="delete" color="negative" />
              </div>
            </template>

            <q-item class="touch-target">
              <q-item-section avatar>
                <q-avatar :style="{ background: cat.color + '20' }" size="40px">
                  <q-icon :name="cat.icon" :style="{ color: cat.color }" size="20px" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ cat.name }}</q-item-label>
                <q-item-label caption>{{ cat.subcategories.join(', ') || 'No subcategories' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-right">
                  <q-item-label class="text-weight-bold text-primary">
                    {{ settings.currency }}{{ cat.budget?.toLocaleString() || '0' }}
                  </q-item-label>
                  <q-item-label caption>{{ cat.recurring || 'monthly' }}</q-item-label>
                </div>
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>
      </q-tab-panel>

      <!-- Income Categories -->
      <q-tab-panel name="income" class="q-pa-none">
        <q-list separator>
          <q-slide-item
            v-for="cat in categories.incomeCategories"
            :key="cat.id"
            @right="({ reset }) => { categories.deleteCategory('income', cat.id); reset() }"
          >
            <template v-slot:right>
              <div class="row items-center q-px-md">
                <q-icon name="delete" color="negative" />
              </div>
            </template>

            <q-item class="touch-target">
              <q-item-section avatar>
                <q-avatar :style="{ background: cat.color + '20' }" size="40px">
                  <q-icon :name="cat.icon" :style="{ color: cat.color }" size="20px" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ cat.name }}</q-item-label>
                <q-item-label caption>{{ cat.subcategories.join(', ') || 'No subcategories' }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>

    <div class="swipe-hint q-mt-sm">Swipe left to delete</div>

    <!-- Add Category FAB -->
    <q-page-sticky position="bottom-right" :offset="[16, 80]">
      <q-btn fab icon="add" color="primary" @click="showAddDialog = true" />
    </q-page-sticky>

    <!-- Add Category Dialog -->
    <q-dialog v-model="showAddDialog" position="bottom">
      <q-card style="width: 100%; max-width: 500px; border-radius: 16px 16px 0 0">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">New Category</div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="addCategory" class="q-gutter-md">
            <q-select
              v-model="newCat.type"
              :options="['expense', 'income']"
              label="Type"
              outlined
              dense
            />
            <q-input v-model="newCat.name" label="Category Name" outlined dense />
            <q-input v-model="newCat.icon" label="Material Icon Name" outlined dense hint="e.g. restaurant, shopping_bag" />
            <q-input v-model="newCat.color" label="Color (hex)" outlined dense placeholder="#FF5722" />
            <q-input v-model="newCat.subcategoriesStr" label="Subcategories (comma-separated)" outlined dense />
            <q-input
              v-if="newCat.type === 'expense'"
              v-model.number="newCat.budget"
              label="Monthly Budget"
              type="number"
              outlined
              dense
              :prefix="settings.currency"
            />
            <q-select
              v-if="newCat.type === 'expense'"
              v-model="newCat.recurring"
              :options="['daily', 'weekly', 'monthly']"
              label="Recurring"
              outlined
              dense
            />
            <q-btn type="submit" unelevated rounded color="primary" label="Add Category" class="full-width" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'

const categories = useCategoryStore()
const settings = useSettingsStore()
const tab = ref('expense')
const showAddDialog = ref(false)

const newCat = reactive({
  type: 'expense',
  name: '',
  icon: 'category',
  color: '#757575',
  subcategoriesStr: '',
  budget: 0,
  recurring: 'monthly',
})

function addCategory() {
  if (!newCat.name) return
  const data = {
    name: newCat.name,
    icon: newCat.icon || 'category',
    color: newCat.color || '#757575',
    subcategories: newCat.subcategoriesStr ? newCat.subcategoriesStr.split(',').map((s) => s.trim()) : [],
  }
  if (newCat.type === 'expense') {
    categories.addExpenseCategory({ ...data, budget: newCat.budget, recurring: newCat.recurring })
  } else {
    categories.addIncomeCategory(data)
  }
  newCat.name = ''
  newCat.subcategoriesStr = ''
  newCat.budget = 0
  showAddDialog.value = false
}
</script>
