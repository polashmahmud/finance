<template>
    <q-page class="q-pa-md q-pb-xl">
        <!-- Month Filter -->
        <div class="row items-center justify-center q-mb-md">
            <q-btn flat round dense icon="chevron_left" color="dark" @click="goToPrevMonth" :disable="!canGoPrev" />
            <div class="cursor-pointer q-mx-sm text-center" style="min-width: 180px" @click="monthPickerOpen = true">
                <div class="text-subtitle1 text-weight-bold row items-center justify-center q-gutter-xs">
                    <span>{{ currentMonthLabel }}</span>
                    <q-icon name="calendar_month" size="20px" color="dark" />
                </div>
            </div>
            <q-btn flat round dense icon="chevron_right" color="dark" @click="goToNextMonth" :disable="!canGoNext" />
        </div>

        <!-- Month Picker Dialog -->
        <q-dialog v-model="monthPickerOpen" transition-show="scale" transition-hide="scale">
            <q-card style="min-width: 300px; border-radius: 16px;">
                <q-card-section class="row items-center justify-between q-pb-sm">
                    <div class="text-subtitle1 text-weight-bold">{{ $t('allTransactions.selectMonth') }}</div>
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-card-section class="q-pt-none">
                    <q-btn flat no-caps class="full-width q-mb-sm" :color="selectedMonth === 'all' ? 'dark' : 'grey-7'"
                        :class="{ 'bg-grey-2': selectedMonth === 'all' }"
                        @click="selectedMonth = 'all'; monthPickerOpen = false">
                        {{ $t('allTransactions.allTime') }}
                    </q-btn>
                    <q-date v-model="pickerMonth" emit-immediately minimal years-in-month-view default-view="Months"
                        @update:model-value="onPickerMonthSelect" mask="YYYY/MM" />
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Type Filter -->
        <div class="row q-gutter-sm q-mb-md">
            <q-chip v-for="f in typeFilters" :key="f.value" :selected="selectedType === f.value"
                :color="selectedType === f.value ? 'dark' : 'grey-3'"
                :text-color="selectedType === f.value ? 'white' : 'dark'" clickable @click="selectedType = f.value"
                dense>
                {{ f.label }}
            </q-chip>
        </div>

        <!-- Summary -->
        <div class="row q-gutter-sm q-mb-md" v-if="filteredTransactions.length">
            <q-chip color="green-1" text-color="green-9" icon="trending_up" dense>
                {{ $t('common.income') }}: {{ settings.currency }}{{ formatNumber(filteredIncome) }}
            </q-chip>
            <q-chip color="red-1" text-color="red-9" icon="trending_down" dense>
                {{ $t('common.expense') }}: {{ settings.currency }}{{ formatNumber(filteredExpense) }}
            </q-chip>
        </div>

        <!-- Transaction List -->
        <q-card class="finance-card" v-if="filteredTransactions.length">
            <q-list separator>
                <q-slide-item v-for="tx in filteredTransactions" :key="tx.id" @left="({ reset }) => onEditTx(tx, reset)"
                    @right="({ reset }) => onDeleteTx(tx.id, reset)">
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
                            <q-avatar :style="{ background: getCategoryColor(tx.category) + '20' }" size="40px">
                                <q-icon :name="getCategoryIcon(tx.category)"
                                    :style="{ color: getCategoryColor(tx.category) }" size="20px" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="text-weight-medium">{{ tx.category || $t('common.transfer')
                                }}</q-item-label>
                            <q-item-label caption>{{ tx.notes }} &middot; {{ tx.date }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-item-label
                                :class="tx.type === 'income' ? 'amount-income' : tx.type === 'expense' ? 'amount-expense' : 'text-blue'"
                                class="transaction-amount">
                                {{ tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : '' }}{{ settings.currency
                                }}{{
                                    formatNumber(tx.amount) }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-slide-item>
            </q-list>
        </q-card>

        <!-- Empty State -->
        <div v-else class="text-center text-grey q-pa-xl">
            <q-icon name="receipt_long" size="56px" class="q-mb-md" />
            <div class="text-body1">{{ $t('dashboard.noTransactionsYet') }}</div>
        </div>

        <!-- Edit Dialog -->
        <q-dialog v-model="editDialogOpen" position="bottom" transition-show="slide-up" transition-hide="slide-down">
            <q-card style="border-top-left-radius: 28px; border-top-right-radius: 28px; width: 100%; max-width: 500px;">
                <q-card-section class="row items-center justify-between">
                    <div class="text-h6 text-weight-bold">{{ $t('allTransactions.editTransaction') }}</div>
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-form @submit.prevent="saveEdit">
                        <!-- Amount -->
                        <q-input v-model.number="editForm.amount" :label="$t('common.amount')" type="number" outlined
                            color="dark" :prefix="settings.currency"
                            :rules="[val => val > 0 || $t('common.validAmount')]" input-class="text-h6 text-weight-bold"
                            class="q-mb-sm" />

                        <!-- Category (for income/expense) -->
                        <q-select v-if="editForm.type !== 'transfer'" v-model="editForm.category"
                            :options="editForm.type === 'income' ? incomeCategoryOptions : expenseCategoryOptions"
                            :label="$t('common.category')" outlined color="dark" emit-value map-options class="q-mb-sm">
                            <template v-slot:option="scope">
                                <q-item v-bind="scope.itemProps">
                                    <q-item-section avatar>
                                        <q-avatar :style="{ background: scope.opt.color + '18' }" size="32px">
                                            <q-icon :name="scope.opt.icon" :style="{ color: scope.opt.color }"
                                                size="16px" />
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>

                        <!-- Account (for income/expense) -->
                        <q-select v-if="editForm.type !== 'transfer'" v-model="editForm.accountId"
                            :options="accountOptions" :label="$t('common.account')" outlined color="dark" emit-value
                            map-options class="q-mb-sm" />

                        <!-- Date & Time -->
                        <div class="row q-col-gutter-md q-mb-sm">
                            <div class="col-6">
                                <q-input v-model="editForm.date" :label="$t('common.date')" outlined color="dark"
                                    readonly>
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
                                <q-input v-model="editForm.time" :label="$t('common.time')" outlined color="dark"
                                    readonly>
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

                        <!-- Notes -->
                        <q-input v-model="editForm.notes" :label="$t('common.noteOptional')" outlined color="dark"
                            type="textarea" rows="2" class="q-mb-sm" />

                        <!-- Submit -->
                        <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded
                            unelevated size="lg" icon="check" :label="$t('common.update')" :loading="saving" />
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
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useAccountStore } from 'stores/accountStore'
import { useSettingsStore } from 'stores/settingsStore'

const { t, locale } = useI18n()
const $q = useQuasar()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const accounts = useAccountStore()
const settings = useSettingsStore()

const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const selectedType = ref('all')
const editDialogOpen = ref(false)
const monthPickerOpen = ref(false)
const saving = ref(false)

// Picker month value in YYYY/MM format
const pickerMonth = ref(new Date().toISOString().slice(0, 7).replace('-', '/'))

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

const typeFilters = computed(() => [
    { label: t('allTransactions.all'), value: 'all' },
    { label: t('common.income'), value: 'income' },
    { label: t('common.expense'), value: 'expense' },
    { label: t('common.transfer'), value: 'transfer' },
])

const availableMonths = computed(() => {
    const months = new Set()
    transactions.transactions.forEach((tx) => {
        if (tx.date) {
            months.add(tx.date.slice(0, 7)) // YYYY-MM
        }
    })
    return [...months].sort((a, b) => b.localeCompare(a))
})

const sortedMonthsAsc = computed(() => [...availableMonths.value].sort())

const currentMonthLabel = computed(() => {
    if (selectedMonth.value === 'all') return t('allTransactions.allTime')
    const [y, mo] = selectedMonth.value.split('-')
    const date = new Date(Number(y), Number(mo) - 1)
    return date.toLocaleDateString(locale.value === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
    })
})

