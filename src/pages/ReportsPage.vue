<template>
  <q-page class="page-container">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="page-title">{{ $t('reports.title') }}</div>
        <div class="page-subtitle">{{ $t('reports.subtitle') }}</div>
      </div>

      <q-btn flat no-caps class="finance-card q-px-md text-weight-medium bg-white" style="border-radius: 12px">
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="calendar_month" size="18px" style="color: #1a1a2e" />
          <span style="color: #1a1a2e">{{ displayMonth }}</span>
          <q-icon name="arrow_drop_down" size="18px" color="grey-7" />
        </div>
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="currentMonth" mask="YYYY-MM" minimal emit-immediately default-view="Months"
            years-in-month-view />
        </q-popup-proxy>
      </q-btn>
    </div>

    <!-- Loading -->
    <div v-if="transactions.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <template v-else>
      <!-- Summary Chips -->
      <div class="row q-col-gutter-sm q-mb-md" style="flex-wrap: wrap;">
        <div class="col-auto">
          <div class="summary-chip summary-chip-income">
            <q-icon name="trending_up" size="16px" />
            {{ $t('common.income') }} {{ settings.currency }}{{ settings.formatNumber(totalIncome) }}
          </div>
        </div>
        <div class="col-auto">
          <div class="summary-chip summary-chip-expense">
            <q-icon name="trending_down" size="16px" />
            {{ $t('common.expense') }} {{ settings.currency }}{{ settings.formatNumber(totalExpense) }}
          </div>
        </div>
        <div class="col-auto">
          <div class="summary-chip summary-chip-neutral">
            <q-icon name="savings" size="16px" />
            {{ $t('reports.savings') }} {{ settings.currency }}{{ settings.formatNumber(netSavings) }}
          </div>
        </div>
      </div>

      <!-- Report Tabs -->
      <q-card class="finance-card tab-card q-mb-md">
        <q-tabs v-model="reportTab" dense active-color="dark" indicator-color="dark" class="text-grey-6"
          align="justify" no-caps>
          <q-tab name="overview" :label="$t('reports.overview')" />
          <q-tab name="category" :label="$t('reports.categoryTab')" />
          <q-tab name="budget" :label="$t('reports.budget')" />
          <q-tab name="trend" :label="$t('reports.trend')" />
        </q-tabs>
      </q-card>

      <q-tab-panels v-model="reportTab" animated class="bg-transparent">
        <!-- Overview -->
        <q-tab-panel name="overview" class="q-pa-none">
          <q-card class="finance-card q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 text-weight-bold q-mb-md">{{ $t('reports.monthlyIncomeVsExpense') }}</div>
              <div class="row q-gutter-md q-mb-md">
                <div class="col">
                  <div class="text-center">
                    <q-circular-progress :value="incomePercent" size="90px" :thickness="0.2" color="positive"
                      track-color="grey-3" show-value>
                      <span class="text-weight-bold text-positive">{{ incomePercent }}%</span>
                    </q-circular-progress>
                    <div class="text-caption q-mt-sm">{{ $t('common.income') }}</div>
                    <div class="text-weight-bold text-positive">{{ settings.currency }}{{
                      settings.formatNumber(totalIncome) }}</div>
                  </div>
                </div>
                <div class="col">
                  <div class="text-center">
                    <q-circular-progress :value="expensePercent" size="90px" :thickness="0.2" color="negative"
                      track-color="grey-3" show-value>
                      <span class="text-weight-bold text-negative">{{ expensePercent }}%</span>
                    </q-circular-progress>
                    <div class="text-caption q-mt-sm">{{ $t('common.expense') }}</div>
                    <div class="text-weight-bold text-negative">{{ settings.currency }}{{
                      settings.formatNumber(totalExpense) }}</div>
                  </div>
                </div>
              </div>
              <q-separator class="q-mb-md" />
              <div class="row justify-between">
                <span class="text-weight-medium">{{ $t('reports.netSavings') }}</span>
                <span :class="netSavings >= 0 ? 'text-positive' : 'text-negative'" class="text-weight-bold">
                  {{ settings.currency }}{{ settings.formatNumber(netSavings) }}
                </span>
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- Category Breakdown -->
        <q-tab-panel name="category" class="q-pa-none">
          <q-card class="finance-card q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 text-weight-bold q-mb-md">{{ $t('reports.categoryBreakdown') }}</div>
              <div v-if="!categoryBreakdown.length" class="text-center text-grey q-pa-md">
                <q-icon name="pie_chart" size="40px" class="q-mb-sm" />
                <div>{{ $t('reports.noExpenseData') }}</div>
              </div>
              <div v-for="cat in categoryBreakdown" :key="cat.name" class="q-mb-md">
                <div class="row justify-between items-center q-mb-xs">
                  <div class="row items-center q-gutter-sm">
                    <q-avatar :style="{ background: cat.color + '18' }" size="32px">
                      <q-icon :name="cat.icon" :style="{ color: cat.color }" size="16px" />
                    </q-avatar>
                    <span class="text-body2 text-weight-medium">{{ cat.name }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-weight-bold">{{ settings.currency }}{{ settings.formatNumber(cat.spent) }}</span>
                    <q-badge color="dark" class="q-ml-sm">{{ cat.percent }}%</q-badge>
                  </div>
                </div>
                <q-linear-progress :value="cat.percent / 100" color="dark" rounded size="6px" track-color="grey-3" />
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- Budget vs Actual -->
        <q-tab-panel name="budget" class="q-pa-none">
          <q-card class="finance-card q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 text-weight-bold q-mb-md">{{ $t('reports.budgetVsActual') }}</div>
              <div v-if="!budgetComparison.length" class="text-center text-grey q-pa-md">
                <q-icon name="account_balance_wallet" size="40px" class="q-mb-sm" />
                <div>{{ $t('reports.noBudgetSet') }}</div>
              </div>
              <div v-for="cat in budgetComparison" :key="cat.name" class="q-mb-lg">
                <div class="row justify-between items-center q-mb-xs">
                  <span class="text-body2 text-weight-medium">{{ cat.name }}</span>
                  <span class="text-caption" :class="cat.over ? 'text-negative' : 'text-grey'">
                    {{ settings.currency }}{{ settings.formatNumber(cat.spent) }} / {{ settings.currency }}{{
                      settings.formatNumber(cat.budget) }}
                  </span>
                </div>
                <q-linear-progress :value="Math.min(cat.usage, 1)"
                  :color="cat.over ? 'negative' : cat.usage > 0.8 ? 'warning' : 'dark'" rounded size="10px"
                  track-color="grey-3" />
                <div v-if="cat.over" class="text-caption text-negative q-mt-xs">
                  {{ $t('reports.overBudget', {
                    amount: settings.currency + settings.formatNumber(cat.spent -
                      cat.budget)
                  }) }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- Trend -->
        <q-tab-panel name="trend" class="q-pa-none">
          <q-card class="finance-card q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 text-weight-bold q-mb-md">{{ $t('reports.trendTitle') }}</div>
              <div style="min-height: 250px">
                <vue-apex-charts type="area" height="250" :options="chartOptions" :series="chartSeries" />
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'
import VueApexCharts from 'vue3-apexcharts'
import { date } from 'quasar'

const { t } = useI18n()
const transactions = useTransactionStore()
const categories = useCategoryStore()
const settings = useSettingsStore()
const reportTab = ref('overview')

const now = new Date()
const currentMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)

const displayMonth = computed(() => {
  if (!currentMonth.value) return ''
  const parts = currentMonth.value.split('-')
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1)
  return date.formatDate(d, 'MMMM YYYY')
})

