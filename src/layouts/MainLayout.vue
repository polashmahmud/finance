<template>
  <q-layout view="hHh lpR fFf">
    <!-- Global Header -->
    <q-header class="premium-header text-dark" style="min-height: 56px;">
      <q-toolbar style="min-height: 56px;">
        <!-- Hamburger toggle (tablet/desktop only) -->
        <q-btn v-if="$q.screen.gt.xs" flat round dense icon="menu" color="dark" class="q-mr-sm"
          @click="drawerOpen = !drawerOpen" />

        <!-- Left: Logo + Name -->
        <div class="row items-center q-gutter-sm cursor-pointer" @click="$router.push('/dashboard')">
          <div class="header-logo-wrap">
            <q-icon name="account_balance_wallet" size="18px" style="color: var(--text-primary);" />
          </div>
          <span class="header-brand-text">{{ $t('layout.financeManager') }}</span>
        </div>

        <q-space />

        <!-- Quick Add Button (desktop/tablet header) -->
        <q-btn v-if="$q.screen.gt.xs && showFab" unelevated icon="add" :label="$t('nav.quickAdd')"
          class="quick-add-btn q-mr-sm" rounded size="sm" @click="quickAddOpen = true" />

        <!-- Right: User Avatar -->
        <q-avatar color="dark" text-color="white" size="36px" class="cursor-pointer profile-avatar" @click="onAvatarClick">
          <img v-if="authStore.userProfile?.avatar" :src="authStore.userProfile.avatar" style="object-fit: cover;" />
          <q-icon v-else name="person" size="20px" />

          <!-- Desktop Dropdown Menu -->
          <q-menu v-if="$q.screen.gt.xs" anchor="bottom right" self="top right" :offset="[0, 8]"
            style="border-radius: 10px; min-width: 260px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.15); max-height: calc(100vh - 80px); display: flex; flex-direction: column;">
            <div class="profile-menu-header">
              <div class="row items-center no-wrap" style="gap: 12px;">
                <q-avatar size="48px" style="border: 2px solid rgba(255,255,255,0.25); flex-shrink: 0;">
                  <img v-if="authStore.userProfile?.avatar" :src="authStore.userProfile.avatar" style="object-fit: cover;" />
                  <q-icon v-else name="person" size="26px" color="white" />
                </q-avatar>
                <div style="overflow: hidden;">
                  <div class="text-white text-weight-bold ellipsis" style="font-size: 0.95rem; line-height: 1.3;">{{ authStore.userProfile?.name || authStore.user?.email?.split('@')[0] }}</div>
                  <div class="ellipsis" style="color: rgba(255,255,255,0.55); font-size: 0.76rem; margin-top: 1px;">{{ authStore.user?.email }}</div>
                </div>
              </div>
            </div>

            <q-list style="padding: 8px 0 4px; overflow-y: auto; flex: 1;">
              <div class="menu-section-label">Navigation</div>
              <q-item clickable v-close-popup @click="$router.push('/dashboard')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="home" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('nav.home') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/accounts')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="account_balance_wallet" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('nav.accounts') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/reports')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="bar_chart" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('nav.reports') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/all-transactions')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="receipt_long" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('nav.allTransactions') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/search')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="search" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('nav.search') }}</q-item-section>
              </q-item>

              <q-separator class="q-my-xs" />

              <div class="menu-section-label">Tools</div>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/market-lists')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="shopping_cart" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('nav.lists') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/notes')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="description" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('nav.note') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/loans')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="account_balance" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('nav.loans') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/occasion-goals')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="savings" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('occasionGoals.nav') }}</q-item-section>
              </q-item>

              <q-separator class="q-my-xs" />

              <div class="menu-section-label">Preferences</div>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/categories')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="category" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('nav.categories') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/settings')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="settings" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('nav.settings') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$router.push('/dashboard/help')" class="profile-menu-item">
                <q-item-section avatar><q-icon name="help_outline" size="20px" color="grey-8" /></q-item-section>
                <q-item-section>{{ $t('help.title') }}</q-item-section>
              </q-item>

              <q-separator class="q-my-xs" />

              <q-item clickable v-close-popup @click="onLogout" class="profile-menu-item profile-menu-logout">
                <q-item-section avatar><q-icon name="logout" size="20px" color="negative" /></q-item-section>
                <q-item-section class="text-negative text-weight-medium">{{ $t('common.logout') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>

        <!-- Mobile Full-Screen Profile Panel -->
        <q-dialog v-model="profileMenuOpen" maximized transition-show="slide-right" transition-hide="slide-left">
          <q-card class="profile-panel-mobile">
            <div class="profile-panel-header">
              <q-btn icon="close" flat round dense color="white" class="profile-panel-close" @click="profileMenuOpen = false" />
              <div class="column items-center q-pt-lg q-pb-md">
                <q-avatar size="72px" style="border: 3px solid rgba(255,255,255,0.3); box-shadow: 0 4px 20px rgba(0,0,0,0.25);" class="q-mb-md">
                  <img v-if="authStore.userProfile?.avatar" :src="authStore.userProfile.avatar" style="object-fit: cover;" />
                  <q-icon v-else name="person" size="40px" color="white" />
                </q-avatar>
                <div class="text-white text-weight-bold" style="font-size: 1.15rem; letter-spacing: -0.01em;">{{ authStore.userProfile?.name || authStore.user?.email?.split('@')[0] }}</div>
                <div style="color: rgba(255,255,255,0.6); font-size: 0.82rem; margin-top: 4px;">{{ authStore.user?.email }}</div>
              </div>
            </div>

            <div class="profile-panel-body">
              <div class="panel-group-label">{{ $t('nav.home') === 'Home' ? 'Navigation' : 'নেভিগেশন' }}</div>
              <div class="panel-nav-grid">
                <div class="panel-nav-item" v-ripple @click="profileMenuNav('/dashboard')">
                  <div class="panel-nav-icon" style="background: rgba(22,22,26,0.06);"><q-icon name="home" size="22px" style="color:#16161a" /></div>
                  <span>{{ $t('nav.home') }}</span>
                </div>
                <div class="panel-nav-item" v-ripple @click="profileMenuNav('/dashboard/accounts')">
                  <div class="panel-nav-icon" style="background: #e8f1ec;"><q-icon name="account_balance_wallet" size="22px" style="color:#2f7d5c" /></div>
                  <span>{{ $t('nav.accounts') }}</span>
                </div>
                <div class="panel-nav-item" v-ripple @click="profileMenuNav('/dashboard/reports')">
                  <div class="panel-nav-icon" style="background: #eef0f9;"><q-icon name="bar_chart" size="22px" style="color:#3f4a7a" /></div>
                  <span>{{ $t('nav.reports') }}</span>
                </div>
                <div class="panel-nav-item" v-ripple @click="profileMenuNav('/dashboard/all-transactions')">
                  <div class="panel-nav-icon" style="background: rgba(22,22,26,0.06);"><q-icon name="receipt_long" size="22px" style="color:#3a3a40" /></div>
                  <span>{{ $t('nav.allTransactions') }}</span>
                </div>
                <div class="panel-nav-item" v-ripple @click="profileMenuNav('/dashboard/search')">
                  <div class="panel-nav-icon" style="background: rgba(22,22,26,0.04);"><q-icon name="search" size="22px" style="color:#7c7a73" /></div>
                  <span>{{ $t('nav.search') }}</span>
                </div>
              </div>

              <div class="panel-group-label q-mt-md">Tools</div>
              <div class="panel-nav-grid">
                <div class="panel-nav-item" v-ripple @click="profileMenuNav('/dashboard/market-lists')">
                  <div class="panel-nav-icon" style="background: #eef0f9;"><q-icon name="shopping_cart" size="22px" style="color:#3f4a7a" /></div>
                  <span>{{ $t('nav.lists') }}</span>
                </div>
                <div class="panel-nav-item" v-ripple @click="profileMenuNav('/dashboard/notes')">
                  <div class="panel-nav-icon" style="background: #f5eef8;"><q-icon name="description" size="22px" style="color:#7a3c8a" /></div>
                  <span>{{ $t('nav.note') }}</span>
                </div>
                <div class="panel-nav-item" v-ripple @click="profileMenuNav('/dashboard/loans')">
                  <div class="panel-nav-icon" style="background: rgba(22,22,26,0.06);"><q-icon name="account_balance" size="22px" style="color:#5e5b54" /></div>
                  <span>{{ $t('nav.loans') }}</span>
                </div>
                <div class="panel-nav-item" v-ripple @click="profileMenuNav('/dashboard/occasion-goals')">
                  <div class="panel-nav-icon" style="background: #fef3c7;"><q-icon name="savings" size="22px" style="color:#d97706" /></div>
                  <span>{{ $t('occasionGoals.nav') }}</span>
                </div>
              </div>

              <div class="panel-group-label q-mt-md">Preferences</div>
              <q-list style="border-radius: 8px; overflow: hidden; background: white; border: 1px solid #e9e5dc;">
                <q-item clickable v-ripple @click="profileMenuNav('/dashboard/categories')" style="min-height: 52px;">
                  <q-item-section avatar><div class="panel-list-icon" style="background:rgba(22,22,26,0.06)"><q-icon name="category" size="18px" style="color:#16161a" /></div></q-item-section>
                  <q-item-section class="text-weight-medium" style="font-size: 0.9rem;">{{ $t('nav.categories') }}</q-item-section>
                  <q-item-section side><q-icon name="chevron_right" style="color:#b8b5ac" /></q-item-section>
                </q-item>
                <q-separator inset />
                <q-item clickable v-ripple @click="profileMenuNav('/dashboard/settings')" style="min-height: 52px;">
                  <q-item-section avatar><div class="panel-list-icon" style="background:rgba(22,22,26,0.06)"><q-icon name="settings" size="18px" style="color:#3a3a40" /></div></q-item-section>
                  <q-item-section class="text-weight-medium" style="font-size: 0.9rem;">{{ $t('nav.settings') }}</q-item-section>
                  <q-item-section side><q-icon name="chevron_right" style="color:#b8b5ac" /></q-item-section>
                </q-item>
                <q-separator inset />
                <q-item clickable v-ripple @click="profileMenuNav('/dashboard/help')" style="min-height: 52px;">
                  <q-item-section avatar><div class="panel-list-icon" style="background:rgba(22,22,26,0.06)"><q-icon name="help_outline" size="18px" style="color:#3a3a40" /></div></q-item-section>
                  <q-item-section class="text-weight-medium" style="font-size: 0.9rem;">{{ $t('help.title') }}</q-item-section>
                  <q-item-section side><q-icon name="chevron_right" style="color:#b8b5ac" /></q-item-section>
                </q-item>
              </q-list>

              <q-btn unelevated class="full-width q-mt-lg profile-logout-btn" @click="onLogoutMobile">
                <q-icon name="logout" size="18px" class="q-mr-sm" />
                {{ $t('common.logout') }}
              </q-btn>
            </div>
          </q-card>
        </q-dialog>
      </q-toolbar>
    </q-header>

    <!-- Left Sidebar Drawer (tablet & desktop) — dark navy premium -->
    <q-drawer v-model="drawerOpen" show-if-above :width="240" :breakpoint="600"
      class="sidebar-drawer">
      <!-- Brand section -->
      <div class="sidebar-brand">
        <div class="sidebar-brand-logo">
          <q-icon name="account_balance_wallet" size="18px" style="color: rgba(255,255,255,0.75);" />
        </div>
        <span class="sidebar-brand-text">{{ $t('layout.financeManager') }}</span>
      </div>

      <!-- Scrollable nav -->
      <q-scroll-area style="height: calc(100% - 70px);">
        <q-list style="padding: 8px 0;">

          <!-- Group 1: Main -->
          <q-item clickable v-ripple to="/dashboard" exact active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="home" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('nav.home') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/accounts" active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="account_balance_wallet" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('nav.accounts') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/reports" active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="bar_chart" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('nav.reports') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/market-lists" active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="shopping_cart" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('nav.lists') }}</q-item-section>
          </q-item>

          <div class="sidebar-sep"></div>

          <!-- Group 2: Finance -->
          <q-item clickable v-ripple to="/dashboard/all-transactions" active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="receipt_long" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('nav.allTransactions') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/search" active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="search" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('nav.search') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/notes" active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="description" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('nav.note') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/loans" active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="account_balance" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('nav.loans') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/occasion-goals" active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="savings" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('occasionGoals.nav') }}</q-item-section>
          </q-item>

          <div class="sidebar-sep"></div>

          <!-- Group 3: Settings -->
          <q-item clickable v-ripple to="/dashboard/categories" active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="category" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('nav.categories') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/settings" active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="settings" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('nav.settings') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dashboard/help" active-class="sidebar-item-active" class="sidebar-nav-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="help_outline" size="17px" style="color: rgba(255,255,255,0.55);" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label">{{ $t('help.title') }}</q-item-section>
          </q-item>

          <div class="sidebar-sep"></div>

          <q-item clickable v-ripple @click="onLogout" class="sidebar-nav-item sidebar-logout-item">
            <q-item-section avatar style="min-width: 40px;">
              <div class="sidebar-icon-wrap">
                <q-icon name="logout" size="17px" style="color: #b14437;" />
              </div>
            </q-item-section>
            <q-item-section class="sidebar-nav-label" style="color: #b14437 !important;">{{ $t('common.logout') }}</q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-pull-to-refresh @refresh="onRefresh" color="dark" spinner-size="42px">
        <router-view />
      </q-pull-to-refresh>
    </q-page-container>

    <!-- Floating Action Button (mobile only) -->
    <q-btn v-if="showFab && $q.screen.lt.md" class="finance-fab" icon="add" text-color="white"
      round size="lg" unelevated style="position: fixed; right: 16px; bottom: 72px; z-index: 100" @click="quickAddOpen = true" />

    <!-- Quick Add Dialog -->
    <q-dialog v-model="quickAddOpen">
      <q-card class="quick-add-dialog">
        <!-- Header -->
        <q-card-section class="row items-center justify-between no-wrap q-pb-sm">
          <div class="quick-add-title">{{ $t('nav.quickAdd') }}</div>
          <q-btn icon="close" flat round dense v-close-popup class="quick-add-close-btn" />
        </q-card-section>

        <!-- Grid -->
        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-sm">
            <div class="col-4" v-for="(action, index) in quickAddActions" :key="index">
              <div class="quick-add-action-item cursor-pointer" :style="{ background: action.bgColor }"
                v-ripple @click="navigateTo(action.route)">
                <div class="quick-add-icon-wrap" :style="{ background: action.iconBg }">
                  <q-icon :name="action.icon" size="22px" :style="{ color: action.color }" />
                </div>
                <div class="quick-add-action-label">{{ action.label }}</div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Bottom Navigation (mobile only) -->
    <q-footer v-if="showBottomNav && $q.screen.lt.sm" class="bg-white text-grey-8 finance-bottom-nav" bordered>
      <q-tabs v-model="currentTab" active-color="dark" indicator-color="dark" class="text-grey-5"
        narrow-indicator>
        <q-route-tab name="home" icon="home" :label="$t('nav.home')" to="/dashboard" exact />
        <q-route-tab name="accounts" icon="account_balance_wallet" :label="$t('nav.accounts')"
          to="/dashboard/accounts" />
        <q-route-tab name="reports" icon="bar_chart" :label="$t('nav.reports')" to="/dashboard/reports" />
        <q-route-tab name="lists" icon="shopping_cart" :label="$t('nav.lists')" to="/dashboard/market-lists" />
      </q-tabs>
    </q-footer>
  </q-layout>

  <!-- Offline Banner -->
  <transition name="offline-slide">
    <div v-if="!isOnline" class="offline-banner">
      <q-icon name="wifi_off" size="16px" class="q-mr-xs" />
      <span>{{ $t('common.offline') }}</span>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/authStore'