const currentMonthIndex = computed(() => {
    if (selectedMonth.value === 'all') return -1
    return sortedMonthsAsc.value.indexOf(selectedMonth.value)
})

const canGoPrev = computed(() => {
    if (selectedMonth.value === 'all') return false
    return currentMonthIndex.value > 0
})

const canGoNext = computed(() => {
    if (selectedMonth.value === 'all') return sortedMonthsAsc.value.length > 0
    return currentMonthIndex.value < sortedMonthsAsc.value.length - 1
})

function goToPrevMonth() {
    if (selectedMonth.value === 'all') return
    const idx = currentMonthIndex.value
    if (idx === 0) {
        selectedMonth.value = 'all'
    } else if (idx > 0) {
        selectedMonth.value = sortedMonthsAsc.value[idx - 1]
        pickerMonth.value = selectedMonth.value.replace('-', '/')
    }
}

function goToNextMonth() {
    if (selectedMonth.value === 'all') {
        // Go to first available month
        if (sortedMonthsAsc.value.length > 0) {
            selectedMonth.value = sortedMonthsAsc.value[0]
            pickerMonth.value = selectedMonth.value.replace('-', '/')
        }
        return
    }
    const idx = currentMonthIndex.value
    if (idx < sortedMonthsAsc.value.length - 1) {
        selectedMonth.value = sortedMonthsAsc.value[idx + 1]
        pickerMonth.value = selectedMonth.value.replace('-', '/')
    }
}

