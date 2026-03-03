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
            <div class="column q-mb-sm">
              <!-- Title row -->
              <div class="row items-center no-wrap cursor-pointer q-mb-xs" @click="toggleExpanded(list.id)">
                <q-icon name="shopping_cart" color="dark" size="20px" class="q-mr-sm flex-shrink-0" />
                <div class="col" style="min-width:0">
                  <div class="text-subtitle1 text-weight-bold" style="white-space:normal; word-break:break-word;">{{ list.name }}</div>
                  <div class="text-caption text-grey">{{ getCompletedCount(list) }}/{{ list.items.length }} {{ $t('marketLists.items') }}</div>
                </div>
                <q-btn flat round dense :icon="isExpanded(list.id) ? 'expand_less' : 'expand_more'" color="grey-6" class="q-ml-xs flex-shrink-0" @click.stop="toggleExpanded(list.id)" />
              </div>
              <!-- Buttons row -->
              <div class="row items-center q-gutter-xs">
                <q-btn flat round dense icon="edit" color="grey-6" @click.stop="openRenameDialog(list)" />
                <q-btn flat round dense icon="add" color="dark" @click.stop="openAddItem(list.id)" />
                <q-btn flat round dense icon="content_copy" color="primary" @click.stop="openCopyDialog(list)" />
                <q-btn flat round dense icon="share" color="info" @click.stop="shareList(list)" />
                <q-btn flat round dense icon="delete_outline" color="negative" @click.stop="confirmDeleteList(list)" />
              </div>
            </div>

            <!-- Collapsible body -->
            <div v-show="isExpanded(list.id)">

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
            <div class="q-mt-sm">
              <q-btn v-if="!list.convertedAt" flat dense color="dark" :label="$t('marketLists.convertToExpense')" icon="receipt"
                class="full-width" @click="convertToExpense(list)" :disable="!list.items.length" />
              <div v-else class="row items-center justify-between">
                <div class="row items-center q-gutter-xs text-positive">
                  <q-icon name="check_circle" size="16px" />
                  <span class="text-caption">{{ $t('marketLists.expenseConverted') }}</span>
                </div>
                <q-btn flat dense color="grey" :label="$t('marketLists.convertAgain')" icon="refresh"
                  size="sm" @click="convertToExpense(list)" :disable="!list.items.length" />
              </div>
            </div>

            </div><!-- end collapsible body -->

            <!-- Collapsed summary (only when folded) -->
            <div v-show="!isExpanded(list.id)" class="row items-center justify-between q-mt-xs">
              <div class="row items-center q-gutter-xs text-grey-6" style="font-size:12px;">
                <q-icon name="shopping_bag" size="14px" />
                <span>{{ settings.currency }}{{ settings.formatNumber(marketLists.getListTotal(list.id)) }}</span>
                <span>&middot;</span>
                <q-icon :name="list.convertedAt ? 'check_circle' : 'radio_button_unchecked'" size="14px" :color="list.convertedAt ? 'positive' : 'grey-5'" />
                <span>{{ list.convertedAt ? $t('marketLists.expenseConverted') : $t('marketLists.convertToExpense') }}</span>
              </div>
            </div>
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

    <!-- Convert to Expense Dialog -->
    <q-dialog v-model="showConvertDialog" persistent>
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; padding: 0 16px 24px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">{{ $t('marketLists.convertToExpenseTitle') }}</div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitConvertExpense">
            <!-- Amount -->
            <q-input v-model.number="convertForm.amount" :label="$t('common.amount')" type="number" outlined
              color="dark" :prefix="settings.currency"
              :rules="[val => val > 0 || $t('common.validAmount')]"
              input-class="text-h5 text-weight-bold" style="margin-bottom: 10px;" />

            <!-- Category & Account -->
            <div class="row q-col-gutter-md" style="margin-bottom: 10px;">
              <div class="col-6">
                <q-select v-model="convertForm.category" :options="expenseCategoryOptions"
                  :label="$t('common.category')" outlined color="dark" emit-value map-options
                  :rules="[val => !!val || $t('common.categoryRequired')]">
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
                <q-select v-model="convertForm.accountId" :options="accountOptions"
                  :label="$t('common.account')" outlined color="dark" emit-value map-options
                  :rules="[val => !!val || $t('common.accountRequired')]" />
              </div>
            </div>

            <!-- Date & Time -->
            <div class="row q-col-gutter-md" style="margin-bottom: 10px;">
              <div class="col-6">
                <q-input v-model="convertForm.date" :label="$t('common.date')" outlined color="dark" readonly
                  :rules="[val => !!val || $t('common.dateRequired')]">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="convertForm.date" mask="YYYY-MM-DD" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input v-model="convertForm.time" :label="$t('common.time')" outlined color="dark" readonly
                  :rules="[val => !!val || $t('common.timeRequired')]">
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="convertForm.time" mask="HH:mm" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <!-- Notes -->
            <q-input v-model="convertForm.notes" :label="$t('common.noteOptional')" outlined color="dark"
              type="textarea" rows="2" style="margin-bottom: 10px;" />

            <!-- Submit -->
            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              size="lg" icon="check" :label="$t('addExpense.saveExpense')" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete List Confirmation Dialog -->
    <q-dialog v-model="deleteListModalOpen" persistent>
      <q-card style="border-radius: 28px; width: 100%; max-width: 480px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="row items-center q-gutter-sm">
            <q-avatar color="negative" text-color="white" icon="delete_outline" size="36px" />
            <div class="text-h6 text-weight-bold" style="color: #222;">{{ $t('marketLists.deleteModalTitle') }}</div>
          </div>
          <q-btn icon="close" flat round dense @click="deleteListModalOpen = false" style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <!-- List name summary -->
          <div class="q-pa-sm q-mb-md row items-center q-gutter-sm" style="background: #f8fafc; border-radius: 12px;">
            <q-icon name="shopping_cart" color="dark" size="22px" />
            <div class="text-weight-bold">{{ deleteListTarget?.name }}</div>
            <q-space />
            <div class="text-caption text-grey">{{ deleteListTarget?.items?.length || 0 }} {{ $t('marketLists.items') }}</div>
          </div>

          <!-- Linked transactions section -->
          <div class="text-caption text-weight-bold text-grey-7 q-mb-xs q-mt-sm">
            {{ $t('marketLists.linkedTransactions') }}
          </div>
          <div v-if="deleteLinkedTransactions.length" class="q-mb-md" style="max-height: 220px; overflow-y: auto;">
            <div v-for="tx in deleteLinkedTransactions" :key="tx.id"
              class="row items-center q-pa-sm q-mb-xs" style="background: #fff5f5; border-radius: 10px; border: 1px solid #fecaca;">
              <q-avatar :style="{ background: getCategoryColor(tx.category) + '20' }" size="32px" class="q-mr-sm">
                <q-icon :name="getCategoryIcon(tx.category)" :style="{ color: getCategoryColor(tx.category) }" size="16px" />
              </q-avatar>
              <div class="col">
                <div class="text-weight-medium" style="font-size: 13px;">{{ tx.category }}</div>
                <div class="text-caption text-grey">{{ settings.formatDate(tx.date) }} &middot; {{ getAccountName(tx.accountId) }}</div>
              </div>
              <div class="amount-expense text-weight-bold" style="font-size: 13px;">
                -{{ settings.currency }}{{ settings.formatNumber(tx.amount) }}
              </div>
            </div>
          </div>
          <div v-else class="text-caption text-grey q-mb-md row items-center q-gutter-xs">
            <q-icon name="info_outline" size="14px" />
            <span>{{ $t('marketLists.noLinkedTransactions') }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="column q-gutter-sm">
            <q-btn
              v-if="deleteLinkedTransactions.length"
              :label="$t('marketLists.deleteListWithTxRefund')"
              icon="savings"
              color="negative"
              unelevated
              class="full-width"
              :loading="saving"
              @click="doDeleteWithTransactions(true)"
            />
            <q-btn
              v-if="deleteLinkedTransactions.length"
              :label="$t('marketLists.deleteListWithTx')"
              icon="delete_forever"
              outline
              color="negative"
              class="full-width"
              :loading="saving"
              @click="doDeleteWithTransactions(false)"
            />
            <q-btn
              :label="$t('marketLists.deleteListOnly')"
              :icon="deleteLinkedTransactions.length ? 'playlist_remove' : 'delete_forever'"
              :outline="!!deleteLinkedTransactions.length"
              :unelevated="!deleteLinkedTransactions.length"
              :color="deleteLinkedTransactions.length ? 'grey-7' : 'negative'"
              class="full-width"
              :loading="saving"
              @click="doDeleteListOnly"
            />
            <q-btn
              :label="$t('common.cancel')"
              flat
              color="grey-7"
              class="full-width"
              @click="deleteListModalOpen = false"
            />
          </div>
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useMarketListStore } from 'stores/marketListStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useAccountStore } from 'stores/accountStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'