import { useSettingsStore } from 'stores/settingsStore'
import { useAccountStore } from 'stores/accountStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const settings = useSettingsStore()
const accountStore = useAccountStore()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

const currentTab = ref('home')
const quickAddOpen = ref(false)
const drawerOpen = ref(false)
const profileMenuOpen = ref(false)

function onAvatarClick() {
  if ($q.screen.lt.sm) {
    profileMenuOpen.value = true
  }
}

function profileMenuNav(path) {
  profileMenuOpen.value = false
  router.push(path)
}

async function onLogoutMobile() {
  profileMenuOpen.value = false
  await onLogout()
}

const isOnline = ref(navigator.onLine)

function handleOnline() { isOnline.value = true }
function handleOffline() { isOnline.value = false }

async function onRefresh(done) {
  try {
    await Promise.all([
      accountStore.fetchAccounts(),
      transactionStore.fetchTransactions(),
      categoryStore.fetchCategories()
    ])
    $q.notify({
      type: 'positive',
      icon: 'refresh',
      message: t('common.refreshComplete'),
      position: 'top',
      timeout: 1500
    })
  } catch (error) {
    console.error('Refresh error:', error)
    $q.notify({
      type: 'negative',
      icon: 'error_outline',
      message: t('common.refreshFailed'),
      position: 'top'
    })
  } finally {
    if (done) done()
  }
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})
onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

