<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Market Lists</div>
        <div class="text-caption text-grey">{{ marketLists.lists.length }} lists</div>
      </div>
      <q-btn round flat icon="add_circle" color="primary" size="lg" @click="showNewList = true" />
    </div>

    <!-- Lists -->
    <div class="q-gutter-md">
      <q-card v-for="list in marketLists.lists" :key="list.id" class="finance-card">
        <q-card-section>
          <div class="row items-center justify-between q-mb-sm">
            <div>
              <div class="text-subtitle1 text-weight-bold">{{ list.name }}</div>
              <div class="text-caption text-grey">{{ list.date }} &middot; {{ list.items.length }} items</div>
            </div>
            <div class="row q-gutter-xs">
              <q-btn flat round dense icon="add" color="primary" @click="openAddItem(list.id)" />
              <q-btn flat round dense icon="delete" color="negative" @click="marketLists.deleteList(list.id)" />
            </div>
          </div>

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
                <q-item-label caption>Qty: {{ item.quantity }} &middot; {{ settings.currency }}{{ item.price }}</q-item-label>
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
            <span class="text-weight-bold">Total</span>
            <span class="text-weight-bold text-primary">
              {{ settings.currency }}{{ marketLists.getListTotal(list.id).toLocaleString() }}
            </span>
          </div>

          <!-- Convert to Expense -->
          <q-btn
            flat
            dense
            color="secondary"
            label="Convert to Expense"
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
      <div class="text-h6">No market lists yet</div>
      <div class="text-body2">Tap + to create one</div>
    </div>

    <!-- New List Dialog -->
    <q-dialog v-model="showNewList" position="bottom">
      <q-card style="width: 100%; max-width: 500px; border-radius: 16px 16px 0 0">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">New Market List</div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="createList" class="q-gutter-md">
            <q-input v-model="newListName" label="List Name" outlined dense autofocus />
            <q-btn type="submit" unelevated rounded color="primary" label="Create" class="full-width" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Item Dialog -->
    <q-dialog v-model="showAddItem" position="bottom">
      <q-card style="width: 100%; max-width: 500px; border-radius: 16px 16px 0 0">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Add Item</div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="addItem" class="q-gutter-md">
            <q-input v-model="newItem.name" label="Item Name" outlined dense autofocus />
            <div class="row q-gutter-md">
              <q-input v-model.number="newItem.quantity" label="Quantity" type="number" outlined dense class="col" />
              <q-input v-model.number="newItem.price" label="Est. Price" type="number" outlined dense class="col" :prefix="settings.currency" />
            </div>
            <q-btn type="submit" unelevated rounded color="primary" label="Add Item" class="full-width" />
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
    category: 'Shopping',
    subcategory: '',
    accountId: accounts.accounts[0]?.id,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toTimeString().slice(0, 5),
    notes: `Market list: ${list.name}`,
  })
  accounts.updateBalance(accounts.accounts[0]?.id, -total)
  Notify.create({ type: 'positive', message: `Expense of ${settings.currency}${total.toLocaleString()} created from "${list.name}"` })
}
</script>
