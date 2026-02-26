<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <div class="text-h5 text-weight-bold">Reports</div>
      <div class="text-caption text-grey">Insights & Analytics</div>
    </div>

    <!-- Report Tabs -->
    <q-tabs v-model="reportTab" dense active-color="primary" indicator-color="primary" class="q-mb-md" align="justify">
      <q-tab name="overview" label="Overview" />
      <q-tab name="category" label="Category" />
      <q-tab name="budget" label="Budget" />
      <q-tab name="trend" label="Trend" />
    </q-tabs>

    <q-tab-panels v-model="reportTab" animated>
      <!-- Overview -->
      <q-tab-panel name="overview" class="q-pa-none">
        <!-- Income vs Expense -->
        <q-card class="finance-card q-mb-md">
          <q-card-section>
            <div class="text-subtitle2 text-weight-bold q-mb-md">Monthly Income vs Expense</div>
            <div class="row q-gutter-md q-mb-md">
              <div class="col">
                <div class="text-center">
                  <q-circular-progress
                    :value="incomePercent"
                    size="90px"
                    :thickness="0.2"
                    color="positive"
                    track-color="grey-3"
                    show-value
                  >
                    <span class="text-weight-bold text-positive">{{ incomePercent }}%</span>
                  </q-circular-progress>
                  <div class="text-caption q-mt-sm">Income</div>
                  <div class="text-weight-bold text-positive">{{ settings.currency }}{{ formatNumber(transactions.totalIncome) }}</div>
                </div>
              </div>
              <div class="col">
                <div class="text-center">
                  <q-circular-progress
                    :value="expensePercent"
                    size="90px"
                    :thickness="0.2"
                    color="negative"
                    track-color="grey-3"
                    show-value
                  >
                    <span class="text-weight-bold text-negative">{{ expensePercent }}%</span>
                  </q-circular-progress>
                  <div class="text-caption q-mt-sm">Expense</div>
                  <div class="text-weight-bold text-negative">{{ settings.currency }}{{ formatNumber(transactions.totalExpense) }}</div>
                </div>
              </div>
            </div>
            <q-separator class="q-mb-md" />
            <div class="row justify-between">
              <span class="text-weight-medium">Net Savings</span>
              <span :class="netSavings >= 0 ? 'text-positive' : 'text-negative'" class="text-weight-bold">
                {{ settings.currency }}{{ formatNumber(netSavings) }}
              </span>
            </div>
          </q-card-section>
        </q-card>

        <!-- Smart Insights -->
        <q-card class="finance-card q-mb-md">
          <q-card-section>
            <div class="text-subtitle2 text-weight-bold q-mb-md">
              <q-icon name="lightbulb" color="accent" class="q-mr-sm" />
              Smart Insights
            </div>
            <q-list dense>
              <q-item v-for="(insight, index) in insights" :key="index">
                <q-item-section avatar>
                  <q-icon :name="insight.icon" :color="insight.color" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-body2">{{ insight.text }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Category Breakdown -->
      <q-tab-panel name="category" class="q-pa-none">
        <q-card class="finance-card q-mb-md">
          <q-card-section>
            <div class="text-subtitle2 text-weight-bold q-mb-md">Expense by Category</div>
            <div v-for="cat in categoryBreakdown" :key="cat.name" class="q-mb-md">
              <div class="row justify-between items-center q-mb-xs">
                <div class="row items-center q-gutter-sm">
                  <q-avatar :style="{ background: cat.color + '20' }" size="32px">
                    <q-icon :name="cat.icon" :style="{ color: cat.color }" size="16px" />
                  </q-avatar>
                  <span class="text-body2 text-weight-medium">{{ cat.name }}</span>
                </div>
                <div class="text-right">
                  <span class="text-weight-bold">{{ settings.currency }}{{ formatNumber(cat.spent) }}</span>
                  <q-badge :color="cat.percentColor" class="q-ml-sm">{{ cat.percent }}%</q-badge>
                </div>
              </div>
              <q-linear-progress
                :value="cat.percent / 100"
                :color="cat.barColor"
                rounded
                size="6px"
                track-color="grey-3"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Budget vs Actual -->
      <q-tab-panel name="budget" class="q-pa-none">
        <q-card class="finance-card q-mb-md">
          <q-card-section>
            <div class="text-subtitle2 text-weight-bold q-mb-md">Budget vs Actual Spending</div>
            <div v-for="cat in budgetComparison" :key="cat.name" class="q-mb-lg">
              <div class="row justify-between items-center q-mb-xs">
                <span class="text-body2 text-weight-medium">{{ cat.name }}</span>
                <span class="text-caption" :class="cat.over ? 'text-negative' : 'text-grey'">
                  {{ settings.currency }}{{ formatNumber(cat.spent) }} / {{ settings.currency }}{{ formatNumber(cat.budget) }}
                </span>
              </div>
              <q-linear-progress
                :value="Math.min(cat.usage, 1)"
                :color="cat.over ? 'negative' : cat.usage > 0.8 ? 'warning' : 'positive'"
                rounded
                size="10px"
                track-color="grey-3"
              />
              <div v-if="cat.over" class="text-caption text-negative q-mt-xs">
                Over budget by {{ settings.currency }}{{ formatNumber(cat.spent - cat.budget) }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Trend -->
      <q-tab-panel name="trend" class="q-pa-none">
        <q-card class="finance-card q-mb-md">
          <q-card-section>
            <div class="text-subtitle2 text-weight-bold q-mb-md">Spending Trend (Last 7 Days)</div>
            <div class="row items-end q-gutter-xs" style="height: 160px">
              <div
                v-for="day in dailyTrend"
                :key="day.date"
                class="col text-center"
              >
                <div
                  class="bg-primary"
                  :style="{
                    height: day.height + 'px',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '4px',
                    transition: 'height 0.3s ease'
                  }"
                ></div>
                <div class="text-caption q-mt-xs" style="font-size: 0.65rem">{{ day.label }}</div>
                <div class="text-caption text-grey" style="font-size: 0.6rem">{{ settings.currency }}{{ day.amount }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="finance-card">
          <q-card-section>
            <div class="text-subtitle2 text-weight-bold q-mb-md">Income Trend (Last 7 Days)</div>
            <div class="row items-end q-gutter-xs" style="height: 160px">
              <div
                v-for="day in dailyIncomeTrend"
                :key="day.date"
                class="col text-center"
              >
                <div
                  class="bg-positive"
                  :style="{
                    height: day.height + 'px',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '4px',
                    transition: 'height 0.3s ease'
                  }"
                ></div>
                <div class="text-caption q-mt-xs" style="font-size: 0.65rem">{{ day.label }}</div>
                <div class="text-caption text-grey" style="font-size: 0.6rem">{{ settings.currency }}{{ day.amount }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTransactionStore } from 'stores/transactionStore'
