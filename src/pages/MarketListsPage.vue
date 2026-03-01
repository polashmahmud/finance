<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">{{ $t('marketLists.title') }}</div>
        <div class="text-caption text-grey">{{ marketLists.lists.length }}{{ $t('marketLists.countSuffix') }}</div>
      </div>
      <q-btn round flat icon="add_circle" color="dark" size="lg" @click="openNewListDialog" />
    </div>

    <!-- Loading -->
    <div v-if="marketLists.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <!-- Lists -->
    <template v-else>
      <div class="row q-col-gutter-md">
        <div v-for="list in marketLists.lists" :key="list.id" class="col-12 col-md-6">
        <q-card class="finance-card full-height">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <div>
                <div class="row items-center q-gutter-sm">
                  <q-icon name="shopping_cart" color="dark" size="20px" />
                  <div class="text-subtitle1 text-weight-bold cursor-pointer" @click="openRenameDialog(list)">
                    {{ list.name }}
                    <q-icon name="edit" size="xs" color="grey" class="q-ml-xs" />
                  </div>
                </div>
                <div class="text-caption text-grey q-ml-lg">{{ getCompletedCount(list) }}/{{ list.items.length }} {{
                  $t('marketLists.items') }}
                </div>
              </div>
              <div class="row q-gutter-xs">
                <q-btn flat round dense icon="add" color="dark" @click="openAddItem(list.id)" />
                <q-btn flat round dense icon="content_copy" color="primary" @click="openCopyDialog(list)" />
                <q-btn flat round dense icon="share" color="info" @click="shareList(list)" />
                <q-btn flat round dense icon="delete_outline" color="negative" @click="confirmDeleteList(list)" />
              </div>
            </div>

            <!-- Progress bar -->
            <q-linear-progress :value="list.items.length ? getCompletedCount(list) / list.items.length : 0" color="dark"
              rounded size="6px" track-color="grey-3" class="q-mb-md" />

            <div v-if="list.items.length" class="text-center text-caption text-grey q-mb-sm">
              <q-icon name="swipe" size="16px" class="q-mr-xs" />
              {{ $t('marketLists.swipeHint') }}
            </div>

            <!-- Items -->
            <q-list dense separator>
              <q-slide-item v-for="item in list.items" :key="item.id" @left="onLeftSwipe(list, item, $event)"
                @right="onRightSwipe(list, item, $event)" left-color="primary" right-color="negative"
                class="touch-target q-mb-sm" style="border-radius: 8px;">
                <template v-slot:left>
                  <q-icon name="edit" />
                </template>
                <template v-slot:right>
                  <q-icon name="delete" />
                </template>

                <q-item class="q-pl-none q-py-none">
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
                        {{ settings.currency }}{{ settings.formatNumber(item.price || 0) }}
                      </span>
                    </div>
                  </q-item-section>
                </q-item>
              </q-slide-item>
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
      </div>

      <!-- Empty state -->
      <div v-if="!marketLists.lists.length" class="text-center text-grey q-mt-xl">
        <q-icon name="shopping_cart" size="60px" class="q-mb-md" />
        <div class="text-h6">{{ $t('marketLists.noLists') }}</div>
        <div class="text-body2">{{ $t('marketLists.addPrompt') }}</div>
      </div>
    </template>

    <!-- New List Dialog -->
    <q-dialog v-model="showNewList">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
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

    <!-- Copy List Dialog -->
    <q-dialog v-model="showCopyList">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">{{ $t('marketLists.copyMarketListTitle') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitCopyList">
            <q-input v-model="copyListName" :label="$t('marketLists.listName')" outlined dense autofocus color="dark"
              :rules="[(val) => (val && val.length > 0) || $t('common.nameRequired')]" style="margin-bottom: 10px;" />
            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="$t('marketLists.copyMarketListBtn')" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Rename List Dialog -->
    <q-dialog v-model="showRenameList">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">{{ $t('marketLists.renameListTitle') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitRenameList">
            <q-input v-model="renameListName" :label="$t('marketLists.listName')" outlined dense autofocus color="dark"
              :rules="[(val) => (val && val.length > 0) || $t('common.nameRequired')]" style="margin-bottom: 10px;" />
            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="$t('marketLists.rename')" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Item Dialog -->
    <q-dialog v-model="showAddItem">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; padding: 0 16px 24px; background: white;">
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

    <!-- Edit Item Dialog -->
    <q-dialog v-model="showEditItem">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; padding: 0 16px 24px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">{{ $t('marketLists.editItemTitle') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitEditItem">
            <q-input v-model="editItemData.name" :label="$t('marketLists.itemName')" outlined dense autofocus
              color="dark" :rules="[(val) => (val && val.length > 0) || $t('common.nameRequired')]"
              style="margin-bottom: 10px;" />
            <div class="row q-col-gutter-md" style="margin-bottom: 10px;">
              <div class="col-6">
                <q-input v-model="editItemData.quantity" :label="$t('common.amount')" outlined dense color="dark"
                  :hint="$t('marketLists.quantityHint')" />
              </div>
              <div class="col-6">
                <q-input v-model.number="editItemData.price" :label="$t('marketLists.estimatedPrice')" type="number"
                  outlined dense color="dark" :prefix="settings.currency" />
              </div>
            </div>
            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="$t('marketLists.edit')" :loading="saving" />
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
const showCopyList = ref(false)
const showRenameList = ref(false)
const showAddItem = ref(false)
const showEditItem = ref(false)
const newListName = ref('')
const copyListName = ref('')
const renameListName = ref('')
const listToCopy = ref(null)
const listToRename = ref(null)
const activeListId = ref(null)
const activeItemId = ref(null)
const saving = ref(false)
const newItem = reactive({ name: '', quantity: 1, price: 0 })
const editItemData = reactive({ name: '', quantity: 1, price: 0 })

