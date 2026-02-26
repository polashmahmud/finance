<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header - only on certain pages -->
    <q-header v-if="showHeader" class="bg-primary text-white">
      <q-toolbar>
        <q-btn v-if="showBack" flat dense round icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title class="text-weight-semibold">{{ pageTitle }}</q-toolbar-title>
        <q-btn flat dense round icon="search" @click="$router.push('/search')" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Floating Action Button -->
    <q-fab
      v-if="showFab"
      class="finance-fab"
      icon="add"
      direction="up"
      color="accent"
      text-color="dark"
      vertical-actions-align="right"
      style="position: fixed; right: 16px; z-index: 100"
    >
      <q-fab-action color="positive" icon="arrow_downward" label="Income" @click="$router.push('/add-income')" />
      <q-fab-action color="negative" icon="arrow_upward" label="Expense" @click="$router.push('/add-expense')" />
      <q-fab-action color="info" icon="swap_horiz" label="Transfer" @click="$router.push('/transfer')" />
      <q-fab-action color="purple" icon="shopping_cart" label="Market List" @click="$router.push('/market-lists')" />
      <q-fab-action color="orange" icon="note_add" label="Note" @click="$router.push('/notes')" />
    </q-fab>

    <!-- Bottom Navigation -->
    <q-footer v-if="showBottomNav" class="bg-white text-grey-8 finance-bottom-nav" bordered>
      <q-tabs
        v-model="currentTab"
        dense
        active-color="primary"
        indicator-color="primary"
        class="text-grey-6"
        narrow-indicator
      >
        <q-route-tab name="home" icon="home" label="Home" to="/" exact />
        <q-route-tab name="accounts" icon="account_balance_wallet" label="Accounts" to="/accounts" />
        <q-route-tab name="reports" icon="bar_chart" label="Reports" to="/reports" />
        <q-route-tab name="lists" icon="list_alt" label="Lists" to="/market-lists" />
        <q-route-tab name="settings" icon="settings" label="Settings" to="/settings" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentTab = ref('home')

const noHeaderPages = ['/', '/splash', '/accounts', '/reports', '/market-lists', '/settings', '/search']
const noFabPages = ['/splash', '/add-income', '/add-expense', '/transfer', '/search']
const noBottomNavPages = ['/splash']

const showHeader = computed(() => !noHeaderPages.includes(route.path))
const showBack = computed(() => route.path !== '/')
const showFab = computed(() => !noFabPages.includes(route.path))
const showBottomNav = computed(() => !noBottomNavPages.includes(route.path))

const pageTitles = {
  '/add-income': 'Add Income',
  '/add-expense': 'Add Expense',
  '/transfer': 'Transfer',
  '/categories': 'Categories & Budget',
  '/notes': 'Notes',
}

const pageTitle = computed(() => pageTitles[route.path] || 'Finance Manager')
</script>