const { t } = useI18n()
const $q = useQuasar()
const marketLists = useMarketListStore()
const transactions = useTransactionStore()
const accounts = useAccountStore()
const categories = useCategoryStore()
const settings = useSettingsStore()

const showNewList = ref(false)
const showCopyList = ref(false)
const showRenameList = ref(false)
const showAddItem = ref(false)
const showEditItem = ref(false)
const showConvertDialog = ref(false)
const convertingListId = ref(null)
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
const convertForm = reactive({ amount: 0, category: '', accountId: null, date: '', time: '', notes: '' })

// Delete list modal
const deleteListModalOpen = ref(false)
const deleteListTarget = ref(null)

// Fold / expand per list
const collapsedLists = ref(new Set())
function isExpanded(listId) { return !collapsedLists.value.has(listId) }
function toggleExpanded(listId) {
  const s = new Set(collapsedLists.value)
  if (s.has(listId)) s.delete(listId)
  else s.add(listId)
  collapsedLists.value = s
}

const deleteLinkedTransactions = computed(() => {
  if (!deleteListTarget.value) return []
  const prefix = t('marketLists.marketListNotePrefix')
  return transactions.transactions.filter(
    (tx) => tx.type === 'expense' && tx.notes === `${prefix}${deleteListTarget.value.name}`
  )
})

