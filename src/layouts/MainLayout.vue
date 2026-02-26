<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header - only on certain pages -->
    <q-header v-if="showHeader" class="bg-green-gradient text-white">
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
      color="secondary"
      text-color="white"
      vertical-actions-align="right"
      style="position: fixed; right: 16px; z-index: 100"
    >
      <q-fab-action color="positive" text-color="white" icon="arrow_downward" label="আয়" @click="$router.push('/add-income')" />
      <q-fab-action color="negative" text-color="white" icon="arrow_upward" label="ব্যয়" @click="$router.push('/add-expense')" />
      <q-fab-action color="info" text-color="white" icon="swap_horiz" label="ট্রান্সফার" @click="$router.push('/transfer')" />
      <q-fab-action color="purple" text-color="white" icon="shopping_cart" label="বাজার তালিকা" @click="$router.push('/market-lists')" />
      <q-fab-action color="orange" text-color="white" icon="note_add" label="নোট" @click="$router.push('/notes')" />
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
        <q-route-tab name="home" icon="home" label="হোম" to="/" exact />
        <q-route-tab name="accounts" icon="account_balance_wallet" label="অ্যাকাউন্ট" to="/accounts" />
        <q-route-tab name="reports" icon="bar_chart" label="রিপোর্ট" to="/reports" />
        <q-route-tab name="lists" icon="shopping_cart" label="তালিকা" to="/market-lists" />
        <q-route-tab name="settings" icon="settings" label="সেটিংস" to="/settings" />
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
  '/add-income': 'আয় যোগ করুন',
  '/add-expense': 'ব্যয় যোগ করুন',
  '/transfer': 'ট্রান্সফার',
  '/categories': 'ক্যাটাগরি ও বাজেট',
  '/notes': 'নোটস',
}

const pageTitle = computed(() => pageTitles[route.path] || 'ফাইন্যান্স ম্যানেজার')
</script>