import { useCategoryStore } from 'stores/categoryStore'
import { useSettingsStore } from 'stores/settingsStore'

const transactions = useTransactionStore()
const categories = useCategoryStore()
const settings = useSettingsStore()
const reportTab = ref('overview')

const total = computed(() => transactions.totalIncome + transactions.totalExpense || 1)
const incomePercent = computed(() => Math.round((transactions.totalIncome / total.value) * 100))
const expensePercent = computed(() => Math.round((transactions.totalExpense / total.value) * 100))
const netSavings = computed(() => transactions.totalIncome - transactions.totalExpense)

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
        color: cat?.color || '#757575',
        barColor: percent > 40 ? 'negative' : percent > 20 ? 'warning' : 'primary',
        percentColor: percent > 40 ? 'negative' : percent > 20 ? 'warning' : 'primary',
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
        .reduce((sum, t) => sum + t.amount, 0)
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

// Daily trend helpers
function getDailyData(type) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const amount = transactions.transactions
      .filter((t) => t.type === type && t.date === dateStr)
      .reduce((sum, t) => sum + t.amount, 0)
    days.push({
      date: dateStr,
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      amount,
    })
  }
  const max = Math.max(...days.map((d) => d.amount), 1)
  return days.map((d) => ({ ...d, height: Math.round((d.amount / max) * 140) }))
}

const dailyTrend = computed(() => getDailyData('expense'))
const dailyIncomeTrend = computed(() => getDailyData('income'))

// Smart insights
const insights = computed(() => {
  const list = []
  const savingsRate = transactions.totalIncome ? Math.round(((transactions.totalIncome - transactions.totalExpense) / transactions.totalIncome) * 100) : 0

  if (savingsRate > 30) {
    list.push({ icon: 'thumb_up', color: 'positive', text: `Great! You're saving ${savingsRate}% of your income.` })
  } else if (savingsRate > 0) {
    list.push({ icon: 'info', color: 'warning', text: `You're saving ${savingsRate}% of your income. Try to reach 30%.` })
  } else {
    list.push({ icon: 'warning', color: 'negative', text: 'You are spending more than you earn!' })
  }

  // Overspending categories
  budgetComparison.value
    .filter((c) => c.over)
    .forEach((c) => {
      list.push({
        icon: 'trending_up',
        color: 'negative',
        text: `${c.name} is over budget by ${settings.currency}${(c.spent - c.budget).toLocaleString()}.`,
      })
    })

  // Highest expense category
  if (categoryBreakdown.value.length) {
    const top = categoryBreakdown.value[0]
    list.push({
      icon: 'analytics',
      color: 'info',
      text: `Your biggest expense category is "${top.name}" at ${top.percent}% of total spending.`,
    })
  }

  return list
})

function formatNumber(n) {
  return Number(n).toLocaleString()
}
</script>
