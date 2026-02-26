<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <div class="text-h5 text-weight-bold">রিপোর্ট</div>
      <div class="text-caption text-grey">বিশ্লেষণ ও পরিসংখ্যান</div>
    </div>

    <!-- Loading -->
    <div v-if="transactions.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <template v-else>
      <!-- Summary Chips -->
      <div class="row q-col-gutter-sm q-mb-md">
        <div class="col-auto">
          <q-chip color="dark" text-color="white" icon="trending_up" class="q-ma-none shadow-1">
            আয় {{ settings.currency }}{{ formatShort(transactions.totalIncome) }}
          </q-chip>
        </div>
        <div class="col-auto">
          <q-chip color="dark" text-color="white" icon="trending_down" class="q-ma-none shadow-1">
            ব্যয় {{ settings.currency }}{{ formatShort(transactions.totalExpense) }}
          </q-chip>
        </div>
        <div class="col-auto">
          <q-chip color="dark" text-color="white" icon="savings" class="q-ma-none shadow-1">
            সঞ্চয় {{ settings.currency }}{{ formatShort(netSavings) }}
          </q-chip>
        </div>
      </div>

      <!-- Report Tabs -->
      <q-card class="finance-card q-mb-md">
        <q-tabs v-model="reportTab" dense active-color="dark" indicator-color="dark" class="text-grey-6"
          align="justify">
          <q-tab name="overview" label="সারসংক্ষেপ" />
          <q-tab name="category" label="ক্যাটাগরি" />
          <q-tab name="budget" label="বাজেট" />
          <q-tab name="trend" label="প্রবণতা" />
        </q-tabs>
      </q-card>

      <q-tab-panels v-model="reportTab" animated class="bg-transparent">
        <!-- Overview -->
        <q-tab-panel name="overview" class="q-pa-none">
          <q-card class="finance-card q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 text-weight-bold q-mb-md">মাসিক আয় বনাম ব্যয়</div>
              <div class="row q-gutter-md q-mb-md">
                <div class="col">
                  <div class="text-center">
                    <q-circular-progress :value="incomePercent" size="90px" :thickness="0.2" color="positive"
                      track-color="grey-3" show-value>
                      <span class="text-weight-bold text-positive">{{ incomePercent }}%</span>
                    </q-circular-progress>
                    <div class="text-caption q-mt-sm">আয়</div>
                    <div class="text-weight-bold text-positive">{{ settings.currency }}{{
                      formatNumber(transactions.totalIncome) }}</div>
                  </div>
                </div>
                <div class="col">
                  <div class="text-center">
                    <q-circular-progress :value="expensePercent" size="90px" :thickness="0.2" color="negative"
                      track-color="grey-3" show-value>
                      <span class="text-weight-bold text-negative">{{ expensePercent }}%</span>
                    </q-circular-progress>
                    <div class="text-caption q-mt-sm">ব্যয়</div>
                    <div class="text-weight-bold text-negative">{{ settings.currency }}{{
                      formatNumber(transactions.totalExpense) }}</div>
                  </div>
                </div>
              </div>
              <q-separator class="q-mb-md" />
              <div class="row justify-between">
                <span class="text-weight-medium">নিট সঞ্চয়</span>
                <span :class="netSavings >= 0 ? 'text-positive' : 'text-negative'" class="text-weight-bold">
                  {{ settings.currency }}{{ formatNumber(netSavings) }}
                </span>
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- Category Breakdown -->
        <q-tab-panel name="category" class="q-pa-none">
          <q-card class="finance-card q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 text-weight-bold q-mb-md">ক্যাটাগরি অনুযায়ী ব্যয়</div>
              <div v-if="!categoryBreakdown.length" class="text-center text-grey q-pa-md">
                <q-icon name="pie_chart" size="40px" class="q-mb-sm" />
                <div>কোনো ব্যয়ের ডাটা নেই</div>
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
                    <span class="text-weight-bold">{{ settings.currency }}{{ formatNumber(cat.spent) }}</span>
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
              <div class="text-subtitle2 text-weight-bold q-mb-md">বাজেট বনাম প্রকৃত ব্যয়</div>
              <div v-if="!budgetComparison.length" class="text-center text-grey q-pa-md">
                <q-icon name="account_balance_wallet" size="40px" class="q-mb-sm" />
                <div>কোনো বাজেট সেট করা হয়নি</div>
              </div>
              <div v-for="cat in budgetComparison" :key="cat.name" class="q-mb-lg">
                <div class="row justify-between items-center q-mb-xs">
                  <span class="text-body2 text-weight-medium">{{ cat.name }}</span>
                  <span class="text-caption" :class="cat.over ? 'text-negative' : 'text-grey'">
                    {{ settings.currency }}{{ formatNumber(cat.spent) }} / {{ settings.currency }}{{
                      formatNumber(cat.budget) }}
                  </span>
                </div>
                <q-linear-progress :value="Math.min(cat.usage, 1)"
                  :color="cat.over ? 'negative' : cat.usage > 0.8 ? 'warning' : 'dark'" rounded size="10px"
                  track-color="grey-3" />
                <div v-if="cat.over" class="text-caption text-negative q-mt-xs">
                  বাজেটের চেয়ে {{ settings.currency }}{{ formatNumber(cat.spent - cat.budget) }} বেশি খরচ
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- Trend -->
        <q-tab-panel name="trend" class="q-pa-none">
          <q-card class="finance-card q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 text-weight-bold q-mb-md">আয় বনাম ব্যয়ের প্রবণতা (গত ৭ দিন)</div>
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
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'
import VueApexCharts from 'vue3-apexcharts'