const noFabPages = ['/splash', '/dashboard/add-income', '/dashboard/add-expense', '/dashboard/transfer', '/dashboard/search', '/dashboard/categories', '/dashboard/all-transactions']
const noBottomNavPages = ['/splash']

const showFab = computed(() => !noFabPages.includes(route.path) && !route.path.startsWith('/dashboard/account/') && !route.path.startsWith('/dashboard/category/'))
const showBottomNav = computed(() => !noBottomNavPages.includes(route.path))

const quickAddActions = computed(() => [
  { label: t('common.income'), icon: 'trending_up', color: '#2f7d5c', bgColor: '#e8f1ec', iconBg: 'rgba(47,125,92,0.15)', route: '/dashboard/add-income' },
  { label: t('common.expense'), icon: 'trending_down', color: '#b14437', bgColor: '#fbeae6', iconBg: 'rgba(177,68,55,0.15)', route: '/dashboard/add-expense' },
  { label: t('common.transfer'), icon: 'sync_alt', color: '#2a6695', bgColor: '#e8f2f9', iconBg: 'rgba(42,102,149,0.15)', route: '/dashboard/transfer' },
  { label: t('nav.marketList'), icon: 'shopping_cart', color: '#3f4a7a', bgColor: '#eef0f9', iconBg: 'rgba(63,74,122,0.15)', route: '/dashboard/market-lists' },
  { label: t('nav.note'), icon: 'description', color: '#7a3c8a', bgColor: '#f5eef8', iconBg: 'rgba(122,60,138,0.15)', route: '/dashboard/notes' },
  { label: t('nav.loans'), icon: 'account_balance', color: '#5e5b54', bgColor: '#f5f3ef', iconBg: 'rgba(94,91,84,0.15)', route: '/dashboard/loans' }
])

