<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">বাজারের তালিকা</div>
        <div class="text-caption text-grey">{{ marketLists.lists.length }}টি তালিকা</div>
      </div>
      <q-btn round flat icon="add_circle" color="primary" size="lg" @click="showNewList = true" />
    </div>

    <!-- Lists -->
    <div class="q-gutter-md">
      <q-card v-for="list in marketLists.lists" :key="list.id" class="finance-card">
        <q-card-section>
          <div class="row items-center justify-between q-mb-sm">
            <div>
              <div class="row items-center q-gutter-sm">
                <q-icon name="shopping_cart" color="primary" size="20px" />
                <div class="text-subtitle1 text-weight-bold">{{ list.name }}</div>
              </div>
              <div class="text-caption text-grey q-ml-lg">{{ getCompletedCount(list) }}/{{ list.items.length }} আইটেম</div>
            </div>
            <div class="row q-gutter-xs">
              <q-btn flat round dense icon="add" color="primary" @click="openAddItem(list.id)" />
              <q-btn flat round dense icon="delete" color="negative" @click="marketLists.deleteList(list.id)" />
            </div>
          </div>

          <!-- Progress bar -->
          <q-linear-progress
            :value="list.items.length ? getCompletedCount(list) / list.items.length : 0"
            color="positive"
            rounded
            size="6px"
            track-color="grey-3"
            class="q-mb-md"
          />

          <!-- Items -->
          <q-list dense separator>
            <q-item v-for="item in list.items" :key="item.id" class="touch-target q-pl-none">
              <q-item-section avatar>
                <q-checkbox
                  :model-value="item.bought"
                  color="positive"
                  @update:model-value="marketLists.toggleBought(list.id, item.id)"
                />
              </q-item-section>
              <q-item-section :class="{ 'text-strike text-grey': item.bought }">
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption>পরিমাণ: {{ item.quantity }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-weight-medium">
                  {{ settings.currency }}{{ (item.price * item.quantity).toLocaleString() }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Total -->
          <q-separator class="q-my-sm" />
          <div class="row justify-between items-center">
            <span class="text-weight-bold text-grey">আনুমানিক মোট</span>
            <span class="text-weight-bold text-primary">
              {{ settings.currency }}{{ marketLists.getListTotal(list.id).toLocaleString() }}
            </span>
          </div>

          <!-- Convert to Expense -->
          <q-btn
            flat
            dense
            color="secondary"
            label="খরচে রূপান্তর করুন"
            icon="receipt"
            class="q-mt-sm full-width"
            @click="convertToExpense(list)"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- Empty state -->
    <div v-if="!marketLists.lists.length" class="text-center text-grey q-mt-xl">
      <q-icon name="shopping_cart" size="60px" class="q-mb-md" />
      <div class="text-h6">এখনো কোনো তালিকা নেই</div>
      <div class="text-body2">+ চাপুন নতুন তালিকা তৈরি করতে</div>
    </div>

    <!-- New List Dialog -->
    <q-dialog v-model="showNewList" position="bottom">
      <q-card style="width: 100%; max-width: 500px; border-radius: 16px 16px 0 0">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">নতুন বাজার তালিকা</div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="createList" class="q-gutter-md">
            <q-input v-model="newListName" label="তালিকার নাম" outlined dense autofocus />
            <q-btn type="submit" unelevated rounded color="primary" label="তৈরি করুন" class="full-width" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Item Dialog -->
    <q-dialog v-model="showAddItem" position="bottom">
      <q-card style="width: 100%; max-width: 500px; border-radius: 16px 16px 0 0">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">আইটেম যোগ করুন</div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="addItem" class="q-gutter-md">
            <q-input v-model="newItem.name" label="আইটেমের নাম" outlined dense autofocus />
            <div class="row q-gutter-md">
              <q-input v-model.number="newItem.quantity" label="পরিমাণ" type="number" outlined dense class="col" />
              <q-input v-model.number="newItem.price" label="আনুমানিক দাম" type="number" outlined dense class="col" :prefix="settings.currency" />
            </div>
            <q-btn type="submit" unelevated rounded color="primary" label="আইটেম যোগ করুন" class="full-width" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useMarketListStore } from 'stores/marketListStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'
import { Notify } from 'quasar'

const marketLists = useMarketListStore()
const transactions = useTransactionStore()
const accounts = useAccountStore()
const settings = useSettingsStore()

const showNewList = ref(false)
const showAddItem = ref(false)
const newListName = ref('')
const activeListId = ref(null)
const newItem = reactive({ name: '', quantity: 1, price: 0 })

function getCompletedCount(list) {
  return list.items.filter((i) => i.bought).length
}

function createList() {
  if (!newListName.value) return
  marketLists.addList({ name: newListName.value })
  newListName.value = ''
  showNewList.value = false
}

function openAddItem(listId) {
  activeListId.value = listId
  newItem.name = ''
  newItem.quantity = 1
  newItem.price = 0
  showAddItem.value = true
}

function addItem() {
  if (!newItem.name) return
  marketLists.addItem(activeListId.value, { ...newItem })
  newItem.name = ''
  newItem.quantity = 1
  newItem.price = 0
  showAddItem.value = false
}

function convertToExpense(list) {
  const total = marketLists.getListTotal(list.id)
  transactions.addTransaction({
    type: 'expense',
    amount: total,
    category: 'শপিং',
    subcategory: '',
    accountId: accounts.accounts[0]?.id,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toTimeString().slice(0, 5),
    notes: `বাজার তালিকা: ${list.name}`,
  })
  accounts.updateBalance(accounts.accounts[0]?.id, -total)
  Notify.create({ type: 'positive', message: `"${list.name}" থেকে ${settings.currency}${total.toLocaleString()} খরচ তৈরি হয়েছে` })
}
</script>
