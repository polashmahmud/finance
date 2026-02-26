<template>
  <q-layout view="hHh lpR fFf">
    <!-- Global Header -->
    <q-header class="bg-white text-dark" bordered style="border-bottom: 1px solid #d4d4d4;">
      <q-toolbar style="min-height: 56px;">
        <!-- Left: Logo + Name -->
        <div class="row items-center q-gutter-sm cursor-pointer" @click="$router.push('/')">
          <q-icon name="account_balance_wallet" size="28px" color="dark" />
          <span class="text-weight-bold" style="font-size: 1.1rem; letter-spacing: -0.02em;">ফাইন্যান্স ম্যানেজার</span>
        </div>

        <q-space />

        <!-- Right: User Avatar -->
        <q-avatar color="dark" text-color="white" size="36px" class="cursor-pointer">
          <q-icon name="person" size="20px" />
          <q-menu>
            <q-list style="min-width: 180px">
              <q-item>
                <q-item-section>
                  <div class="text-caption text-grey">{{ authStore.user?.email }}</div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="onLogout">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section class="text-negative">লগআউট</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Floating Action Button -->
    <q-btn v-if="showFab" class="finance-fab shadow-4" icon="add" color="dark" text-color="white" round size="lg"
      style="position: fixed; right: 16px; z-index: 100" @click="quickAddOpen = true" />

    <!-- Quick Add Dialog / Bottom Sheet -->
    <q-dialog v-model="quickAddOpen" position="bottom" transition-show="slide-up" transition-hide="slide-down">
      <q-card
        style="border-top-left-radius: 28px; border-top-right-radius: 28px; width: 100%; max-width: 500px; padding: 12px 16px 32px; background: white;">
        <!-- Header -->
        <q-card-section class="row items-center justify-between no-wrap q-pb-md">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">Quick Add</div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>

        <!-- Grid -->
        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-sm">
            <div class="col-4" v-for="(action, index) in quickAddActions" :key="index">
              <div class="cursor-pointer text-center flex flex-center column"
                :style="{ background: action.bgColor, borderRadius: '16px', padding: '20px 8px', transition: 'background-color 0.2s', height: '100px' }"
                v-ripple @click="navigateTo(action.route)">
                <q-icon :name="action.icon" size="28px" :style="{ color: action.color }" class="q-mb-sm" />
                <div class="text-caption text-weight-medium"
                  style="color: #334155; font-size: 0.8rem; line-height: 1.1;">{{ action.label }}</div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Bottom Navigation -->
    <q-footer v-if="showBottomNav" class="bg-white text-grey-8 finance-bottom-nav" bordered>
      <q-tabs v-model="currentTab" dense active-color="dark" indicator-color="dark" class="text-grey-6"
        narrow-indicator>
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
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/authStore'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const currentTab = ref('home')
const quickAddOpen = ref(false)

const noFabPages = ['/splash', '/add-income', '/add-expense', '/transfer', '/search', '/categories']
const noBottomNavPages = ['/splash']

const showFab = computed(() => !noFabPages.includes(route.path))
const showBottomNav = computed(() => !noBottomNavPages.includes(route.path))

const quickAddActions = [
  { label: 'Income', icon: 'trending_up', color: '#22c55e', bgColor: '#f0fdf4', route: '/add-income' },
  { label: 'Expense', icon: 'trending_down', color: '#ef4444', bgColor: '#fef2f2', route: '/add-expense' },
  { label: 'Transfer', icon: 'sync_alt', color: '#3b82f6', bgColor: '#eff6ff', route: '/transfer' },
  { label: 'Market List', icon: 'shopping_cart', color: '#22c55e', bgColor: '#f0fdf4', route: '/market-lists' },
  { label: 'Note', icon: 'description', color: '#0f172a', bgColor: '#fffbeb', route: '/notes' }
]

function navigateTo(path) {
  quickAddOpen.value = false
  router.push(path)
}

async function onLogout() {
  const result = await authStore.logout()
  if (result.success) {
    $q.notify({ type: 'positive', icon: 'check_circle', message: 'লগআউট সফল হয়েছে', position: 'top' })
    router.push('/login')
  }
}
</script>