const transactions = useTransactionStore()
const categories = useCategoryStore()
const settings = useSettingsStore()
const reportTab = ref('overview')

const total = computed(() => transactions.totalIncome + transactions.totalExpense || 1)
const incomePercent = computed(() => Math.round((transactions.totalIncome / total.value) * 100))
const expensePercent = computed(() => Math.round((transactions.totalExpense / total.value) * 100))
const netSavings = computed(() => transactions.totalIncome - transactions.totalExpense)

function formatShort(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

// Category breakdown
const categoryBreakdown = computed(() => {
  const totalExp = transactions.totalExpense || 1
  const catMap = {}

  transactions.transactions
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
    .filter((c) => c.budget)
    .map((cat) => {
      const spent = transactions.transactions
        .filter((t) => t.type === 'expense' && t.category === cat.name)
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      const usage = spent / cat.budget
      return {
        name: cat.name,
        budget: cat.budget,
        spent,
        usage,
        over: spent > cat.budget,
      }
    }),
)

// Chart Data Helpers
const dayNamesBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি']

const chartData = computed(() => {
  const categories = []
  const incomeData = []
  const expenseData = []

  // Ensure transactions are loaded
  if (transactions.loading) return { categories, incomeData, expenseData }

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

    categories.push(dayNamesBn[d.getDay()])
    incomeData.push(dailyIncome)
    expenseData.push(dailyExpense)
  }

  return { categories, incomeData, expenseData }
})

const chartSeries = computed(() => [
  { name: 'আয়', data: chartData.value.incomeData },
  { name: 'ব্যয়', data: chartData.value.expenseData }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'Tiro Bangla, sans-serif'
  },
  colors: ['#21BA45', '#C10015'], // positive and negative quasar colors
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: {
    categories: chartData.value.categories,
    tooltip: { enabled: false }
  },
  yaxis: {
    labels: {
      formatter: (value) => settings.currency + value.toLocaleString()
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

function formatNumber(n) {
  return Number(n || 0).toLocaleString()
}

onMounted(() => {
  transactions.listenTransactions()
  categories.listenCategories()
})

onUnmounted(() => {
  transactions.stopListening()
  categories.stopListening()
})
</script>