function navigateTo(path) {
  quickAddOpen.value = false
  router.push(path)
}

async function onLogout() {
  if (settings.appLock) {
    settings.lock()
    $q.notify({ type: 'info', icon: 'lock', message: t('common.screenLocked'), position: 'top' })
    router.push('/splash')
  } else {
    const result = await authStore.logout()
    if (result.success) {
      $q.notify({ type: 'positive', icon: 'check_circle', message: t('common.logoutSuccess'), position: 'top' })
      router.push('/login')
    }
  }
}
</script>

<style scoped>
/* ===== Header logo ===== */
.header-logo-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(22, 22, 26, 0.06);
  border: 1px solid rgba(22, 22, 26, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-brand-text {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

/* ===== Offline Banner ===== */
.offline-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f59e0b;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 7px 16px;
  letter-spacing: 0.01em;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 599px) {
  .offline-banner {
    bottom: 50px;
  }
}

.offline-slide-enter-active,
.offline-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.offline-slide-enter-from,
.offline-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* ===== Profile Avatar ===== */
.profile-avatar {
  transition: opacity 0.15s ease;
}
.profile-avatar:active {
  opacity: 0.75;
}

/* ===== Desktop Dropdown Menu ===== */
.profile-menu-header {
  background: #16161a;
  padding: 18px 16px 16px;
}

.menu-section-label {
  padding: 6px 16px 2px;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #7c7a73;
}

.profile-menu-item {
  min-height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  margin: 0 6px;
  transition: background 0.15s;
}
.profile-menu-item:hover {
  background: #fafaf7;
}
.profile-menu-logout:hover {
  background: #fbeae6 !important;
}

/* ===== Mobile Profile Panel ===== */
.profile-panel-mobile {
  width: 100%;
  height: 100%;
  max-width: 100%;
  border-radius: 0;
  overflow-y: auto;
  background: #fafaf7;
  display: flex;
  flex-direction: column;
}

.profile-panel-header {
  background: #16161a;
  padding: 16px 20px 28px;
  position: relative;
  flex-shrink: 0;
}

.profile-panel-close {
  position: absolute;
  top: 12px;
  right: 12px;
}

.profile-panel-body {
  padding: 20px 16px 40px;
  flex: 1;
}

.panel-group-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: #94a3b8;
  margin-bottom: 10px;
}