const expenseCategoryOptions = computed(() =>
  categories.expenseCategories.map((c) => ({ label: c.name, value: c.name, icon: c.icon, color: c.color }))
)
const accountOptions = computed(() =>
  accounts.accounts.map((a) => ({
    label: `${a.name} (${settings.currency}${settings.formatNumber(a.balance || 0)})`,
    value: a.id
  }))
)

function getCategoryColor(categoryName) {
  const all = [...categories.incomeCategories, ...categories.expenseCategories]
  return all.find((c) => c.name === categoryName)?.color || '#757575'
}

function getCategoryIcon(categoryName) {
  const all = [...categories.incomeCategories, ...categories.expenseCategories]
  return all.find((c) => c.name === categoryName)?.icon || 'receipt'
}

function getAccountName(accountId) {
  return accounts.accounts.find((a) => a.id === accountId)?.name || ''
}

function openNewListDialog() {
  const prefix = t('marketLists.defaultCopyPrefix')
  newListName.value = prefix + settings.formatDate(new Date().toISOString().slice(0, 10))
  showNewList.value = true
}

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
  deleteListTarget.value = list
  deleteListModalOpen.value = true
}

async function doDeleteListOnly() {
  if (!deleteListTarget.value) return
  saving.value = true
  try {
    await marketLists.deleteList(deleteListTarget.value.id)
    $q.notify({ type: 'positive', message: t('marketLists.listDeleted'), position: 'top' })
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  deleteListModalOpen.value = false
  deleteListTarget.value = null
  saving.value = false
}

async function doDeleteWithTransactions(refund = false) {
  if (!deleteListTarget.value) return
  saving.value = true
  try {
    const txList = deleteLinkedTransactions.value.slice()
    for (const tx of txList) {
      await transactions.deleteTransaction(tx.id)
      if (refund && tx.accountId) {
        await accounts.updateBalance(tx.accountId, tx.amount)
      }
    }
    await marketLists.deleteList(deleteListTarget.value.id)
    $q.notify({ type: 'positive', message: t('marketLists.listDeleted'), position: 'top' })
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  deleteListModalOpen.value = false
  deleteListTarget.value = null
  saving.value = false
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

  const now = new Date()
  const groceriesCategory = categories.expenseCategories.find(
    (c) => c.name.toLowerCase().includes('grocer') || c.name.toLowerCase().includes('বাজার') || c.name.toLowerCase().includes('shopping')
  )
  convertForm.amount = total
  convertForm.category = groceriesCategory?.name || categories.expenseCategories[0]?.name || ''
  convertForm.accountId = accounts.accounts[0]?.id || null
  convertForm.date = now.toISOString().slice(0, 10)
  convertForm.time = now.toTimeString().slice(0, 5)
  convertForm.notes = `${t('marketLists.marketListNotePrefix')}${list.name}`
  convertingListId.value = list.id
  showConvertDialog.value = true
}

async function submitConvertExpense() {
  if (!convertForm.amount || convertForm.amount <= 0) return
  saving.value = true
  try {
    await transactions.addTransaction({ ...convertForm, type: 'expense' })
    await accounts.updateBalance(convertForm.accountId, -convertForm.amount)
    if (convertingListId.value) {
      await marketLists.updateList(convertingListId.value, { convertedAt: Date.now() })
    }
    $q.notify({ type: 'positive', message: t('marketLists.expenseCreated', { amount: settings.currency + settings.formatNumber(convertForm.amount) }), position: 'top' })
    showConvertDialog.value = false
    convertingListId.value = null
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
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
  categories.listenCategories()
  accounts.listenAccounts()
  transactions.listenTransactions()
})

onUnmounted(() => {
  marketLists.stopListening()
  categories.stopListening()
  accounts.stopListening()
  transactions.stopListening()
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