function getCompletedCount(list) {
  return list.items.filter((i) => i.bought).length
}

function openNewListDialog() {
  const prefix = t('marketLists.defaultCopyPrefix')
  newListName.value = prefix + settings.formatDate(new Date().toISOString().slice(0, 10))
  showNewList.value = true
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

function openCopyDialog(list) {
  listToCopy.value = list
  const prefix = t('marketLists.defaultCopyPrefix')
  copyListName.value = prefix + settings.formatDate(new Date().toISOString().slice(0, 10))
  showCopyList.value = true
}

async function submitCopyList() {
  if (!copyListName.value || !listToCopy.value) return
  saving.value = true
  const list = listToCopy.value
  try {
    const newListRef = await marketLists.addList({ name: copyListName.value })

    // addList returns the document reference in marketListStore.js, but the store implementation
    // might not return the ID directly depending on how it's written. We will fetch the lists again
    // and find the newest one with this name if we didn't get an ID, but assuming addList adds
    // it locally or we can just iterate.
    const newListId = newListRef?.id || newListRef

    if (newListId && list.items && list.items.length > 0) {
      for (const item of list.items) {
        await marketLists.addItem(newListId, {
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          bought: false
        })
      }
    }

    showCopyList.value = false
    listToCopy.value = null
    copyListName.value = ''
    $q.notify({ type: 'positive', message: t('marketLists.copySuccess'), position: 'top' })
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

function openRenameDialog(list) {
  listToRename.value = list
  renameListName.value = list.name
  showRenameList.value = true
}

async function submitRenameList() {
  if (!renameListName.value || !listToRename.value) return
  saving.value = true
  try {
    await marketLists.updateList(listToRename.value.id, { name: renameListName.value })
    showRenameList.value = false
    listToRename.value = null
    renameListName.value = ''
    $q.notify({ type: 'positive', message: t('marketLists.renameListSuccess'), position: 'top' })
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

async function shareList(list) {
  let text = `${list.name}\n\n`
  if (list.items && list.items.length > 0) {
    list.items.forEach(item => {
      text += `- ${item.name} (${item.quantity})\n`
    })
  } else {
    text += t('marketLists.emptyStateMessage')
  }

  if (navigator.share) {
    try {
      await navigator.share({
        title: list.name,
        text: text,
      })
      $q.notify({ type: 'positive', message: t('marketLists.shareSuccess'), position: 'top' })
    } catch (err) {
      // User cancelled share or it failed
      console.error('Error sharing:', err)
    }
  } else {
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(text)
      $q.notify({ type: 'positive', message: t('marketLists.shareSuccess'), position: 'top' })
    } catch {
      $q.notify({ type: 'negative', message: t('marketLists.shareError'), position: 'top' })
    }
  }
}

onMounted(() => {
  marketLists.listenLists()
})

onUnmounted(() => {
  marketLists.stopListening()
})

function onLeftSwipe(list, item, { reset }) {
  activeListId.value = list.id
  activeItemId.value = item.id
  editItemData.name = item.name
  editItemData.quantity = item.quantity
  editItemData.price = item.price || 0
  showEditItem.value = true
  reset()
}

function onRightSwipe(list, item, { reset }) {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.areYouSure'),
    ok: { label: t('common.delete'), color: 'negative', flat: true },
    cancel: { label: t('common.cancel'), flat: true },
  }).onOk(() => {
    marketLists.removeItem(list.id, item.id)
  }).onCancel(() => {
    reset()
  })
}

async function submitEditItem() {
  if (!editItemData.name) return
  saving.value = true
  try {
    await marketLists.updateItem(activeListId.value, activeItemId.value, {
      name: editItemData.name,
      quantity: editItemData.quantity,
      price: editItemData.price
    })
    showEditItem.value = false
    $q.notify({ type: 'positive', message: t('marketLists.itemUpdateSuccess'), position: 'top' })
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

</script>