const totalIncome = computed(() => {
  return transactions.transactions
    .filter(t => t.type === 'income' && t.date && t.date.startsWith(currentMonth.value))
    .reduce((sum, t) => sum + (t.amount || 0), 0)
})

const totalExpense = computed(() => {
  return transactions.transactions
    .filter(t => t.type === 'expense' && t.date && t.date.startsWith(currentMonth.value))
    .reduce((sum, t) => sum + (t.amount || 0), 0)
})

const total = computed(() => totalIncome.value + totalExpense.value || 1)
const incomePercent = computed(() => Math.round((totalIncome.value / total.value) * 100))
const expensePercent = computed(() => Math.round((totalExpense.value / total.value) * 100))
const netSavings = computed(() => totalIncome.value - totalExpense.value)

// Category breakdown
const categoryBreakdown = computed(() => {
  const currentTxs = transactions.transactions.filter(
    (t) => t.date && t.date.startsWith(currentMonth.value)
  )

  const currentTotalExpense = currentTxs
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const totalExp = currentTotalExpense || 1
  const catMap = {}

  currentTxs
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!catMap[t.category]) catMap[t.category] = 0
      catMap[t.category] += t.amount
    })

  return Object.entries(catMap)
    .map(([name, spent]) => {
      const cat = categories.expenseCategories.find((c) => c.name === name)
      const percent = Math.round((spent / totalExp) * 100)
      return {
        name,
        spent,
        percent,
        icon: cat?.icon || 'category',
        color: cat?.color || '#111111',
      }
    })
    .sort((a, b) => b.spent - a.spent)
})

// Budget comparison
const budgetComparison = computed(() =>
  categories.expenseCategories
    .filter((c) => c.budgets && c.budgets[currentMonth.value])
    .map((cat) => {
      const budgetAmount = cat.budgets[currentMonth.value]
      const spent = transactions.transactions
        .filter((t) => t.type === 'expense' && t.category === cat.name && t.date && t.date.startsWith(currentMonth.value))
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      const usage = spent / budgetAmount
      return {
        name: cat.name,
        budget: budgetAmount,
        spent,
        usage,
        over: spent > budgetAmount,
      }
    }),
)

// Chart Data Helpers
const dayNames = computed(() => [
  t('reports.sun'), t('reports.mon'), t('reports.tue'), t('reports.wed'),
  t('reports.thu'), t('reports.fri'), t('reports.sat')
])

const chartData = computed(() => {
  const cats = []
  const incomeData = []
  const expenseData = []

  if (transactions.loading) return { categories: cats, incomeData, expenseData }

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)

    const dailyIncome = transactions.transactions
      .filter((t) => t.type === 'income' && t.date === dateStr)
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    const dailyExpense = transactions.transactions
      .filter((t) => t.type === 'expense' && t.date === dateStr)
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    cats.push(dayNames.value[d.getDay()])
    incomeData.push(dailyIncome)
    expenseData.push(dailyExpense)
  }

  return { categories: cats, incomeData, expenseData }
})

const chartSeries = computed(() => [
  { name: t('common.income'), data: chartData.value.incomeData },
  { name: t('common.expense'), data: chartData.value.expenseData }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'Tiro Bangla, sans-serif'
  },
  colors: ['#21BA45', '#C10015'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: {
    categories: chartData.value.categories,
    tooltip: { enabled: false }
  },
  yaxis: {
    labels: {
      formatter: (value) => settings.currency + settings.formatNumber(value)
    }
  },
  legend: { position: 'top', horizontalAlign: 'left' },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 90, 100]
    }
  }
}))


onMounted(() => {
  transactions.listenTransactions()
  categories.listenCategories()
})

onUnmounted(() => {
  transactions.stopListening()
  categories.stopListening()
})
</script>