.panel-nav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.panel-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 8px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e9e5dc;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  color: #16161a;
  text-align: center;
  line-height: 1.2;
  transition: background 0.15s, transform 0.1s;
  position: relative;
  overflow: hidden;
}

.panel-nav-item:active {
  transform: scale(0.97);
  background: #f5f1e8;
}

.panel-nav-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-list-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-logout-btn {
  background: transparent;
  color: #b14437;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 14px;
  border: 1px solid #e9e5dc;
  transition: background 0.15s;
}
.profile-logout-btn:hover {
  background: #fbeae6;
}

/* ===== Bottom Navigation ===== */
.finance-bottom-nav {
  height: 60px;
  box-shadow: 0 -1px 8px rgba(22, 22, 26, 0.08);
}

.finance-bottom-nav .q-tabs {
  height: 60px;
}

.finance-bottom-nav .q-tab {
  padding: 4px 0;
  min-height: 60px;
}

.finance-bottom-nav .q-tab__label {
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 2px;
  line-height: 1.2;
}

/* ===== Sidebar nav item overrides ===== */
.sidebar-nav-item {
  border-radius: 8px !important;
  margin: 1px 8px !important;
  min-height: 42px !important;
  color: rgba(255, 255, 255, 0.48) !important;
  font-size: 0.875rem;
  transition: background 0.15s ease, color 0.15s ease !important;
}

.sidebar-nav-item:hover {
  background: rgba(255, 255, 255, 0.07) !important;
  color: rgba(255, 255, 255, 0.88) !important;
}

.sidebar-logout-item:hover {
  background: rgba(177, 68, 55, 0.10) !important;
}

/* ===== Quick Add Dialog ===== */
.quick-add-dialog {
  border-radius: 10px !important;
  width: 100%;
  max-width: 480px;
  padding: 8px 12px 24px;
  background: #fafaf7;
  box-shadow: 0 24px 64px rgba(22, 22, 26, 0.18) !important;
}

.quick-add-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #16161a;
  letter-spacing: -0.02em;
  padding-left: 4px;
}

.quick-add-close-btn {
  background: #f5f1e8;
  color: #7c7a73;
  border-radius: 50%;
}

.quick-add-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 10px;
  padding: 18px 8px 16px;
  height: 106px;
  border: 1px solid #e9e5dc;
  background: white;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  position: relative;
  overflow: hidden;
}

.quick-add-action-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(22, 22, 26, 0.08);
}

.quick-add-action-item:active {
  transform: scale(0.97);
}

.quick-add-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-add-action-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #16161a;
  text-align: center;
  line-height: 1.2;
}
</style>
