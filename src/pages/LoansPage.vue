<template>
  <q-page class="page-container">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="page-title">{{ $t('loans.title') }}</div>
        <div class="page-subtitle">{{ loanStore.loans.length }}{{ $t('loans.countSuffix') }}</div>
      </div>
      <q-btn round flat dense icon="add_circle" size="md"
        style="color: #1a1a2e; background: rgba(26,26,46,0.06); border-radius: 14px;" @click="openAddDialog" />
    </div>

    <!-- Summary Cards -->
    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-6 col-md-4">
        <q-card class="finance-card" style="border-left: 4px solid #22c55e;">
          <q-card-section class="q-py-sm q-px-md">
            <div class="text-caption text-grey-7">{{ $t('loans.totalReceivable') }}</div>
            <div class="text-h6 text-weight-bold" style="color: #22c55e;">
              {{ settings.currency }}{{ settings.formatNumber(loanStore.totalReceivable) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 col-md-4">
        <q-card class="finance-card" style="border-left: 4px solid #ef4444;">
          <q-card-section class="q-py-sm q-px-md">
            <div class="text-caption text-grey-7">{{ $t('loans.totalPayable') }}</div>
            <div class="text-h6 text-weight-bold" style="color: #ef4444;">
              {{ settings.currency }}{{ settings.formatNumber(loanStore.totalPayable) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div v-if="loanStore.loanEntries.length" class="col-12 col-md-4">
        <q-card class="finance-card" style="border-left: 4px solid #f59e0b;">
          <q-card-section class="q-py-sm q-px-md">
            <div class="text-caption text-grey-7">{{ $t('loans.totalLoan') }}</div>
            <div class="text-h6 text-weight-bold" style="color: #f59e0b;">
              {{ settings.currency }}{{ settings.formatNumber(loanStore.totalLoanAmount) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loanStore.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <template v-else>
      <!-- Tabs -->
      <q-card class="finance-card tab-card q-mb-md">
        <q-tabs v-model="activeTab" dense active-color="dark" indicator-color="dark" class="text-grey-6"
          align="justify" no-caps>
          <q-tab name="receivable" :label="$t('loans.receivable')" />
          <q-tab name="payable" :label="$t('loans.payable')" />
          <q-tab name="loan" :label="$t('loans.loan')" />
        </q-tabs>
      </q-card>

      <!-- Receivable Tab -->
      <q-tab-panels v-model="activeTab" animated style="background: transparent;">
        <q-tab-panel name="receivable" class="q-pa-none">
          <div v-if="activeLoans(loanStore.receivables).length" class="q-mb-md">
            <div class="page-section-title">{{ $t('loans.activeLoans') }}</div>
            <div class="row q-col-gutter-sm">
              <div v-for="loan in activeLoans(loanStore.receivables)" :key="loan.id" class="col-12 col-md-4">
                <q-slide-item @left="(obj) => onSwipe(obj, 'edit', loan)" @right="(obj) => onSwipe(obj, 'delete', loan)">
                  <template v-slot:left>
                    <q-icon name="edit" color="dark" />
                  </template>
                  <template v-slot:right>
                    <q-icon name="delete" color="negative" />
                  </template>
                  <loan-card :loan="loan" color="#22c55e" @click="openDetail(loan)"
                    @pay="openPaymentDialog(loan)" />
                </q-slide-item>
              </div>
            </div>
          </div>

          <div v-if="settledLoans(loanStore.receivables).length" class="q-mb-md">
            <div class="page-section-title">{{ $t('loans.settledLoans') }}</div>
            <div class="row q-col-gutter-sm">
              <div v-for="loan in settledLoans(loanStore.receivables)" :key="loan.id" class="col-12 col-md-4">
                <q-slide-item @left="(obj) => onSwipe(obj, 'edit', loan)" @right="(obj) => onSwipe(obj, 'delete', loan)">
                  <template v-slot:left>
                    <q-icon name="edit" color="dark" />
                  </template>
                  <template v-slot:right>
                    <q-icon name="delete" color="negative" />
                  </template>
                  <loan-card :loan="loan" color="#22c55e" settled @click="openDetail(loan)" />
                </q-slide-item>
              </div>
            </div>
          </div>

          <div v-if="!loanStore.receivables.length" class="empty-state">
            <q-icon name="account_balance" size="60px" />
            <div class="empty-state-title">{{ $t('loans.noReceivables') }}</div>
            <div class="empty-state-subtitle">{{ $t('loans.addPrompt') }}</div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="payable" class="q-pa-none">
          <div v-if="activeLoans(loanStore.payables).length" class="q-mb-md">
            <div class="page-section-title">{{ $t('loans.activeLoans') }}</div>
            <div class="row q-col-gutter-sm">
              <div v-for="loan in activeLoans(loanStore.payables)" :key="loan.id" class="col-12 col-md-4">
                <q-slide-item @left="(obj) => onSwipe(obj, 'edit', loan)" @right="(obj) => onSwipe(obj, 'delete', loan)">
                  <template v-slot:left>
                    <q-icon name="edit" color="dark" />
                  </template>
                  <template v-slot:right>
                    <q-icon name="delete" color="negative" />
                  </template>
                  <loan-card :loan="loan" color="#ef4444" @click="openDetail(loan)"
                    @pay="openPaymentDialog(loan)" />
                </q-slide-item>
              </div>
            </div>
          </div>

          <div v-if="settledLoans(loanStore.payables).length" class="q-mb-md">
            <div class="page-section-title">{{ $t('loans.settledLoans') }}</div>
            <div class="row q-col-gutter-sm">
              <div v-for="loan in settledLoans(loanStore.payables)" :key="loan.id" class="col-12 col-md-4">
                <q-slide-item @left="(obj) => onSwipe(obj, 'edit', loan)" @right="(obj) => onSwipe(obj, 'delete', loan)">
                  <template v-slot:left>
                    <q-icon name="edit" color="dark" />
                  </template>
                  <template v-slot:right>
                    <q-icon name="delete" color="negative" />
                  </template>
                  <loan-card :loan="loan" color="#ef4444" settled @click="openDetail(loan)" />
                </q-slide-item>
              </div>
            </div>
          </div>

          <div v-if="!loanStore.payables.length" class="empty-state">
            <q-icon name="account_balance" size="60px" />
            <div class="empty-state-title">{{ $t('loans.noPayables') }}</div>
            <div class="empty-state-subtitle">{{ $t('loans.addPrompt') }}</div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="loan" class="q-pa-none">
          <div v-if="activeLoans(loanStore.loanEntries).length" class="q-mb-md">
            <div class="page-section-title">{{ $t('loans.activeLoans') }}</div>
            <div class="row q-col-gutter-sm">
              <div v-for="loan in activeLoans(loanStore.loanEntries)" :key="loan.id" class="col-12 col-md-4">
                <q-slide-item @left="(obj) => onSwipe(obj, 'edit', loan)" @right="(obj) => onSwipe(obj, 'delete', loan)">
                  <template v-slot:left>
                    <q-icon name="edit" color="dark" />
                  </template>
                  <template v-slot:right>
                    <q-icon name="delete" color="negative" />
                  </template>
                  <loan-card :loan="loan" color="#f59e0b" @click="openDetail(loan)"
                    @pay="openDetail(loan)" />
                </q-slide-item>
              </div>
            </div>
          </div>

          <div v-if="settledLoans(loanStore.loanEntries).length" class="q-mb-md">
            <div class="page-section-title">{{ $t('loans.settledLoans') }}</div>
            <div class="row q-col-gutter-sm">
              <div v-for="loan in settledLoans(loanStore.loanEntries)" :key="loan.id" class="col-12 col-md-4">
                <q-slide-item @left="(obj) => onSwipe(obj, 'edit', loan)" @right="(obj) => onSwipe(obj, 'delete', loan)">
                  <template v-slot:left>
                    <q-icon name="edit" color="dark" />
                  </template>
                  <template v-slot:right>
                    <q-icon name="delete" color="negative" />
                  </template>
                  <loan-card :loan="loan" color="#f59e0b" settled @click="openDetail(loan)" />
                </q-slide-item>
              </div>
            </div>
          </div>

          <div v-if="!loanStore.loanEntries.length" class="empty-state">
            <q-icon name="account_balance_wallet" size="60px" />
            <div class="empty-state-title">{{ $t('loans.noLoans') }}</div>
            <div class="empty-state-subtitle">{{ $t('loans.addPrompt') }}</div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Swipe Hint -->
      <div v-if="loanStore.loans.length" class="text-center q-pa-md text-grey-6 q-mt-sm" style="font-size: 12px;">
        <q-icon name="swipe" size="16px" class="q-mr-xs" />
        {{ $t('categories.swipeHint') }}
      </div>
    </template>

    <!-- Add Loan Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ addForm.type === 'receivable' ? $t('loans.newReceivable') : addForm.type === 'payable' ? $t('loans.newPayable') : $t('loans.newLoanEntry') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <!-- Type Tabs -->
          <q-tabs v-model="addForm.type" dense active-color="dark" indicator-color="dark" class="q-mb-md"
            narrow-indicator>
            <q-tab name="receivable" :label="$t('loans.receivable')" />
            <q-tab name="payable" :label="$t('loans.payable')" />
            <q-tab name="loan" :label="$t('loans.loan')" />
          </q-tabs>

          <q-form @submit.prevent="addForm.type === 'loan' ? saveLoanEntry() : saveLoan()">
            <!-- Person Name -->
            <q-input v-model="addForm.personName" :label="$t('loans.personName')" outlined dense color="dark"
              :rules="[(val) => (val && val.length > 0) || $t('common.nameRequired')]" style="margin-bottom: 10px;" />

            <!-- Amount -->
            <q-input v-model.number="addForm.amount" :label="addForm.type === 'loan' ? $t('loans.principal') : $t('common.amount')" type="number" outlined dense
              color="dark" :prefix="settings.currency"
              :rules="[val => val > 0 || $t('common.validAmount')]" style="margin-bottom: 10px;" />

            <!-- Interest Rate (loan only) -->
            <q-input v-if="addForm.type === 'loan'" v-model.number="addForm.interestRate"
              :label="$t('loans.interestRate')" type="number" outlined dense color="dark" suffix="%"
              :rules="[val => val >= 0 || $t('loans.validRate')]" style="margin-bottom: 10px;" />

            <!-- Date -->
            <q-input v-model="addForm.date" :label="$t('common.date')" outlined dense color="dark" readonly
              :rules="[val => !!val || $t('common.dateRequired')]" style="margin-bottom: 10px;">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="addForm.date" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- Installment Count (loan only) -->
            <q-input v-if="addForm.type === 'loan'" v-model.number="addForm.installmentCount"
              :label="$t('loans.installmentCount')" type="number" outlined dense color="dark"
              :rules="[val => val > 0 || $t('loans.validInstallments')]" style="margin-bottom: 10px;" />

            <!-- Installment Frequency (loan only) -->
            <q-select v-if="addForm.type === 'loan'" v-model="addForm.installmentFrequency"
              :options="frequencyOptions" :label="$t('loans.installmentFrequency')" outlined dense color="dark"
              emit-value map-options style="margin-bottom: 10px;" />

            <!-- Account (loan only) -->
            <q-select v-if="addForm.type === 'loan'" v-model="addForm.accountId"
              :options="accountOptions" :label="$t('common.account')" outlined dense color="dark"
              emit-value map-options :rules="[val => !!val || $t('common.accountRequired')]"
              style="margin-bottom: 10px;" />

            <!-- Calculated Preview (loan only) -->
            <div v-if="addForm.type === 'loan' && addForm.amount > 0 && addForm.interestRate >= 0 && addForm.installmentCount > 0"
              class="q-mb-md" style="background: #f8fafc; border-radius: 12px; padding: 12px;">
              <div class="text-caption text-grey-7 q-mb-xs">{{ $t('loans.loanSummary') }}</div>
              <div class="row q-col-gutter-xs">
                <div class="col-6">
                  <div class="text-caption">{{ $t('loans.totalInterest') }}</div>
                  <div class="text-weight-bold">{{ settings.currency }}{{ settings.formatNumber(addForm.amount * (addForm.interestRate || 0) / 100) }}</div>
                </div>
                <div class="col-6">
                  <div class="text-caption">{{ $t('loans.totalWithInterest') }}</div>
                  <div class="text-weight-bold">{{ settings.currency }}{{ settings.formatNumber(addForm.amount * (1 + (addForm.interestRate || 0) / 100)) }}</div>
                </div>
                <div class="col-12 q-mt-xs">
                  <div class="text-caption">{{ $t('loans.perInstallment') }}</div>
                  <div class="text-weight-bold text-primary">{{ settings.currency }}{{ settings.formatNumber(Math.round(addForm.amount * (1 + (addForm.interestRate || 0) / 100) / addForm.installmentCount * 100) / 100) }}</div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <q-input v-model="addForm.notes" :label="$t('common.noteOptional')" outlined dense color="dark"
              type="textarea" rows="2" style="margin-bottom: 10px;" />

            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="addForm.type === 'receivable' ? $t('loans.addReceivable') : addForm.type === 'payable' ? $t('loans.addPayable') : $t('loans.addLoanEntry')" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Loan Dialog -->
    <q-dialog v-model="showEditDialog">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ $t('loans.editLoan') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="updateLoan">
            <!-- Person Name -->
            <q-input v-model="editForm.personName" :label="$t('loans.personName')" outlined dense color="dark"
              :rules="[(val) => (val && val.length > 0) || $t('common.nameRequired')]" style="margin-bottom: 10px;" />

            <!-- Amount -->
            <q-input v-model.number="editForm.amount" :label="$t('common.amount')" type="number" outlined dense
              color="dark" :prefix="settings.currency"
              :rules="[val => val > 0 || $t('common.validAmount')]" style="margin-bottom: 10px;" />

            <!-- Date -->
            <q-input v-model="editForm.date" :label="$t('common.date')" outlined dense color="dark" readonly
              :rules="[val => !!val || $t('common.dateRequired')]" style="margin-bottom: 10px;">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="editForm.date" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- Notes -->
            <q-input v-model="editForm.notes" :label="$t('common.noteOptional')" outlined dense color="dark"
              type="textarea" rows="2" style="margin-bottom: 10px;" />

            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="$t('common.update')" :loading="editSaving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Payment Dialog -->
    <q-dialog v-model="showPaymentDialog">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ payingLoan?.type === 'receivable' ? $t('loans.receivePayment') : $t('loans.makePayment') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <!-- Loan Info -->
          <div class="q-mb-md" style="background: #f8fafc; border-radius: 12px; padding: 12px;">
            <div class="row items-center justify-between">
              <div>
                <div class="text-subtitle2 text-weight-bold">{{ payingLoan?.personName }}</div>
                <div class="text-caption text-grey-7">
                  {{ $t('loans.remaining') }}:
                  {{ settings.currency }}{{ settings.formatNumber((payingLoan?.amount || 0) - (payingLoan?.paidAmount || 0)) }}
                </div>
              </div>
            </div>
          </div>

          <q-form @submit.prevent="savePayment">
            <!-- Amount -->
            <q-input v-model.number="payForm.amount" :label="$t('common.amount')" type="number" outlined dense
              color="dark" :prefix="settings.currency"
              :rules="[val => val > 0 || $t('common.validAmount'), val => val <= remainingAmount || $t('loans.exceedsRemaining')]"
              style="margin-bottom: 10px;" />

            <!-- Account -->
            <q-select v-model="payForm.accountId" :options="accountOptions" :label="$t('common.account')" outlined
              dense color="dark" emit-value map-options
              :rules="[val => !!val || $t('common.accountRequired')]" style="margin-bottom: 10px;" />

            <!-- Date -->
            <q-input v-model="payForm.date" :label="$t('common.date')" outlined dense color="dark" readonly
              :rules="[val => !!val || $t('common.dateRequired')]" style="margin-bottom: 10px;">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="payForm.date" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- Notes -->
            <q-input v-model="payForm.notes" :label="$t('common.noteOptional')" outlined dense color="dark"
              type="textarea" rows="2" style="margin-bottom: 10px;" />

            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="payingLoan?.type === 'receivable' ? $t('loans.receiveBtn') : $t('loans.payBtn')"
              :loading="paymentSaving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Loan Detail Dialog -->
    <q-dialog v-model="showDetailDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card style="background: #f8fafc;">
        <!-- Detail Header -->
        <q-toolbar class="bg-white text-dark" style="border-bottom: 1px solid #e2e8f0;">
          <q-btn flat round dense icon="arrow_back" @click="showDetailDialog = false" />
          <q-toolbar-title class="text-weight-bold" style="font-size: 1.1rem;">
            {{ detailLoan?.personName }}
          </q-toolbar-title>
          <q-chip :color="detailLoan?.settled ? 'positive' : 'warning'" text-color="white" dense size="sm">
            {{ detailLoan?.settled ? $t('loans.settled') : $t('loans.active') }}
          </q-chip>
        </q-toolbar>

        <q-page-container>
          <div style="max-width: 700px; margin: 0 auto; padding: 16px;">
            <!-- Summary Card -->
            <q-card class="finance-card q-mb-md"
              :style="{ borderLeft: '4px solid ' + (detailLoan?.type === 'loan' ? '#f59e0b' : detailLoan?.type === 'receivable' ? '#22c55e' : '#ef4444') }">
              <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-caption text-grey-7">
                    {{ detailLoan?.type === 'receivable' ? $t('loans.lentTo') : detailLoan?.type === 'loan' ? $t('loans.loan') : $t('loans.borrowedFrom') }}
                  </div>
                  <div class="text-caption text-grey-7">{{ formatDate(detailLoan?.date) }}</div>
                </div>
                <div class="text-h5 text-weight-bold q-mb-sm">
                  {{ settings.currency }}{{ settings.formatNumber(detailLoan?.type === 'loan' ? (detailLoan?.totalAmount || 0) : (detailLoan?.amount || 0)) }}
                </div>
                <div v-if="detailLoan?.type === 'loan'" class="text-caption text-grey-7 q-mb-xs"
                  style="margin-top: -6px;">
                  {{ $t('loans.principal') }}: {{ settings.currency }}{{ settings.formatNumber(detailLoan?.amount || 0) }}
                  &middot; {{ $t('loans.interest') }}: {{ detailLoan?.interestRate }}%
                  ({{ settings.currency }}{{ settings.formatNumber((detailLoan?.totalAmount || 0) - (detailLoan?.amount || 0)) }})
                </div>
                <q-linear-progress :value="progressValue" rounded size="8px" class="q-mb-xs"
                  :color="detailLoan?.type === 'loan' ? 'amber-8' : detailLoan?.type === 'receivable' ? 'positive' : 'negative'" track-color="grey-3" />
                <div class="row items-center justify-between">
                  <div class="text-caption text-grey-7">
                    {{ $t('loans.paid') }}: {{ settings.currency }}{{ settings.formatNumber(detailLoan?.paidAmount || 0) }}
                  </div>
                  <div class="text-caption text-weight-medium"
                    :style="{ color: detailLoan?.type === 'loan' ? '#f59e0b' : detailLoan?.type === 'receivable' ? '#22c55e' : '#ef4444' }">
                    {{ $t('loans.remaining') }}: {{ settings.currency }}{{ settings.formatNumber(detailRemaining) }}
                  </div>
                </div>
                <div v-if="detailLoan?.notes" class="text-caption text-grey-7 q-mt-sm">
                  {{ detailLoan.notes }}
                </div>
                <div v-if="detailLoan?.type === 'loan'" class="row q-mt-sm q-gutter-xs">
                  <q-chip dense size="sm" color="amber-8" text-color="white" icon="percent">
                    {{ detailLoan.interestRate }}%
                  </q-chip>
                  <q-chip dense size="sm" color="blue-grey-7" text-color="white" icon="event_repeat">
                    {{ detailLoan.installmentCount }} {{ getFrequencyLabel(detailLoan.installmentFrequency) }}
                  </q-chip>
                </div>
              </q-card-section>
            </q-card>

            <!-- Installment Schedule (for loan type) -->
            <template v-if="detailLoan?.type === 'loan'">
              <div class="page-section-title">{{ $t('loans.installmentSchedule') }}</div>
              <q-card v-if="detailLoan?.installments?.length" class="finance-card" style="overflow: hidden;">
                <q-list separator>
                  <div v-for="(inst, idx) in detailLoan.installments" :key="idx">
                    <q-item class="touch-target" style="flex-direction: column; align-items: stretch; padding: 0;">
                      <div class="row items-center q-pa-sm q-px-md">
                        <q-item-section avatar>
                          <q-avatar :style="{ background: inst.paid ? '#22c55e15' : (inst.paidAmount > 0 ? '#f59e0b30' : '#f59e0b15') }" size="40px">
                            <q-icon :name="inst.paid ? 'check_circle' : (inst.paidAmount > 0 ? 'pending' : 'schedule')"
                              :style="{ color: inst.paid ? '#22c55e' : '#f59e0b' }" size="20px" />
                          </q-avatar>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-weight-bold">
                            {{ $t('loans.installment') }} #{{ inst.number }}
                          </q-item-label>
                          <q-item-label caption>
                            {{ formatDate(inst.dueDate) }}
                            <span v-if="inst.paid" class="text-positive"> &middot; {{ $t('loans.paidOn') }} {{ formatDate(inst.paidDate) }}</span>
                            <span v-else-if="inst.paidAmount > 0" style="color: #f59e0b;"> &middot; {{ $t('loans.installmentPaidSoFar') }}: {{ settings.currency }}{{ settings.formatNumber(inst.paidAmount) }}</span>
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side class="text-right">
                          <div class="text-weight-bold q-mb-xs" :style="{ color: inst.paid ? '#22c55e' : '#333' }">
                            {{ settings.currency }}{{ settings.formatNumber(inst.paid ? inst.paidAmount : inst.amount) }}
                          </div>
                          <div v-if="!inst.paid && !detailLoan?.settled" class="column q-gutter-xs items-end">
                            <q-btn flat dense size="sm" color="positive"
                              icon="payment" :label="$t('loans.confirmPay')"
                              @click.stop="openConfirmInstallment(inst, idx)" style="border-radius: 8px;" />
                            <q-btn flat dense size="sm" color="grey-7"
                              icon="check_circle_outline" :label="$t('loans.alreadyPaid')"
                              @click.stop="openAlreadyPaidDialog(inst, idx)" style="border-radius: 8px;" />
                          </div>
                        </q-item-section>
                      </div>
                      <!-- Sub-payment history -->
                      <div v-if="inst.payments && inst.payments.length" style="background: #f8fafc; border-top: 1px solid #e2e8f0;">
                        <div v-for="(p, pIdx) in [...inst.payments].sort((a,b) => (a.createdAt||0)-(b.createdAt||0))" :key="pIdx"
                          class="row items-center justify-between q-px-md q-py-xs" style="font-size: 0.82rem;">
                          <div class="row items-center q-gutter-xs">
                            <q-icon name="subdirectory_arrow_right" size="14px" color="grey-5" />
                            <span class="text-grey-7">{{ formatDate(p.date) }}</span>
                          </div>
                          <span class="text-weight-medium" style="color: #f59e0b;">
                            +{{ settings.currency }}{{ settings.formatNumber(p.amount) }}
                          </span>
                        </div>
                      </div>
                    </q-item>
                  </div>
                </q-list>
              </q-card>
            </template>

            <!-- Payment History (for receivable/payable) -->
            <template v-else>
            <div class="page-section-title">{{ $t('loans.paymentHistory') }}</div>
            <div v-if="detailLoan?.payments?.length">
              <div class="text-center q-mb-xs text-grey-6" style="font-size: 12px;">
                <q-icon name="swipe" size="16px" class="q-mr-xs" />
                {{ $t('loans.swipeHint') }}
              </div>
              <q-card class="finance-card" style="overflow: hidden;">
                <q-list separator>
                  <q-slide-item v-for="(p, idx) in sortedPayments" :key="p.createdAt || idx"
                    @left="({ reset }) => onEditPayment(p, reset)"
                    @right="({ reset }) => onDeletePayment(p, reset)">
                    <template v-slot:left>
                      <div class="row items-center">
                        <q-icon name="edit" color="info" />
                      </div>
                    </template>
                    <template v-slot:right>
                      <div class="row items-center">
                        <q-icon name="delete" color="negative" />
                      </div>
                    </template>
                    <q-item class="touch-target">
                      <q-item-section avatar>
                        <q-avatar :style="{ background: (detailLoan?.type === 'receivable' ? '#22c55e' : '#ef4444') + '15' }" size="40px">
                          <q-icon name="payment" :style="{ color: detailLoan?.type === 'receivable' ? '#22c55e' : '#ef4444' }" size="20px" />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold"
                          :style="{ color: detailLoan?.type === 'receivable' ? '#22c55e' : '#ef4444' }">
                          {{ settings.currency }}{{ settings.formatNumber(p.amount) }}
                        </q-item-label>
                        <q-item-label caption>{{ formatDate(p.date) }}<span v-if="p.notes"> &middot; {{ p.notes }}</span></q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-icon name="check_circle"
                          :color="detailLoan?.type === 'receivable' ? 'positive' : 'negative'" size="22px" />
                      </q-item-section>
                    </q-item>
                  </q-slide-item>
                </q-list>
              </q-card>
            </div>
            <div v-else class="empty-state q-mt-md">
              <q-icon name="history" size="48px" />
              <div class="empty-state-title">{{ $t('loans.noPayments') }}</div>
            </div>

            <!-- Pay Button -->
            <q-btn v-if="!detailLoan?.settled" class="full-width bg-primary-gradient q-mt-md" text-color="white"
              rounded unelevated size="lg"
              :icon="detailLoan?.type === 'receivable' ? 'call_received' : 'call_made'"
              :label="detailLoan?.type === 'receivable' ? $t('loans.receivePayment') : $t('loans.makePayment')"
              @click="openPaymentFromDetail" />
            </template>
          </div>
        </q-page-container>
      </q-card>
    </q-dialog>

    <!-- Edit Payment Dialog -->
    <q-dialog v-model="showEditPaymentDialog">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ $t('loans.editPayment') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="saveEditedPayment">
            <q-input v-model.number="editPaymentForm.amount" :label="$t('common.amount')" type="number" outlined dense
              color="dark" :prefix="settings.currency"
              :rules="[val => val > 0 || $t('common.validAmount')]" style="margin-bottom: 10px;" />

            <q-select v-model="editPaymentForm.accountId" :options="accountOptions" :label="$t('common.account')" outlined
              dense color="dark" emit-value map-options style="margin-bottom: 10px;" />

            <q-input v-model="editPaymentForm.date" :label="$t('common.date')" outlined dense color="dark" readonly
              :rules="[val => !!val || $t('common.dateRequired')]" style="margin-bottom: 10px;">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="editPaymentForm.date" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input v-model="editPaymentForm.notes" :label="$t('common.noteOptional')" outlined dense color="dark"
              type="textarea" rows="2" style="margin-bottom: 10px;" />

            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="$t('common.update')" :loading="editPaymentSaving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Payment Confirm Dialog -->
    <q-dialog v-model="showDeletePaymentDialog">
      <q-card style="border-radius: 28px; width: 100%; max-width: 420px; background: white;">
        <q-card-section>
          <div class="text-h6 text-weight-bold q-mb-sm">{{ $t('loans.deletePaymentTitle') }}</div>
          <div class="text-body2 text-grey-8 q-mb-md">
            {{ settings.currency }}{{ settings.formatNumber(deletingPayment?.amount || 0) }} — {{ $t('loans.deletePaymentConfirm') }}
          </div>
          <div class="column q-gutter-sm">
            <q-btn v-if="deletingPayment?.accountId"
              :label="detailLoan?.type === 'receivable' ? $t('loans.deletePaymentDeduct') : $t('loans.deletePaymentRefund')"
              :icon="detailLoan?.type === 'receivable' ? 'money_off' : 'savings'"
              color="negative" unelevated class="full-width" @click="deletePaymentWithRefund" />
            <q-btn :label="$t('loans.deletePaymentOnly')" icon="delete_forever" outline color="negative"
              class="full-width" @click="deletePaymentOnly" />
            <q-btn :label="$t('common.cancel')" flat color="grey-7" class="full-width" @click="cancelDeletePayment" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Already Paid Dialog (no transaction) -->
    <q-dialog v-model="showAlreadyPaidDialog">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ $t('loans.alreadyPaidTitle') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <div class="q-mb-md" style="background: #f8fafc; border-radius: 12px; padding: 12px;">
            <div class="text-subtitle2 text-weight-bold">
              {{ $t('loans.installment') }} #{{ alreadyPaidInstallment?.number }}
            </div>
            <div class="text-caption text-grey-7">
              {{ $t('loans.scheduledAmount') }}: {{ settings.currency }}{{ settings.formatNumber(alreadyPaidInstallment?.amount || 0) }}
            </div>
            <div class="text-caption text-grey-7">
              {{ $t('loans.dueDate') }}: {{ formatDate(alreadyPaidInstallment?.dueDate) }}
            </div>
          </div>
          <div class="q-mb-md text-body2 text-grey-8">{{ $t('loans.alreadyPaidNote') }}</div>
          <q-form @submit.prevent="doMarkAlreadyPaid">
            <q-input v-model.number="alreadyPaidAmount" :label="$t('loans.actualPaidAmount')" type="number"
              outlined dense color="dark" :prefix="settings.currency"
              :rules="[val => val > 0 || $t('common.validAmount')]" style="margin-bottom: 16px;" />
            <div class="row q-gutter-sm">
              <q-btn type="submit" class="col bg-primary-gradient" text-color="white" rounded unelevated
                :label="$t('loans.alreadyPaidConfirm')" :loading="alreadyPaidSaving" />
              <q-btn class="col" flat rounded color="grey-7" :label="$t('common.cancel')"
                @click="showAlreadyPaidDialog = false" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Confirm Installment Dialog -->
    <q-dialog v-model="showConfirmInstallmentDialog">
      <q-card style="border-radius: 28px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: #222;">
            {{ $t('loans.confirmInstallment') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup style="background: #f1f5f9; color: #64748b;" />
        </q-card-section>
        <q-card-section>
          <div class="q-mb-md" style="background: #f8fafc; border-radius: 12px; padding: 12px;">
            <div class="text-subtitle2 text-weight-bold">
              {{ $t('loans.installment') }} #{{ confirmingInstallment?.number }}
            </div>
            <div class="text-caption text-grey-7">
              {{ $t('loans.scheduledAmount') }}: {{ settings.currency }}{{ settings.formatNumber(confirmingInstallment?.amount || 0) }}
            </div>
            <div v-if="confirmingInstallment?.paidAmount > 0" class="text-caption" style="color: #f59e0b;">
              {{ $t('loans.installmentPaidSoFar') }}: {{ settings.currency }}{{ settings.formatNumber(confirmingInstallment?.paidAmount || 0) }}
            </div>
            <div class="text-caption text-grey-7">
              {{ $t('loans.dueDate') }}: {{ formatDate(confirmingInstallment?.dueDate) }}
            </div>
          </div>
          <q-form @submit.prevent="doConfirmInstallment">
            <q-input v-model.number="confirmInstallmentAmount" :label="$t('loans.actualPaidAmount')" type="number"
              outlined dense color="dark" :prefix="settings.currency"
              :rules="[val => val > 0 || $t('common.validAmount')]" style="margin-bottom: 10px;" />
            <q-checkbox v-model="confirmMarkAsPaid" :label="$t('loans.markAsPaid')" color="positive" class="q-mb-md" />
            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="$t('loans.confirmPay')" :loading="confirmingInstallmentSaving" />
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
import { useLoanStore } from 'stores/loanStore'
import { useTransactionStore } from 'stores/transactionStore'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'
import LoanCard from 'components/LoanCard.vue'

const { t } = useI18n()
const $q = useQuasar()
const loanStore = useLoanStore()
const transactionStore = useTransactionStore()
const accountStore = useAccountStore()
const settings = useSettingsStore()

const activeTab = ref('receivable')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showPaymentDialog = ref(false)
const showDetailDialog = ref(false)
const saving = ref(false)
const editSaving = ref(false)
const editPaymentSaving = ref(false)
const paymentSaving = ref(false)
const payingLoan = ref(null)
const detailLoan = ref(null)
const editingLoanId = ref(null)
const showEditPaymentDialog = ref(false)
const editingPaymentIndex = ref(null)
const showDeletePaymentDialog = ref(false)
const deletingPayment = ref(null)
const deletingPaymentIndex = ref(null)
const showConfirmInstallmentDialog = ref(false)
const confirmingInstallment = ref(null)
const confirmingInstallmentIndex = ref(null)
const confirmInstallmentAmount = ref(null)
const confirmMarkAsPaid = ref(true)
const confirmingInstallmentSaving = ref(false)
const showAlreadyPaidDialog = ref(false)
const alreadyPaidInstallment = ref(null)
const alreadyPaidInstallmentIndex = ref(null)
const alreadyPaidAmount = ref(null)
const alreadyPaidSaving = ref(false)

const now = new Date()

const addForm = reactive({
  type: 'receivable',
  personName: '',
  amount: null,
  date: now.toISOString().slice(0, 10),
  notes: '',
  interestRate: null,
  installmentCount: null,
  installmentFrequency: 'monthly',
  accountId: null,
})

const editForm = reactive({
  personName: '',
  amount: null,
  date: now.toISOString().slice(0, 10),
  notes: '',
})

const editPaymentForm = reactive({
  amount: null,
  accountId: null,
  date: now.toISOString().slice(0, 10),
  notes: '',
})

const payForm = reactive({
  amount: null,
  accountId: null,
  date: now.toISOString().slice(0, 10),
  notes: '',
})

const accountOptions = computed(() =>
  accountStore.accounts.map((a) => ({
    label: `${a.name} (${settings.currency}${settings.formatNumber(a.balance || 0)})`,
    value: a.id,
  })),
)

const frequencyOptions = computed(() => [
  { label: t('loans.daily'), value: 'daily' },
  { label: t('loans.weekly'), value: 'weekly' },
  { label: t('loans.monthly'), value: 'monthly' },
  { label: t('loans.yearly'), value: 'yearly' },
])

const remainingAmount = computed(() => {
  if (!payingLoan.value) return 0
  return (payingLoan.value.amount || 0) - (payingLoan.value.paidAmount || 0)
})

const detailRemaining = computed(() => {
  if (!detailLoan.value) return 0
  const total = detailLoan.value.type === 'loan'
    ? (detailLoan.value.totalAmount || detailLoan.value.amount || 0)
    : (detailLoan.value.amount || 0)
  return total - (detailLoan.value.paidAmount || 0)
})

const progressValue = computed(() => {
  if (!detailLoan.value) return 0
  const total = detailLoan.value.type === 'loan'
    ? (detailLoan.value.totalAmount || detailLoan.value.amount || 0)
    : (detailLoan.value.amount || 0)
  if (!total) return 0
  return (detailLoan.value.paidAmount || 0) / total
})

const sortedPayments = computed(() => {
  if (!detailLoan.value?.payments) return []
  return [...detailLoan.value.payments].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
})

function onSwipe({ reset }, action, loan) {
  setTimeout(() => {
    if (action === 'edit') {
      openEditDialog(loan)
    } else if (action === 'delete') {
      confirmDelete(loan)
    }
  }, 300)
  setTimeout(() => {
    reset()
  }, 100)
}

function activeLoans(list) {
  return list.filter((l) => !l.settled)
}

function settledLoans(list) {
  return list.filter((l) => l.settled)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const locale = settings.language === 'bn' ? 'bn-BD' : 'en-US'
  return new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
}

function openAddDialog() {
  addForm.type = activeTab.value
  addForm.personName = ''
  addForm.amount = null
  addForm.date = new Date().toISOString().slice(0, 10)
  addForm.notes = ''
  addForm.interestRate = null
  addForm.installmentCount = null
  addForm.installmentFrequency = 'monthly'
  addForm.accountId = null
  showAddDialog.value = true
}

async function saveLoan() {
  if (!addForm.personName || !addForm.amount || addForm.amount <= 0) return
  saving.value = true
  try {
    await loanStore.addLoan({ ...addForm })
    $q.notify({ type: 'positive', message: t('loans.loanAdded'), position: 'top' })
    showAddDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

async function saveLoanEntry() {
  if (!addForm.personName || !addForm.amount || addForm.amount <= 0) return
  if (!addForm.installmentCount || addForm.installmentCount <= 0) return
  if (!addForm.accountId) return
  saving.value = true
  try {
    await loanStore.addLoanWithInstallments({
      personName: addForm.personName,
      amount: addForm.amount,
      interestRate: addForm.interestRate || 0,
      date: addForm.date,
      installmentCount: addForm.installmentCount,
      installmentFrequency: addForm.installmentFrequency,
      accountId: addForm.accountId,
      notes: addForm.notes,
    })
    $q.notify({ type: 'positive', message: t('loans.loanAdded'), position: 'top' })
    showAddDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  saving.value = false
}

function getFrequencyLabel(freq) {
  const map = { daily: t('loans.daily'), weekly: t('loans.weekly'), monthly: t('loans.monthly'), yearly: t('loans.yearly') }
  return map[freq] || freq
}

function openAlreadyPaidDialog(inst, idx) {
  alreadyPaidInstallment.value = inst
  alreadyPaidInstallmentIndex.value = idx
  alreadyPaidAmount.value = inst.amount
  showAlreadyPaidDialog.value = true
}

async function doMarkAlreadyPaid() {
  if (!alreadyPaidAmount.value || alreadyPaidAmount.value <= 0) return
  alreadyPaidSaving.value = true
  try {
    const loan = detailLoan.value
    const idx = alreadyPaidInstallmentIndex.value
    // Mark paid without touching any account or creating any transaction
    await loanStore.addInstallmentPayment(
      loan.id,
      idx,
      {
        amount: alreadyPaidAmount.value,
        accountId: null,
        date: new Date().toISOString().slice(0, 10),
        notes: t('loans.alreadyPaidNote'),
      },
      true, // always mark as paid
    )
    detailLoan.value = loanStore.loans.find((l) => l.id === loan.id)
    $q.notify({ type: 'positive', message: t('loans.installmentConfirmed'), position: 'top' })
    showAlreadyPaidDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  alreadyPaidSaving.value = false
}

function openConfirmInstallment(inst, idx) {
  confirmingInstallment.value = inst
  confirmingInstallmentIndex.value = idx
  const alreadyPaid = inst.paidAmount || 0
  const remaining = Math.max(0, inst.amount - alreadyPaid)
  confirmInstallmentAmount.value = remaining > 0 ? remaining : inst.amount
  confirmMarkAsPaid.value = true
  showConfirmInstallmentDialog.value = true
}

async function doConfirmInstallment() {
  if (!confirmInstallmentAmount.value || confirmInstallmentAmount.value <= 0) return
  confirmingInstallmentSaving.value = true
  try {
    const loan = detailLoan.value
    const amount = confirmInstallmentAmount.value
    const inst = confirmingInstallment.value

    const alreadyPaid = inst.paidAmount || 0
    const newTotal = alreadyPaid + amount
    const markAsPaid = confirmMarkAsPaid.value || newTotal >= inst.amount

    await loanStore.addInstallmentPayment(
      loan.id,
      confirmingInstallmentIndex.value,
      {
        amount,
        accountId: loan.accountId,
        date: new Date().toISOString().slice(0, 10),
        notes: '',
      },
      markAsPaid,
    )

    // Deduct from account
    await accountStore.updateBalance(loan.accountId, -amount)

    // Create expense transaction
    const txData = {
      type: 'expense',
      amount,
      category: t('loans.installmentPayment'),
      accountId: loan.accountId,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      notes: `${t('loans.installment')} #${inst.number} - ${loan.personName}`,
    }
    await transactionStore.addTransaction(txData)

    detailLoan.value = loanStore.loans.find((l) => l.id === loan.id)
    $q.notify({ type: 'positive', message: t('loans.installmentConfirmed'), position: 'top' })
    showConfirmInstallmentDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  confirmingInstallmentSaving.value = false
}

function openEditDialog(loan) {
  editingLoanId.value = loan.id
  editForm.personName = loan.personName
  editForm.amount = loan.amount
  editForm.date = loan.date
  editForm.notes = loan.notes || ''
  showEditDialog.value = true
}

async function updateLoan() {
  if (!editForm.personName || !editForm.amount || editForm.amount <= 0) return
  editSaving.value = true
  try {
    await loanStore.updateLoan(editingLoanId.value, {
      personName: editForm.personName,
      amount: editForm.amount,
      date: editForm.date,
      notes: editForm.notes,
    })
    // Refresh detail dialog if same loan is open
    if (showDetailDialog.value && detailLoan.value?.id === editingLoanId.value) {
      detailLoan.value = loanStore.loans.find((l) => l.id === editingLoanId.value)
    }
    $q.notify({ type: 'positive', message: t('loans.loanUpdated'), position: 'top' })
    showEditDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  editSaving.value = false
}

function openPaymentDialog(loan) {
  payingLoan.value = loan
  payForm.amount = null
  payForm.accountId = null
  payForm.date = new Date().toISOString().slice(0, 10)
  payForm.notes = ''
  showPaymentDialog.value = true
}

function openPaymentFromDetail() {
  openPaymentDialog(detailLoan.value)
}

async function savePayment() {
  if (!payForm.amount || payForm.amount <= 0 || !payForm.accountId) return
  paymentSaving.value = true
  try {
    const loan = payingLoan.value
    const isReceivable = loan.type === 'receivable'

    // Create transaction (income for receivable, expense for payable)
    const txData = {
      type: isReceivable ? 'income' : 'expense',
      amount: payForm.amount,
      category: isReceivable ? t('loans.loanRepayment') : t('loans.loanPayment'),
      accountId: payForm.accountId,
      date: payForm.date,
      time: new Date().toTimeString().slice(0, 5),
      notes: `${isReceivable ? t('loans.receivedFrom') : t('loans.paidTo')} ${loan.personName}${payForm.notes ? ' - ' + payForm.notes : ''}`,
    }
    await transactionStore.addTransaction(txData)

    // Update account balance
    const balanceChange = isReceivable ? payForm.amount : -payForm.amount
    await accountStore.updateBalance(payForm.accountId, balanceChange)

    // Record payment in loan (include accountId for later edit/refund)
    await loanStore.addPayment(loan.id, {
      amount: payForm.amount,
      date: payForm.date,
      notes: payForm.notes,
      accountId: payForm.accountId,
    })

    // Refresh detail if open
    if (showDetailDialog.value && detailLoan.value?.id === loan.id) {
      detailLoan.value = loanStore.loans.find((l) => l.id === loan.id)
    }

    $q.notify({ type: 'positive', message: t('loans.paymentRecorded'), position: 'top' })
    showPaymentDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  paymentSaving.value = false
}

function openDetail(loan) {
  detailLoan.value = loan
  showDetailDialog.value = true
}

function onEditPayment(payment, reset) {
  reset()
  const originalIndex = detailLoan.value.payments.findIndex((p) => p.createdAt === payment.createdAt)
  if (originalIndex < 0) return
  editingPaymentIndex.value = originalIndex
  editPaymentForm.amount = payment.amount
  editPaymentForm.accountId = payment.accountId || null
  editPaymentForm.date = payment.date
  editPaymentForm.notes = payment.notes || ''
  showEditPaymentDialog.value = true
}

async function saveEditedPayment() {
  if (!editPaymentForm.amount || editPaymentForm.amount <= 0) return
  editPaymentSaving.value = true
  try {
    const loan = detailLoan.value
    const oldPayment = loan.payments[editingPaymentIndex.value]
    const oldAmount = oldPayment?.amount || 0
    const newAmount = editPaymentForm.amount
    const diff = newAmount - oldAmount
    const oldAccountId = oldPayment?.accountId || null
    const newAccountId = editPaymentForm.accountId || null

    await loanStore.updatePayment(loan.id, editingPaymentIndex.value, {
      amount: newAmount,
      accountId: newAccountId,
      date: editPaymentForm.date,
      notes: editPaymentForm.notes,
    })

    // Adjust account balances
    const isReceivable = loan.type === 'receivable'
    if (oldAccountId && oldAccountId === newAccountId && diff !== 0) {
      // Same account, adjust by difference
      const balanceChange = isReceivable ? diff : -diff
      await accountStore.updateBalance(oldAccountId, balanceChange)
    } else {
      // Different accounts: reverse old, apply new
      if (oldAccountId) {
        const reverseChange = isReceivable ? -oldAmount : oldAmount
        await accountStore.updateBalance(oldAccountId, reverseChange)
      }
      if (newAccountId) {
        const applyChange = isReceivable ? newAmount : -newAmount
        await accountStore.updateBalance(newAccountId, applyChange)
      }
    }

    detailLoan.value = loanStore.loans.find((l) => l.id === loan.id)
    $q.notify({ type: 'positive', message: t('loans.paymentUpdated'), position: 'top' })
    showEditPaymentDialog.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
  }
  editPaymentSaving.value = false
}

function onDeletePayment(payment, reset) {
  reset()
  const originalIndex = detailLoan.value.payments.findIndex((p) => p.createdAt === payment.createdAt)
  if (originalIndex < 0) return
  deletingPayment.value = payment
  deletingPaymentIndex.value = originalIndex
  showDeletePaymentDialog.value = true
}

async function deletePaymentOnly() {
  if (deletingPaymentIndex.value == null) return
  showDeletePaymentDialog.value = false
  await loanStore.deletePayment(detailLoan.value.id, deletingPaymentIndex.value)
  detailLoan.value = loanStore.loans.find((l) => l.id === detailLoan.value.id)
  $q.notify({ type: 'positive', message: t('loans.paymentDeleted'), position: 'top' })
  deletingPayment.value = null
  deletingPaymentIndex.value = null
}

async function deletePaymentWithRefund() {
  if (deletingPaymentIndex.value == null) return
  showDeletePaymentDialog.value = false
  const payment = deletingPayment.value
  const loan = detailLoan.value
  const isReceivable = loan.type === 'receivable'

  await loanStore.deletePayment(loan.id, deletingPaymentIndex.value)

  // Reverse account balance
  if (payment.accountId) {
    const reverseChange = isReceivable ? -payment.amount : payment.amount
    await accountStore.updateBalance(payment.accountId, reverseChange)
  }

  detailLoan.value = loanStore.loans.find((l) => l.id === loan.id)
  $q.notify({ type: 'positive', message: t('loans.paymentDeleted'), position: 'top' })
  deletingPayment.value = null
  deletingPaymentIndex.value = null
}

function cancelDeletePayment() {
  showDeletePaymentDialog.value = false
  deletingPayment.value = null
  deletingPaymentIndex.value = null
}

function confirmDelete(loan) {
  $q.dialog({
    title: t('loans.deleteLoan'),
    message: `"${loan.personName}" - ${settings.currency}${settings.formatNumber(loan.amount)} ${t('loans.deleteConfirm')}`,
    ok: { label: t('common.delete'), color: 'negative', flat: true },
    cancel: { label: t('common.cancel'), flat: true },
  }).onOk(async () => {
    await loanStore.deleteLoan(loan.id)
    if (showDetailDialog.value && detailLoan.value?.id === loan.id) {
      showDetailDialog.value = false
    }
    $q.notify({ type: 'positive', message: t('loans.loanDeleted'), position: 'top' })
  })
}

onMounted(() => {
  loanStore.listenLoans()
  accountStore.listenAccounts()
  transactionStore.listenTransactions()
})

onUnmounted(() => {
  loanStore.stopListening()
  accountStore.stopListening()
  transactionStore.stopListening()
})
</script>
