<template>
  <q-page class="dashboard-page">
    <div class="row q-col-gutter-lg">

      <!-- LEFT COLUMN -->
      <div class="col-12 col-md-7">

        <!-- Greeting -->
        <div class="greeting-header q-mb-lg q-mt-xs">
          <div class="col">
            <div class="greeting-name">
              {{ $t('dashboard.hello') }}, {{ userName }}!
            </div>
            <div class="greeting-sub">{{ greeting }}</div>
          </div>
          <div class="greeting-icon-wrap">
            <img :src="greetingIcon.src" :alt="greetingIcon.alt"
              style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />
          </div>
        </div>

        <!-- Total Balance Card -->
        <q-card class="balance-overview-card q-mb-lg cursor-pointer" @click="$router.push('/dashboard/accounts')"
          v-ripple>
          <q-card-section class="balance-card-inner">
            <div class="balance-texture"></div>
            <div class="row items-start justify-between no-wrap" style="position: relative; z-index: 1;">
              <div class="col">
                <div class="balance-label">{{ $t('dashboard.totalBalance') }}</div>
                <div class="balance-amount">{{ settings.currency }}{{ settings.formatNumber(accounts.totalBalance) }}
                </div>
                <div class="balance-meta">
                  {{ $t('dashboard.accounts') }} · {{ new Date().toLocaleDateString(undefined, { month: 'long' }) }}
                </div>
              </div>
              <div class="balance-eye-btn">
                <q-icon name="visibility" size="16px" color="white" style="opacity: 0.7;" />
              </div>
            </div>
            <div class="balance-stats" style="position: relative; z-index: 1;">
              <div class="balance-stat-item">
                <div class="balance-stat-label">
                  <q-icon name="arrow_upward" size="11px" style="color: rgba(120,220,170,0.95);" />
                  {{ $t('common.income') }}
                </div>
                <div class="balance-stat-value" style="color: rgba(120,220,170,0.95);">
                  {{ settings.currency }}{{ formatShort(transactions.totalIncome) }}
                </div>
              </div>
              <div class="balance-stat-item">
                <div class="balance-stat-label">
                  <q-icon name="arrow_downward" size="11px" style="color: rgba(255,160,140,0.95);" />
                  {{ $t('common.expense') }}
                </div>
                <div class="balance-stat-value" style="color: rgba(255,160,140,0.95);">
                  {{ settings.currency }}{{ formatShort(transactions.totalExpense) }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Recent Transactions (desktop: in left col) -->
        <template v-if="$q.screen.gt.sm">
          <div class="dash-section-header row items-center justify-between q-mb-sm">
            <div class="dash-section-title">{{ $t('dashboard.recentTransactions') }}</div>
            <q-btn flat dense no-caps color="dark" :label="$t('allTransactions.viewAll')" icon-right="chevron_right"
              @click="$router.push('/dashboard/all-transactions')" size="sm" />
          </div>
          <q-card class="finance-card tx-card" style="overflow: hidden;">
            <q-list separator>
              <q-slide-item v-for="tx in transactions.recentTransactions" :key="tx.id"
                @left="({ reset }) => onEditTx(tx, reset)" @right="({ reset }) => onDeleteTx(tx, reset)">
                <template v-slot:left>
                  <div class="row items-center"><q-icon name="edit" color="info" /></div>
                </template>
                <template v-slot:right>
                  <div class="row items-center"><q-icon name="delete" color="negative" /></div>
                </template>
                <q-item class="touch-target">
                  <q-item-section avatar>
                    <q-avatar :style="{ background: getCategoryColor(tx.category) + '20' }" size="40px">
                      <q-icon :name="getCategoryIcon(tx.category)" :style="{ color: getCategoryColor(tx.category) }"
                        size="20px" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ tx.category }}</q-item-label>
                    <q-item-label caption>{{ tx.notes }} &middot; {{ settings.formatDate(tx.date) }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label :class="tx.type === 'income' ? 'amount-income' : 'amount-expense'"
                      class="transaction-amount">
                      {{ tx.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{ settings.formatNumber(tx.amount)
                      }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-slide-item>
            </q-list>
            <q-card-section v-if="!transactions.recentTransactions.length" class="text-center text-grey q-pa-lg">
              <q-icon name="receipt_long" size="40px" class="q-mb-sm" />
              <div>{{ $t('dashboard.noTransactionsYet') }}</div>
            </q-card-section>
          </q-card>
          <div class="text-center q-pa-md text-grey-6" style="font-size: 12px;"
            v-if="transactions.recentTransactions.length">
            <q-icon name="swipe" size="16px" class="q-mr-xs" />
            {{ $t('categories.swipeHint') }}
          </div>
        </template>

      </div>

      <!-- RIGHT COLUMN -->
      <div class="col-12 col-md-5">

        <!-- Accounts -->
        <div class="dash-section-header row items-center justify-between q-mb-sm">
          <div class="dash-section-title">{{ $t('dashboard.accounts') }}</div>
        </div>
        <div class="accounts-scroll-row q-mb-md">
          <q-card v-for="account in accounts.accounts" :key="account.id"
            class="finance-card account-card cursor-pointer"
            @click="$router.push('/dashboard/account/' + account.id + '/transactions')" v-ripple>
            <q-card-section class="account-card-inner">
              <div class="row items-center justify-between no-wrap q-mb-sm">
                <q-avatar :style="{ background: (account.color || '#757575') + '18' }" size="38px">
                  <q-icon :name="account.icon" :style="{ color: account.color || '#757575' }" size="19px" />
                </q-avatar>
                <div class="account-type-chip" :style="{ color: account.color || '#757575', background: (account.color || '#757575') + '14' }">
                  {{ account.type === 'Cash' ? $t('dashboard.cash') : account.type === 'Bank' ? $t('dashboard.bank') : $t('dashboard.mobile') }}
                </div>
              </div>
              <div class="account-card-name">{{ account.name }}</div>
              <div class="account-card-balance" :style="{ color: account.color || 'var(--text-primary)' }">
                {{ settings.currency }}{{ settings.formatNumber(account.balance) }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Loan Summary -->
        <div class="dash-section-header row items-center justify-between q-mb-sm">
          <div class="dash-section-title">{{ $t('nav.loans') }}</div>
          <q-btn flat dense no-caps color="dark" :label="$t('allTransactions.viewAll')" icon-right="chevron_right"
            @click="$router.push('/dashboard/loans')" size="sm" />
        </div>
        <div class="loan-cards-row q-mb-md">
          <!-- পাওনা -->
          <q-card class="finance-card loan-dash-card cursor-pointer" @click="$router.push('/dashboard/loans')" v-ripple>
            <q-card-section class="loan-card-inner">
              <q-avatar style="background: rgba(47,125,92,0.12);" size="34px" class="q-mb-sm">
                <q-icon name="arrow_downward" style="color:#2f7d5c;" size="16px" />
              </q-avatar>
              <div class="loan-card-label">{{ $t('loans.receivable') }}</div>
              <div class="loan-card-amount" style="color:#2f7d5c;">
                {{ settings.currency }}{{ formatShort(loans.totalReceivable) }}
              </div>
            </q-card-section>
          </q-card>

          <!-- দেনা -->
          <q-card class="finance-card loan-dash-card cursor-pointer" @click="$router.push('/dashboard/loans')" v-ripple>
            <q-card-section class="loan-card-inner">
              <q-avatar style="background: rgba(177,68,55,0.1);" size="34px" class="q-mb-sm">
                <q-icon name="arrow_upward" style="color:#b14437;" size="16px" />
              </q-avatar>
              <div class="loan-card-label">{{ $t('loans.payable') }}</div>
              <div class="loan-card-amount" style="color:#b14437;">
                {{ settings.currency }}{{ formatShort(loans.totalPayable) }}
              </div>
            </q-card-section>
          </q-card>

          <!-- মোট লোন -->
          <q-card class="finance-card loan-dash-card cursor-pointer" @click="$router.push('/dashboard/loans')" v-ripple>
            <q-card-section class="loan-card-inner">
              <q-avatar style="background: rgba(177,106,38,0.12);" size="34px" class="q-mb-sm">
                <q-icon name="account_balance" style="color:#b16a26;" size="16px" />
              </q-avatar>
              <div class="loan-card-label">{{ $t('loans.loan') }}</div>
              <div class="loan-card-amount" style="color:#b16a26;">
                {{ settings.currency }}{{ formatShort(loans.totalLoanAmount) }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- This month due -->
        <div v-if="loans.thisMonthDue > 0" class="loan-due-section q-mb-md">
          <div class="loan-due-header row items-center q-gutter-xs q-mb-xs">
            <q-icon name="event" size="16px" color="orange" />
            <span style="font-weight:600; font-size:0.8rem; color:#16161a;">{{ $t('loans.thisMonthDue') }}</span>
            <span style="font-weight:500; color:#7c7a73; font-size:0.7rem;"> &middot; {{ settings.currency }}{{ formatShort(loans.thisMonthDue) }}</span>
          </div>
          <q-card class="finance-card" style="overflow:hidden;">
            <q-list dense separator>
              <q-item v-for="(item, idx) in loans.thisMonthDueList" :key="idx" class="q-py-xs" clickable @click="$router.push('/dashboard/loans')">
                <q-item-section avatar style="min-width:32px;">
                  <q-avatar style="background:#fff8e1;" size="28px">
                    <q-icon name="receipt" style="color:#f59e0b;" size="14px" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label style="font-size:0.76rem; font-weight:600; color:#16161a;">{{ item.personName }}</q-item-label>
                  <q-item-label caption style="font-size:0.65rem;">{{ $t('loans.installment') }} #{{ item.installmentNumber }} &middot; {{ settings.formatDate(item.dueDate) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <span style="font-size:0.78rem; font-weight:700; color:#f59e0b;">{{ settings.currency }}{{ settings.formatNumber(item.amount) }}</span>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <!-- Occasion Goals -->
        <div class="dash-section-header row items-center justify-between q-mb-sm">
          <div class="dash-section-title">{{ $t('occasionGoals.nav') }}</div>
          <q-btn flat dense no-caps color="dark" :label="$t('allTransactions.viewAll')" icon-right="chevron_right"
            @click="$router.push('/dashboard/occasion-goals')" size="sm" />
        </div>

        <!-- Active goals -->
        <div v-if="goalStore.activeGoals.length" class="goal-cards-row q-mb-md">
          <q-card v-for="goal in goalStore.activeGoals.slice(0, 5)" :key="goal.id"
            class="finance-card goal-dash-card cursor-pointer" @click="$router.push('/dashboard/occasion-goals')" v-ripple>
            <q-card-section class="goal-card-inner">
              <div class="row items-center justify-between no-wrap q-mb-xs">
                <div class="goal-card-name ellipsis">{{ goal.name }}</div>
                <div class="goal-badge" :class="goalProgress(goal) >= 100 ? 'goal-badge-done' : 'goal-badge-active'">
                  {{ goalProgress(goal) }}%
                </div>
              </div>
              <q-linear-progress
                :value="goalProgress(goal) / 100"
                :color="goalProgress(goal) >= 100 ? 'positive' : 'amber-8'"
                track-color="grey-3"
                rounded
                style="height: 5px; border-radius: 4px;"
                class="q-mb-sm"
              />
              <div class="row items-center justify-between">
                <div class="goal-card-saved">
                  {{ settings.currency }}{{ formatShort(goal.currentSaved) }}
                  <span class="goal-card-target"> / {{ settings.currency }}{{ formatShort(goal.targetAmount) }}</span>
                </div>
                <div v-if="goalDaysLeft(goal) !== null" class="goal-days-left">
                  {{ goalDaysLeft(goal) }}d
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- No goals promo -->
        <q-card v-else class="finance-card cursor-pointer q-mb-md" @click="$router.push('/dashboard/occasion-goals')" v-ripple>
          <q-card-section class="row items-center q-gutter-md q-pa-md">
            <q-avatar style="background: #fef3c7;" size="40px">
              <q-icon name="savings" style="color:#d97706;" size="22px" />
            </q-avatar>
            <div>
              <div style="font-size:0.85rem; font-weight:600; color:#16161a;">{{ $t('occasionGoals.noGoals') }}</div>
              <div style="font-size:0.75rem; color:#7c7a73;">{{ $t('occasionGoals.addPrompt') }}</div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Budget Status -->
        <div class="dash-section-header row items-center justify-between q-mb-sm">
          <div class="dash-section-title">{{ $t('dashboard.budgetStatus') }}</div>
          <div class="row items-center q-gutter-xs">
            <span class="text-caption" style="color: #7c7a73;">{{ $t('dashboard.quickEntry') }}</span>
            <q-toggle v-model="quickEntry" color="dark" dense @update:model-value="onQuickEntryChange" />
          </div>
        </div>
        <div class="budget-scroll-container q-mb-md">
          <div v-for="cat in categories.expenseCategories" :key="cat.id" class="budget-scroll-item">
            <q-card class="budget-fill-card finance-card cursor-pointer" @click="onBudgetCardClick(cat)">
              <!-- Fill overlay: rises from bottom based on spent percentage -->
              <div v-if="getCurrentMonthBudget(cat)" class="budget-fill-bg" :style="{
                background: getCategorySpent(cat.name) > getCurrentMonthBudget(cat) ? '#ef444430' : cat.color + '25',
                height: Math.min((getCategorySpent(cat.name) / getCurrentMonthBudget(cat)) * 100, 100) + '%'
              }"></div>
              <q-card-section class="column items-center q-pa-sm budget-fill-content">
                <q-avatar :style="{ background: cat.color + '18' }" size="40px" class="q-mb-xs">
                  <q-icon :name="cat.icon" :style="{ color: cat.color }" size="20px" />
                </q-avatar>
                <div class="text-center ellipsis full-width" style="font-size: 11px; font-weight: 600; color: #16161a;">
                  {{ cat.name }}
                </div>
                <div v-if="getCurrentMonthBudget(cat)" class="text-caption q-mt-xs"
                  style="font-size: 9px; color: #7c7a73;">
                  {{ settings.currency }}{{ formatShort(getCurrentMonthBudget(cat)) }}
                </div>
                <div v-else class="text-caption q-mt-xs text-center"
                  style="font-size: 9px; color: #b8b5ac; line-height: 1.2;">
                  {{ $t('dashboard.tapToSetBudget') }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Recent Transactions (mobile/tablet: at bottom of page) -->
        <template v-if="!$q.screen.gt.sm">
          <div class="dash-section-header row items-center justify-between q-mb-sm">
            <div class="dash-section-title">{{ $t('dashboard.recentTransactions') }}</div>
            <q-btn flat dense no-caps color="dark" :label="$t('allTransactions.viewAll')" icon-right="chevron_right"
              @click="$router.push('/dashboard/all-transactions')" size="sm" />
          </div>
          <q-card class="finance-card tx-card" style="overflow: hidden;">
            <q-list separator>
              <q-slide-item v-for="tx in transactions.recentTransactions" :key="tx.id"
                @left="({ reset }) => onEditTx(tx, reset)" @right="({ reset }) => onDeleteTx(tx, reset)">
                <template v-slot:left>
                  <div class="row items-center"><q-icon name="edit" color="info" /></div>
                </template>
                <template v-slot:right>
                  <div class="row items-center"><q-icon name="delete" color="negative" /></div>
                </template>
                <q-item class="touch-target">
                  <q-item-section avatar>
                    <q-avatar :style="{ background: getCategoryColor(tx.category) + '20' }" size="40px">
                      <q-icon :name="getCategoryIcon(tx.category)" :style="{ color: getCategoryColor(tx.category) }"
                        size="20px" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ tx.category }}</q-item-label>
                    <q-item-label caption>{{ tx.notes }} &middot; {{ settings.formatDate(tx.date) }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label :class="tx.type === 'income' ? 'amount-income' : 'amount-expense'"
                      class="transaction-amount">
                      {{ tx.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{ settings.formatNumber(tx.amount)
                      }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-slide-item>
            </q-list>
            <q-card-section v-if="!transactions.recentTransactions.length" class="text-center text-grey q-pa-lg">
              <q-icon name="receipt_long" size="40px" class="q-mb-sm" />
              <div>{{ $t('dashboard.noTransactionsYet') }}</div>
            </q-card-section>
          </q-card>
          <div class="text-center q-pa-md text-grey-6" style="font-size: 12px;"
            v-if="transactions.recentTransactions.length">
            <q-icon name="swipe" size="16px" class="q-mr-xs" />
            {{ $t('categories.swipeHint') }}
          </div>
        </template>

      </div>
    </div>

    <!-- Budget Modal -->
    <q-dialog v-model="budgetModalOpen">
      <q-card style="border-radius: 10px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: var(--text-primary);">
            {{ budgetModalCategory?.name }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: var(--card-cream); color: var(--text-muted);" />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveBudget" class="q-gutter-md">
            <!-- Month Selector -->
            <q-input v-model="budgetForm.month" :label="$t('common.month')" outlined dense color="dark" readonly>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="budgetMonthProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="budgetForm.month" emit-immediately minimal years-in-month-view
                      default-view="Months" mask="YYYY-MM" @update:model-value="onBudgetMonthSelect" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- Budget Amount -->
            <q-input v-model.number="budgetForm.amount" :label="$t('dashboard.budgetAmount')" outlined dense
              type="number" color="dark" :prefix="settings.currency" />

            <!-- Buttons -->
            <div class="row q-gutter-md">
              <q-btn type="button" :label="$t('dashboard.details')" class="col bg-grey-2 text-dark" unelevated size="md"
                @click="goToCategoryDetails" :loading="saving" />
              <q-btn type="submit" :label="$t('common.save')" class="col bg-primary-gradient text-white" unelevated
                size="md" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Quick Entry Modal -->
    <q-dialog v-model="quickEntryModalOpen">
      <q-card style="border-radius: 10px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: var(--text-primary);">
            {{ quickEntryCategory?.name }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: var(--card-cream); color: var(--text-muted);" />
        </q-card-section>

        <q-card-section class="q-px-lg">
          <q-form @submit.prevent="saveQuickEntry" class="q-gutter-md">
            <!-- Amount & Account (side by side) -->
            <div class="row q-col-gutter-md q-mb-sm">
              <div class="col-6">
                <q-input v-model.number="quickEntryForm.amount" :label="$t('common.amount')" type="number" outlined
                  color="dark" :prefix="settings.currency" :rules="[val => val > 0 || $t('common.validAmount')]"
                  autofocus input-class="text-h6 text-weight-bold" />
              </div>
              <div class="col-6">
                <q-select v-model="quickEntryForm.accountId" :options="accountOptions" :label="$t('common.account')"
                  outlined color="dark" emit-value map-options
                  :rules="[val => !!val || $t('common.accountRequired')]" />
              </div>
            </div>

            <!-- Note -->
            <div class="row q-col-gutter-md q-mb-sm">
              <div class="col-12">
                <q-input v-model="quickEntryForm.notes" :label="$t('common.noteOptional')" outlined color="dark"
                  type="textarea" rows="2" />
              </div>
            </div>

            <!-- Buttons -->
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-btn type="button" :label="$t('dashboard.details')" class="full-width bg-grey-2 text-dark" unelevated
                  size="md" @click="goToQuickEntryDetails" />
              </div>
              <div class="col-6">
                <q-btn type="submit" :label="$t('common.save')" class="full-width bg-primary-gradient text-white"
                  unelevated size="md" :loading="saving" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteConfirmOpen" persistent>
      <q-card style="border-radius: 10px; width: 100%; max-width: 420px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="row items-center q-gutter-sm">
            <q-avatar color="negative" text-color="white" icon="delete" size="36px" />
            <div class="text-h6 text-weight-bold" style="color: var(--text-primary);">{{ $t('dashboard.deleteTransactionTitle') }}
            </div>
          </div>
          <q-btn icon="close" flat round dense @click="cancelDeleteTx" style="background: var(--card-cream); color: var(--text-muted);" />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <!-- Transaction summary -->
          <div class="q-pa-sm q-mb-md" style="background: var(--card-cream); border-radius: 8px;">
            <div class="row items-center q-gutter-sm">
              <q-avatar :style="{ background: getCategoryColor(deleteTxData?.category) + '20' }" size="36px">
                <q-icon :name="getCategoryIcon(deleteTxData?.category)"
                  :style="{ color: getCategoryColor(deleteTxData?.category) }" size="18px" />
              </q-avatar>
              <div>
                <div class="text-weight-medium">{{ deleteTxData?.category }}</div>
                <div class="text-caption text-grey">{{ settings.formatDate(deleteTxData?.date) }}</div>
              </div>
              <q-space />
              <div :class="deleteTxData?.type === 'income' ? 'amount-income' : 'amount-expense'"
                class="text-weight-bold">
                {{ deleteTxData?.type === 'income' ? '+' : '-' }}{{ settings.currency }}{{
                  settings.formatNumber(deleteTxData?.amount) }}
              </div>
            </div>
          </div>

          <!-- Account balance question -->
          <div v-if="deleteTxData?.accountId" class="text-body2 q-mb-md text-grey-8">
            <template v-if="deleteTxData.type === 'expense'">
              {{ $t('dashboard.deleteExpenseConfirm', {
                amount: settings.currency +
                  settings.formatNumber(deleteTxData.amount), account: getAccountName(deleteTxData.accountId)
              }) }}
            </template>
            <template v-else-if="deleteTxData.type === 'income'">
              {{ $t('dashboard.deleteIncomeConfirm', {
                amount: settings.currency +
                  settings.formatNumber(deleteTxData.amount), account: getAccountName(deleteTxData.accountId)
              }) }}
            </template>
          </div>

          <!-- Action Buttons -->
          <div class="column q-gutter-sm">
            <q-btn v-if="deleteTxData?.accountId && (deleteTxData.type === 'expense' || deleteTxData.type === 'income')"
              :label="deleteTxData.type === 'expense' ? $t('dashboard.deleteWithRefund') : $t('dashboard.deleteWithDeduct')"
              :icon="deleteTxData.type === 'expense' ? 'savings' : 'money_off'" color="negative" unelevated
              class="full-width" @click="confirmDeleteWithBalance" />
            <q-btn :label="$t('dashboard.deleteOnly')" icon="delete_forever" outline color="negative" class="full-width"
              @click="confirmDeleteOnly" />
            <q-btn :label="$t('common.cancel')" flat color="grey-7" class="full-width" @click="cancelDeleteTx" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Transaction Dialog -->
    <q-dialog v-model="editDialogOpen">
      <q-card style="border-radius: 10px; width: 100%; max-width: 500px;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6 text-weight-bold">{{ $t('allTransactions.editTransaction') }}</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="saveEdit">
            <q-input v-model.number="editForm.amount" :label="$t('common.amount')" type="number" outlined color="dark"
              :prefix="settings.currency" :rules="[val => val > 0 || $t('common.validAmount')]"
              input-class="text-h6 text-weight-bold" class="q-mb-sm" />

            <q-select v-if="editForm.type !== 'transfer'" v-model="editForm.category"
              :options="editForm.type === 'income' ? incomeCategoryOptions : expenseCategoryOptions"
              :label="$t('common.category')" outlined color="dark" emit-value map-options class="q-mb-sm">
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

            <q-select v-if="editForm.type !== 'transfer'" v-model="editForm.accountId" :options="accountOptions"
              :label="$t('common.account')" outlined color="dark" emit-value map-options class="q-mb-sm" />

            <div class="row q-col-gutter-md q-mb-sm">
              <div class="col-6">
                <q-input v-model="editForm.date" :label="$t('common.date')" outlined color="dark" readonly>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="editForm.date" mask="YYYY-MM-DD" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input v-model="editForm.time" :label="$t('common.time')" outlined color="dark" readonly>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="editForm.time" mask="HH:mm" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <q-input v-model="editForm.notes" :label="$t('common.noteOptional')" outlined color="dark" type="textarea"
              rows="2" class="q-mb-sm" />

            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated size="lg"
              icon="check" :label="$t('common.update')" :loading="saving" />
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
import { useRouter } from 'vue-router'
import { useAccountStore } from 'stores/accountStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'
import { useAuthStore } from 'stores/authStore'
import { useLoanStore } from 'stores/loanStore'
import { useOccasionGoalStore } from 'stores/occasionGoalStore'

const { t } = useI18n()
const $q = useQuasar()
const $router = useRouter()
const accounts = useAccountStore()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const settings = useSettingsStore()
const authStore = useAuthStore()
const loans = useLoanStore()
const goalStore = useOccasionGoalStore()

const editDialogOpen = ref(false)
const saving = ref(false)

// Delete Confirmation
const deleteConfirmOpen = ref(false)
const deleteTxData = ref(null)
let deleteTxResetFn = null

// Quick Entry
const QUICK_ENTRY_KEY = 'dashboard_quick_entry'
const quickEntry = ref(localStorage.getItem(QUICK_ENTRY_KEY) === 'true')
function onQuickEntryChange(val) {
  localStorage.setItem(QUICK_ENTRY_KEY, val ? 'true' : 'false')
}

// Budget Modal
const budgetModalOpen = ref(false)
const budgetModalCategory = ref(null)
const budgetForm = reactive({
  month: '',
  amount: null,
})

// Quick Entry Modal (expense from category card)
const quickEntryModalOpen = ref(false)
const quickEntryCategory = ref(null)
const quickEntryForm = reactive({
  amount: null,
  category: '',
  accountId: null,
  notes: '',
})

// Get current month in YYYY-MM format
const currentMonth = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})

const budgetMonthProxy = ref(null)

function onBudgetMonthSelect(val) {
  if (val && budgetModalCategory.value) {
    const existingBudget = getMonthBudget(budgetModalCategory.value, val)
    budgetForm.amount = existingBudget || null
  }
  if (budgetMonthProxy.value) {
    budgetMonthProxy.value.hide()
  }
}

function getMonthBudget(cat, month) {
  if (!cat.budgets || !cat.budgets[month]) return null
  return cat.budgets[month]
}

function getCurrentMonthBudget(cat) {
  return getMonthBudget(cat, currentMonth.value)
}

function onBudgetCardClick(cat) {
  if (quickEntry.value) {
    quickEntryCategory.value = cat
    quickEntryForm.amount = null
    quickEntryForm.category = cat.name
    quickEntryForm.accountId = accounts.accounts[0]?.id || null
    quickEntryForm.notes = ''
    quickEntryModalOpen.value = true
  } else {
    openBudgetModal(cat)
  }
}

function openBudgetModal(cat) {
  budgetModalCategory.value = cat
  budgetForm.month = currentMonth.value
  const existingBudget = getMonthBudget(cat, budgetForm.month)
  budgetForm.amount = existingBudget || null
  budgetModalOpen.value = true
}

async function saveBudget() {
  if (!budgetModalCategory.value || !budgetForm.month) return
  saving.value = true
  try {
    await categories.setMonthlyBudget(budgetModalCategory.value.id, budgetForm.month, budgetForm.amount || 0)
    $q.notify({ type: 'positive', message: t('categories.categoryUpdated'), position: 'top' })
    budgetModalOpen.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  } finally {
    saving.value = false
  }
}

function goToCategoryDetails() {
  if (budgetModalCategory.value) {
    $router.push(`/dashboard/category/${budgetModalCategory.value.id}/transactions`)
  }
}

async function saveQuickEntry() {
  if (!quickEntryForm.amount || quickEntryForm.amount <= 0 || !quickEntryForm.accountId) return
  saving.value = true
  try {
    const now = new Date()
    await transactions.addTransaction({
      type: 'expense',
      amount: quickEntryForm.amount,
      category: quickEntryForm.category,
      accountId: quickEntryForm.accountId,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      notes: quickEntryForm.notes || '',
    })
    await accounts.updateBalance(quickEntryForm.accountId, -quickEntryForm.amount)
    $q.notify({ type: 'positive', message: t('addExpense.expenseAdded'), position: 'top' })
    quickEntryModalOpen.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  } finally {
    saving.value = false
  }
}

function goToQuickEntryDetails() {
  if (quickEntryCategory.value) {
    quickEntryModalOpen.value = false
    $router.push(`/dashboard/category/${quickEntryCategory.value.id}/transactions`)
  }
}
const editForm = reactive({
  id: null,
  type: '',
  amount: null,
  category: '',
  accountId: null,
  date: '',
  time: '',
  notes: '',
  originalAmount: 0,
  originalAccountId: null,
})

onMounted(() => {
  accounts.listenAccounts()
  categories.listenCategories()
  transactions.listenTransactions()
  loans.listenLoans()
  goalStore.listenGoals()
})

onUnmounted(() => {
  accounts.stopListening()
  categories.stopListening()
  transactions.stopListening()
  loans.stopListening()
  goalStore.stopListening()
})

const hour = new Date().getHours()
const greeting = computed(() => {
  if (hour < 12) return t('greetings.morning')
  if (hour < 17) return t('greetings.afternoon')
  if (hour < 20) return t('greetings.evening')
  return t('greetings.night')
})

const userName = computed(() => {
  return authStore.userProfile?.name || authStore.user?.email?.split('@')[0] || t('dashboard.user')
})

const greetingIcon = computed(() => {
  // Returns image paths for different times of day
  // sunrise.png - morning (5am-12pm)
  // mid-day.png - afternoon (12pm-5pm)
  // sunset.png - evening (5pm-8pm)
  // night.png - night (8pm-5am)
  if (hour >= 5 && hour < 12) return { src: '/img/sunrise.png', alt: 'morning' }
  if (hour >= 12 && hour < 17) return { src: '/img/mid-day.png', alt: 'afternoon' }
  if (hour >= 17 && hour < 20) return { src: '/img/sunset.png', alt: 'evening' }
  return { src: '/img/night.png', alt: 'night' }
})

function getCategorySpent(categoryName) {
  return transactions.transactions
    .filter((t) => t.type === 'expense' && t.category === categoryName)
    .reduce((sum, t) => sum + t.amount, 0)
}

function formatShort(num) {
  if (num == null) return '0'
  const n = Math.abs(num)
  if (n >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr'
  if (n >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L'
  if (n >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return settings.formatNumber(num)
}

function getCategoryColor(categoryName) {
  const all = [...categories.incomeCategories, ...categories.expenseCategories]
  return all.find((c) => c.name === categoryName)?.color || '#757575'
}

function getCategoryIcon(categoryName) {
  const all = [...categories.incomeCategories, ...categories.expenseCategories]
  return all.find((c) => c.name === categoryName)?.icon || 'receipt'
}

// eslint-disable-next-line no-unused-vars
const balanceEmoji = computed(() => {
  const bal = accounts.totalBalance || 0
  const emojis = settings.balanceEmojis || {
    negative: { emoji: '😭', threshold: 0 },
    low: { emoji: '😟', threshold: 500 },
    high: { emoji: '🤩' }
  }

  if (bal < emojis.negative.threshold) return emojis.negative.emoji
  if (bal <= emojis.low.threshold) return emojis.low.emoji
  return emojis.high.emoji
})

function onEditTx(tx, reset) {
  reset()
  editForm.id = tx.id
  editForm.type = tx.type
  editForm.amount = tx.amount
  editForm.category = tx.category || ''
  editForm.accountId = tx.accountId || null
  editForm.date = tx.date || ''
  editForm.time = tx.time || ''
  editForm.notes = tx.notes || ''
  editForm.originalAmount = tx.amount
  editForm.originalAccountId = tx.accountId
  editDialogOpen.value = true
}

async function saveEdit() {
  if (!editForm.amount || editForm.amount <= 0) return
  saving.value = true
  try {
    const updateData = {
      amount: editForm.amount,
      category: editForm.category,
      accountId: editForm.accountId,
      date: editForm.date,
      time: editForm.time,
      notes: editForm.notes,
    }
    if (editForm.type === 'income' || editForm.type === 'expense') {
      const sign = editForm.type === 'income' ? 1 : -1
      if (editForm.originalAccountId) {
        await accounts.updateBalance(editForm.originalAccountId, -sign * editForm.originalAmount)
      }
      if (editForm.accountId) {
        await accounts.updateBalance(editForm.accountId, sign * editForm.amount)
      }
    }
    await transactions.updateTransaction(editForm.id, updateData)
    $q.notify({ type: 'positive', message: t('allTransactions.transactionUpdated'), position: 'top' })
    editDialogOpen.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  } finally {
    saving.value = false
  }
}

const incomeCategoryOptions = computed(() =>
  categories.incomeCategories.map((c) => ({
    label: c.name,
    value: c.name,
    icon: c.icon,
    color: c.color,
  })),
)

const expenseCategoryOptions = computed(() =>
  categories.expenseCategories.map((c) => ({
    label: c.name,
    value: c.name,
    icon: c.icon,
    color: c.color,
  })),
)

const accountOptions = computed(() =>
  accounts.accounts.map((a) => ({
    label: `${a.name} (${settings.currency}${settings.formatNumber(a.balance || 0)})`,
    value: a.id,
  })),
)

function getAccountName(accountId) {
  return accounts.accounts.find((a) => a.id === accountId)?.name || accountId
}

function onDeleteTx(tx, reset) {
  deleteTxData.value = tx
  deleteTxResetFn = reset
  deleteConfirmOpen.value = true
}

function cancelDeleteTx() {
  deleteConfirmOpen.value = false
  if (deleteTxResetFn) deleteTxResetFn()
  deleteTxResetFn = null
  deleteTxData.value = null
}

async function confirmDeleteWithBalance() {
  if (!deleteTxData.value) return
  const tx = deleteTxData.value
  deleteConfirmOpen.value = false
  if (deleteTxResetFn) deleteTxResetFn()
  deleteTxResetFn = null
  await transactions.deleteTransaction(tx.id)
  if (tx.accountId) {
    if (tx.type === 'expense') {
      await accounts.updateBalance(tx.accountId, tx.amount)
    } else if (tx.type === 'income') {
      await accounts.updateBalance(tx.accountId, -tx.amount)
    }
  }
  $q.notify({ type: 'positive', message: t('dashboard.transactionDeleted'), position: 'top' })
  deleteTxData.value = null
}

function goalProgress(goal) {
  if (!goal.targetAmount) return 0
  return Math.min(Math.round((goal.currentSaved / goal.targetAmount) * 100), 100)
}

function goalDaysLeft(goal) {
  if (!goal.targetDate) return null
  const diff = new Date(goal.targetDate) - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

async function confirmDeleteOnly() {
  if (!deleteTxData.value) return
  const tx = deleteTxData.value
  deleteConfirmOpen.value = false
  if (deleteTxResetFn) deleteTxResetFn()
  deleteTxResetFn = null
  await transactions.deleteTransaction(tx.id)
  $q.notify({ type: 'positive', message: t('dashboard.transactionDeleted'), position: 'top' })
  deleteTxData.value = null
}
</script>

<style scoped>
.dashboard-page {
  padding: 16px 16px 80px;
}

/* Greeting header */
.greeting-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.greeting-icon-wrap {
  flex-shrink: 0;
  margin-left: 12px;
}

/* Greeting typography */
.greeting-name {
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.greeting-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Section headers */
.dash-section-header {
  padding: 10px 2px 0;
}

.dash-section-title {
  font-size: 0.69rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

/* Balance Card */
.balance-overview-card {
  border-radius: 10px !important;
  border: none !important;
  box-shadow: 0 12px 30px -16px rgba(22, 22, 26, 0.6), 0 2px 0 rgba(22, 22, 26, 0.04) !important;
  overflow: hidden;
}

.balance-card-inner {
  background: #16161a !important;
  color: #fff;
  padding: 20px 20px !important;
  position: relative;
  overflow: hidden;
}

.balance-texture {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  background-image: radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.5) 0, transparent 40%);
  pointer-events: none;
}

.balance-label {
  font-size: 0.69rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
}

.balance-amount {
  font-size: 2.1rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-top: 8px;
}

.balance-meta {
  margin-top: 4px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

.balance-eye-btn {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.balance-stats {
  margin-top: 18px;
  display: flex;
  gap: 22px;
}

.balance-stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.balance-stat-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.69rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.55);
}

.balance-stat-value {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* Account cards */
.accounts-scroll-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.accounts-scroll-row::-webkit-scrollbar {
  display: none;
}

.account-card {
  min-width: 158px;
  flex-shrink: 0;
  border-radius: 10px !important;
}

.account-card-inner {
  padding: 14px 14px !important;
}

.account-type-chip {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.account-card-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-top: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.account-card-balance {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 2px;
}

.loan-cards-row {
  display: flex;
  gap: 8px;
}

.loan-dash-card {
  flex: 1;
  min-width: 0;
  border-radius: 10px !important;
}

.loan-card-inner {
  padding: 12px 12px !important;
  display: flex;
  flex-direction: column;
}

.loan-card-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 2px;
  margin-top: 8px;
}

.loan-card-amount {
  font-size: 1.06rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.loan-due-section .loan-due-header {
  padding: 0 2px;
}

/* Occasion Goal cards */
.goal-cards-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.goal-dash-card {
  border-radius: 10px !important;
}

.goal-card-inner {
  padding: 12px 14px !important;
}

.goal-card-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #16161a;
  max-width: 70%;
}

.goal-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  letter-spacing: 0.04em;
}

.goal-badge-active {
  background: #fef3c7;
  color: #d97706;
}

.goal-badge-done {
  background: #dcfce7;
  color: #16a34a;
}

.goal-card-saved {
  font-size: 0.78rem;
  font-weight: 700;
  color: #16161a;
}

.goal-card-target {
  font-weight: 400;
  color: #7c7a73;
}

.goal-days-left {
  font-size: 0.7rem;
  font-weight: 600;
  color: #7c7a73;
  background: #f5f3ef;
  padding: 2px 7px;
  border-radius: 8px;
}

/* Budget scroll */
.budget-scroll-container {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.budget-scroll-container::-webkit-scrollbar {
  display: none;
}

.budget-scroll-item {
  flex: 0 0 auto;
  width: 80px;
}

/* Budget fill card */
.budget-fill-card {
  position: relative;
  overflow: hidden;
  min-height: 108px;
  border-radius: 10px !important;
}

.budget-fill-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transition: height 0.5s ease;
  border-radius: 0 0 10px 10px;
  pointer-events: none;
}

.budget-fill-content {
  position: relative;
  z-index: 1;
}

/* Transaction card */
.tx-card {
  border-radius: 10px !important;
  overflow: hidden;
}

/* Transaction item */
.tx-card :deep(.q-item) {
  transition: background 0.12s ease;
}

.tx-card :deep(.q-item:hover) {
  background: var(--card-cream);
}

.tx-card :deep(.q-item-label--caption) {
  color: var(--text-muted) !important;
}

/* Desktop refinements */
@media (min-width: 600px) {
  .dashboard-page {
    padding-bottom: 24px;
  }

  .accounts-scroll-row {
    flex-wrap: wrap;
  }

  .account-card {
    flex: 1 1 calc(50% - 6px);
    min-width: 0;
  }

  .budget-scroll-container {
    flex-wrap: wrap;
  }

  .budget-scroll-item {
    width: calc(33.33% - 6px);
  }
}

/* Greeting spacing for desktop */
@media (min-width: 1024px) {
  .greeting-name {
    font-size: 1.6rem;
  }
}
</style>

