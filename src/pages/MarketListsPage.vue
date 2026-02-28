<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">{{ $t('marketLists.title') }}</div>
        <div class="text-caption text-grey">{{ marketLists.lists.length }}{{ $t('marketLists.countSuffix') }}</div>
      </div>
      <q-btn round flat icon="add_circle" color="dark" size="lg" @click="showNewList = true" />
    </div>

    <!-- Loading -->
    <div v-if="marketLists.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <!-- Lists -->
    <template v-else>
      <div class="q-gutter-md">
        <q-card v-for="list in marketLists.lists" :key="list.id" class="finance-card">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <div>
                <div class="row items-center q-gutter-sm">
                  <q-icon name="shopping_cart" color="dark" size="20px" />
                  <div class="text-subtitle1 text-weight-bold">{{ list.name }}</div>
                </div>
                <div class="text-caption text-grey q-ml-lg">{{ getCompletedCount(list) }}/{{ list.items.length }} {{
                  $t('marketLists.items') }}
                </div>
              </div>
              <div class="row q-gutter-xs">
                <q-btn flat round dense icon="add" color="dark" @click="openAddItem(list.id)" />
                <q-btn flat round dense icon="delete_outline" color="negative" @click="confirmDeleteList(list)" />
              </div>
            </div>

            <!-- Progress bar -->
            <q-linear-progress :value="list.items.length ? getCompletedCount(list) / list.items.length : 0" color="dark"
              rounded size="6px" track-color="grey-3" class="q-mb-md" />

            <!-- Items -->
            <q-list dense separator>
              <q-item v-for="item in list.items" :key="item.id" class="touch-target q-pl-none">
                <q-item-section avatar>
                  <q-checkbox :model-value="item.bought" color="dark"
                    @update:model-value="marketLists.toggleBought(list.id, item.id, item.bought)" />
                </q-item-section>
                <q-item-section :class="{ 'text-strike text-grey': item.bought }">
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>{{ $t('marketLists.quantityPrefix') }} {{ item.quantity }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center q-gutter-xs">
                    <span class="text-weight-medium">
                      {{ settings.currency }}{{ settings.formatNumber(item.price * item.quantity) }}
                    </span>
                    <q-btn flat round dense icon="close" size="xs" color="grey"
                      @click="marketLists.removeItem(list.id, item.id)" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

            <!-- Empty items -->
            <div v-if="!list.items.length" class="text-center text-grey q-pa-md">
              <q-icon name="playlist_add" size="28px" class="q-mb-xs" />
              <div class="text-caption">{{ $t('marketLists.noItems') }}</div>
            </div>

            <!-- Total -->
            <q-separator class="q-my-sm" />
            <div class="row justify-between items-center">
              <span class="text-weight-bold text-grey">{{ $t('marketLists.estimatedTotal') }}</span>
              <span class="text-weight-bold" style="color: #111;">
                {{ settings.currency }}{{ settings.formatNumber(marketLists.getListTotal(list.id)) }}
              </span>
            </div>

            <!-- Convert to Expense -->
            <q-btn flat dense color="dark" :label="$t('marketLists.convertToExpense')" icon="receipt"
              class="q-mt-sm full-width" @click="convertToExpense(list)" :disable="!list.items.length" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Empty state -->
      <div v-if="!marketLists.lists.length" class="text-center text-grey q-mt-xl">
        <q-icon name="shopping_cart" size="60px" class="q-mb-md" />
        <div class="text-h6">{{ $t('marketLists.noLists') }}</div>
        <div class="text-body2">{{ $t('marketLists.addPrompt') }}</div>
      </div>
    </template>

    <!-- New List Dialog -->
    <q-dialog v-model="showNewList" position="bottom" transition-show="slide-up" transition-hide="slide-down">
      <q-card
        style="border-top-left-radius: 28px; border-top-right-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">{{ $t('marketLists.newMarketList') }}</div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="createList">
            <q-input v-model="newListName" :label="$t('marketLists.listName')" outlined dense autofocus color="dark"
              :rules="[(val) => (val && val.length > 0) || $t('common.nameRequired')]" style="margin-bottom: 10px;" />
            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="$t('marketLists.create')" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Item Dialog -->
    <q-dialog v-model="showAddItem" position="bottom" transition-show="slide-up" transition-hide="slide-down">
      <q-card
        style="border-top-left-radius: 28px; border-top-right-radius: 28px; width: 100%; max-width: 500px; padding: 0 16px 24px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">{{ $t('marketLists.addItem') }}</div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="addItem">
            <q-input v-model="newItem.name" :label="$t('marketLists.itemName')" outlined dense autofocus color="dark"
              :rules="[(val) => (val && val.length > 0) || $t('common.nameRequired')]" style="margin-bottom: 10px;" />
            <div class="row q-col-gutter-md" style="margin-bottom: 10px;">
              <div class="col-6">
                <q-input v-model="newItem.quantity" :label="$t('common.amount')" outlined dense color="dark"
                  :hint="$t('marketLists.quantityHint')" />
              </div>
              <div class="col-6">
                <q-input v-model.number="newItem.price" :label="$t('marketLists.estimatedPrice')" type="number" outlined
                  dense color="dark" :prefix="settings.currency" />
              </div>
            </div>
            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="$t('marketLists.addItemBtn')" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useMarketListStore } from 'stores/marketListStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'