function onPickerMonthSelect(val) {
    if (val) {
        selectedMonth.value = val.replace('/', '-')
        pickerMonth.value = val
    }
    monthPickerOpen.value = false
}

const filteredTransactions = computed(() => {
    let list = [...transactions.transactions]

    // Month filter
    if (selectedMonth.value !== 'all') {
        list = list.filter((tx) => tx.date && tx.date.startsWith(selectedMonth.value))
    }

    // Type filter
    if (selectedType.value !== 'all') {
        list = list.filter((tx) => tx.type === selectedType.value)
    }

    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
})

const filteredIncome = computed(() =>
    filteredTransactions.value
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
)

const filteredExpense = computed(() =>
    filteredTransactions.value
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
)

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
        label: `${a.name} (${settings.currency}${Number(a.balance || 0).toLocaleString()})`,
        value: a.id,
    })),
)

function getCategoryColor(categoryName) {
    const all = [...categories.incomeCategories, ...categories.expenseCategories]
    return all.find((c) => c.name === categoryName)?.color || '#757575'
}

function getCategoryIcon(categoryName) {
    const all = [...categories.incomeCategories, ...categories.expenseCategories]
    return all.find((c) => c.name === categoryName)?.icon || 'receipt'
}

function formatNumber(n) {
    return Number(n || 0).toLocaleString()
}

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

        // Adjust account balances if amount or account changed (income/expense only)
        if (editForm.type === 'income' || editForm.type === 'expense') {
            const sign = editForm.type === 'income' ? 1 : -1
            const oldAmount = editForm.originalAmount || 0
            const newAmount = editForm.amount

            // Revert old amount from old account
            if (editForm.originalAccountId) {
                await accounts.updateBalance(editForm.originalAccountId, -sign * oldAmount)
            }

            // Apply new amount to new account
            if (editForm.accountId) {
                await accounts.updateBalance(editForm.accountId, sign * newAmount)
            }
        }

        await transactions.updateTransaction(editForm.id, updateData)
        $q.notify({ type: 'positive', message: t('allTransactions.transactionUpdated'), position: 'top' })
        editDialogOpen.value = false
    } catch (err) {
        $q.notify({ type: 'negative', message: t('common.error') + err.message, position: 'top' })
    }
    saving.value = false
}

function onDeleteTx(id, reset) {
    transactions.deleteTransaction(id)
    reset()
}

onMounted(() => {
    accounts.listenAccounts()
    categories.listenCategories()
    transactions.listenTransactions()
})

onUnmounted(() => {
    accounts.stopListening()
    categories.stopListening()
    transactions.stopListening()
})
</script>