const { t } = useI18n()
const $q = useQuasar()
const marketLists = useMarketListStore()
const transactions = useTransactionStore()
const accounts = useAccountStore()
const settings = useSettingsStore()

const showNewList = ref(false)
const showAddItem = ref(false)
const newListName = ref('')
const activeListId = ref(null)
const saving = ref(false)
const newItem = reactive({ name: '', quantity: 1, price: 0 })

function getCompletedCount(list) {
  return list.items.filter((i) => i.bought).length
}

async function createList() {
  if (!newListName.value) return
  saving.value = true
  try {
    await marketLists.addList({ name: newListName.value })
    newListName.value = ''
    showNewList.value = false
    $q.notify({ type: 'positive', message: t('marketLists.listCreated'), position: 'top' })
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

function confirmDeleteList(list) {
  $q.dialog({
    title: t('marketLists.deleteList'),
    message: `"${list.name}" ${t('marketLists.deleteConfirm')}`,
    ok: { label: t('common.delete'), color: 'negative', flat: true },
    cancel: { label: t('common.cancel'), flat: true },
  }).onOk(async () => {
    await marketLists.deleteList(list.id)
    $q.notify({ type: 'positive', message: t('marketLists.listDeleted'), position: 'top' })
  })
}

function openAddItem(listId) {
  activeListId.value = listId
  newItem.name = ''
  newItem.quantity = 1
  newItem.price = 0
  showAddItem.value = true
}

async function addItem() {
  if (!newItem.name) return
  saving.value = true
  try {
    await marketLists.addItem(activeListId.value, { ...newItem })
    newItem.name = ''
    newItem.quantity = 1
    newItem.price = 0
    showAddItem.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

function convertToExpense(list) {
  const total = marketLists.getListTotal(list.id)
  if (total <= 0) return

  $q.dialog({
    title: t('marketLists.convertToExpenseTitle'),
    message: t('marketLists.convertToExpenseConfirm', { amount: settings.currency + settings.formatNumber(total) }),
    ok: { label: t('common.save'), color: 'negative', flat: true },
    cancel: { label: t('common.cancel'), flat: true },
  }).onOk(() => {
    transactions.addTransaction({
      type: 'expense',
      amount: total,
      category: 'Shopping',
      accountId: accounts.accounts[0]?.id,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      notes: `${t('marketLists.marketListNotePrefix')}${list.name}`,
    })
    accounts.updateBalance(accounts.accounts[0]?.id, -total)
    $q.notify({ type: 'positive', message: `"${list.name}" ${t('marketLists.expenseCreated', { amount: settings.currency + total.toLocaleString() })}`, position: 'top' })
  })
}

onMounted(() => {
  marketLists.listenLists()
})

onUnmounted(() => {
  marketLists.stopListening()
})
</script>
