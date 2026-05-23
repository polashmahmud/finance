<template>
  <q-page class="page-container">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="page-title">{{ $t('occasionGoals.title') }}</div>
        <div class="page-subtitle">{{ goalStore.goals.length }}{{ ' ' + $t('occasionGoals.nav') }}</div>
      </div>
      <q-btn round flat dense icon="add_circle" size="md"
        style="color: #16161a; background: rgba(22,22,26,0.06); border-radius: 8px;"
        @click="openAddDialog" />
    </div>

    <!-- Summary Cards -->
    <div v-if="goalStore.activeGoals.length" class="row q-col-gutter-sm q-mb-md">
      <div class="col-6">
        <q-card class="finance-card" style="border-left: 4px solid #f59e0b;">
          <q-card-section class="q-py-sm q-px-md">
            <div class="text-caption text-grey-7">{{ $t('occasionGoals.monthlySummary') }}</div>
            <div class="text-h6 text-weight-bold" style="color: #f59e0b;">
              {{ settings.currency }}{{ settings.formatNumber(goalStore.totalMonthlyNeeded) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6">
        <q-card class="finance-card" style="border-left: 4px solid #2f7d5c;">
          <q-card-section class="q-py-sm q-px-md">
            <div class="text-caption text-grey-7">{{ $t('occasionGoals.active') }}</div>
            <div class="text-h6 text-weight-bold" style="color: #2f7d5c;">
              {{ goalStore.activeGoals.length }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Upcoming chips -->
    <div v-if="goalStore.upcomingGoals.length" class="q-mb-md">
      <div class="page-section-title q-mb-xs">{{ $t('occasionGoals.upcomingIn3Months') }}</div>
      <div class="row q-gutter-xs">
        <q-chip
          v-for="g in goalStore.upcomingGoals"
          :key="g.id"
          dense
          :icon="typeIcon(g.type)"
          :style="{ background: typeColor(g.type) + '22', color: typeColor(g.type), border: 'none' }"
          size="sm"
        >
          {{ g.name }}
        </q-chip>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="goalStore.loading" class="text-center q-pa-xl">
      <q-spinner-dots size="40px" color="dark" />
    </div>

    <template v-else>
      <!-- Tabs -->
      <q-card class="finance-card tab-card q-mb-md">
        <q-tabs v-model="activeTab" dense active-color="dark" indicator-color="dark"
          class="text-grey-6" align="justify" no-caps>
          <q-tab name="active" :label="$t('occasionGoals.active')" />
          <q-tab name="completed" :label="$t('occasionGoals.completed')" />
        </q-tabs>
      </q-card>

      <q-tab-panels v-model="activeTab" animated style="background: transparent;">
        <!-- Active Goals -->
        <q-tab-panel name="active" class="q-pa-none">
          <div v-if="goalStore.activeGoals.length" class="row q-col-gutter-sm">
            <div v-for="goal in goalStore.activeGoals" :key="goal.id" class="col-12 col-md-4 q-mb-xs">
              <q-slide-item
                left-color="positive"
                right-color="negative"
                @left="(obj) => onSwipe(obj, 'complete', goal)"
                @right="(obj) => onSwipe(obj, 'delete', goal)"
              >
                <template #left><q-icon name="check_circle" /></template>
                <template #right><q-icon name="delete" /></template>

                <q-card class="finance-card cursor-pointer" @click="openDetail(goal)">
                  <q-card-section class="q-pa-md">
                    <div class="row items-center justify-between no-wrap q-mb-sm">
                      <div class="row items-center q-gutter-sm" style="min-width:0;">
                        <q-avatar :style="{ background: typeColor(goal.type) + '22' }" size="38px">
                          <q-icon :name="typeIcon(goal.type)" :style="{ color: typeColor(goal.type) }" size="20px" />
                        </q-avatar>
                        <div style="min-width:0;">
                          <div class="text-subtitle2 text-weight-bold ellipsis">{{ goal.name }}</div>
                          <div class="text-caption text-grey-6">{{ formatDate(goal.targetDate) }}</div>
                        </div>
                      </div>
                      <div :class="['goal-status-badge', statusClass(goal)]">
                        {{ $t('occasionGoals.' + goalStatus(goal)) }}
                      </div>
                    </div>

                    <q-linear-progress
                      :value="progressPercent(goal)"
                      :color="progressColor(goal)"
                      track-color="grey-3"
                      rounded
                      size="8px"
                      class="q-mb-sm"
                    />

                    <div class="row items-center justify-between">
                      <div>
                        <div class="text-caption text-grey-7">{{ $t('occasionGoals.currentSaved') }}</div>
                        <div class="text-weight-bold" style="color: #2f7d5c; font-size: 0.9rem;">
                          {{ settings.currency }}{{ settings.formatNumber(goal.currentSaved || 0) }}
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-caption text-grey-7">{{ $t('occasionGoals.monthlyNeeded') }}</div>
                        <div class="text-weight-bold" style="font-size: 0.9rem; color: var(--text-primary);">
                          {{ settings.currency }}{{ settings.formatNumber(calcMonthlyNeeded(goal)) }}
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-caption text-grey-7">{{ $t('occasionGoals.remaining') }}</div>
                        <div class="text-weight-bold" style="font-size: 0.9rem; color: #b14437;">
                          {{ settings.currency }}{{ settings.formatNumber(Math.max(0, (goal.targetAmount || 0) - (goal.currentSaved || 0))) }}
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-slide-item>
            </div>
          </div>

          <div v-else class="empty-state">
            <q-icon name="savings" size="60px" />
            <div class="empty-state-title">{{ $t('occasionGoals.noGoals') }}</div>
            <div class="empty-state-subtitle">{{ $t('occasionGoals.addPrompt') }}</div>
          </div>
        </q-tab-panel>

        <!-- Completed Goals -->
        <q-tab-panel name="completed" class="q-pa-none">
          <div v-if="goalStore.completedGoals.length" class="row q-col-gutter-sm">
            <div v-for="goal in goalStore.completedGoals" :key="goal.id" class="col-12 col-md-4 q-mb-xs">
              <q-slide-item
                right-color="negative"
                @right="(obj) => onSwipe(obj, 'delete', goal)"
              >
                <template #right><q-icon name="delete" /></template>

                <q-card class="finance-card cursor-pointer" style="opacity: 0.75;" @click="openDetail(goal)">
                  <q-card-section class="q-pa-md">
                    <div class="row items-center justify-between no-wrap">
                      <div class="row items-center q-gutter-sm" style="min-width:0;">
                        <q-avatar :style="{ background: typeColor(goal.type) + '22' }" size="38px">
                          <q-icon :name="typeIcon(goal.type)" :style="{ color: typeColor(goal.type) }" size="20px" />
                        </q-avatar>
                        <div style="min-width:0;">
                          <div class="text-subtitle2 text-weight-bold ellipsis">{{ goal.name }}</div>
                          <div class="text-caption text-grey-6">{{ formatDate(goal.targetDate) }}</div>
                        </div>
                      </div>
                      <q-chip color="positive" text-color="white" dense size="sm" icon="check_circle">
                        {{ $t('occasionGoals.achieved') }}
                      </q-chip>
                    </div>
                    <q-linear-progress :value="1" color="positive" track-color="grey-3" rounded size="8px" class="q-mt-sm" />
                  </q-card-section>
                </q-card>
              </q-slide-item>
            </div>
          </div>

          <div v-else class="empty-state">
            <q-icon name="emoji_events" size="60px" />
            <div class="empty-state-title">{{ $t('occasionGoals.noGoals') }}</div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Swipe hint -->
      <div v-if="goalStore.goals.length" class="text-center q-pa-md text-grey-6 q-mt-sm" style="font-size: 12px;">
        <q-icon name="swipe" size="16px" class="q-mr-xs" />
        {{ $t('occasionGoals.swipeHint') }}
      </div>
    </template>

    <!-- Add / Edit Goal Dialog -->
    <q-dialog v-model="showGoalDialog" persistent>
      <q-card style="border-radius: 10px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: var(--text-primary);">
            {{ editingGoal ? $t('occasionGoals.editGoal') : $t('occasionGoals.newGoal') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup
            style="background: var(--card-cream); color: var(--text-muted);" />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveGoal" greedy>
            <!-- Type selector -->
            <div class="text-caption text-grey-7 q-mb-xs">{{ $t('occasionGoals.goalType') }}</div>
            <div class="row q-gutter-xs q-mb-md" style="flex-wrap: wrap;">
              <div
                v-for="type in goalTypes"
                :key="type.value"
                class="type-pill"
                :style="goalForm.type === type.value
                  ? { background: type.color + '22', border: '1.5px solid ' + type.color, color: type.color }
                  : { background: 'var(--card-cream)', border: '1.5px solid var(--card-border)', color: 'var(--text-muted)' }"
                @click="goalForm.type = type.value"
              >
                <q-icon :name="type.icon" size="14px" class="q-mr-xs" />{{ type.label }}
              </div>
            </div>

            <q-input v-model="goalForm.name" :label="$t('occasionGoals.goalName')" outlined dense color="dark"
              :rules="[(v) => !!v || $t('common.nameRequired')]" style="margin-bottom: 10px;" />

            <q-input v-model="goalForm.targetDate" :label="$t('occasionGoals.targetDate')" outlined dense
              color="dark" readonly style="margin-bottom: 10px;"
              :rules="[(v) => !!v || $t('common.dateRequired')]">
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="goalForm.targetDate" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input v-model.number="goalForm.targetAmount" :label="$t('occasionGoals.targetAmount')"
              outlined dense type="number" color="dark" :prefix="settings.currency"
              :rules="[(v) => (v && v > 0) || $t('common.validAmount')]" style="margin-bottom: 16px;" />

            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="editingGoal ? $t('common.update') : $t('occasionGoals.addGoal')" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Goal Detail Dialog -->
    <q-dialog v-model="showDetailDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card style="background: var(--card-cream);">
        <q-toolbar class="bg-white text-dark" style="border-bottom: 1px solid var(--card-border);">
          <q-btn flat round dense icon="arrow_back" @click="showDetailDialog = false" />
          <q-toolbar-title class="text-weight-bold" style="font-size: 1.1rem;">
            {{ selectedGoal?.name }}
          </q-toolbar-title>
          <q-btn flat round dense icon="edit" @click="openEditFromDetail" />
        </q-toolbar>

        <div v-if="selectedGoal" style="overflow-y: auto; height: calc(100% - 56px);">
          <!-- Progress card -->
          <div class="q-pa-md">
            <q-card class="finance-card">
              <q-card-section class="q-pa-md">
                <div class="row items-center q-gutter-sm q-mb-md">
                  <q-avatar :style="{ background: typeColor(selectedGoal.type) + '22' }" size="44px">
                    <q-icon :name="typeIcon(selectedGoal.type)" :style="{ color: typeColor(selectedGoal.type) }" size="24px" />
                  </q-avatar>
                  <div>
                    <div class="text-subtitle1 text-weight-bold">{{ selectedGoal.name }}</div>
                    <div class="text-caption text-grey-6">{{ formatDate(selectedGoal.targetDate) }}</div>
                  </div>
                </div>

                <q-linear-progress
                  :value="progressPercent(selectedGoal)"
                  :color="progressColor(selectedGoal)"
                  track-color="grey-3"
                  rounded
                  size="10px"
                  class="q-mb-md"
                />

                <div style="background: var(--card-cream); border-radius: 8px; padding: 10px 12px;" class="q-mb-md">
                  <div class="row items-center justify-between q-mb-xs">
                    <span class="text-caption text-grey-7">{{ $t('occasionGoals.currentSaved') }}</span>
                    <span class="text-weight-bold" style="color: #2f7d5c;">{{ settings.currency }}{{ settings.formatNumber(selectedGoal.currentSaved || 0) }}</span>
                  </div>
                  <div class="row items-center justify-between q-mb-xs">
                    <span class="text-caption text-grey-7">{{ $t('occasionGoals.remaining') }}</span>
                    <span class="text-weight-bold" style="color: #b14437;">{{ settings.currency }}{{ settings.formatNumber(Math.max(0, (selectedGoal.targetAmount || 0) - (selectedGoal.currentSaved || 0))) }}</span>
                  </div>
                  <div class="row items-center justify-between">
                    <span class="text-caption text-grey-7">{{ $t('occasionGoals.monthlyNeeded') }}</span>
                    <span class="text-weight-bold" style="color: #f59e0b;">{{ settings.currency }}{{ settings.formatNumber(calcMonthlyNeeded(selectedGoal)) }}</span>
                  </div>
                </div>

                <q-btn v-if="!selectedGoal.completed" class="full-width bg-primary-gradient" text-color="white"
                  rounded unelevated icon="add" :label="$t('occasionGoals.addContribution')"
                  @click="openAddContribution" />
              </q-card-section>
            </q-card>

            <!-- Contributions -->
            <div v-if="selectedGoal.contributions?.length">
              <div class="page-section-title q-mt-md q-mb-sm">{{ $t('occasionGoals.contributions') }}</div>
              <q-slide-item
                v-for="(contrib, idx) in sortedContributions"
                :key="idx"
                right-color="negative"
                class="q-mb-sm"
                @right="({ reset }) => onDeleteContribution(idx, reset)"
              >
                <template #right><q-icon name="delete" /></template>
                <q-card class="finance-card">
                  <q-card-section class="q-pa-sm q-px-md">
                    <div class="row items-center justify-between no-wrap">
                      <div class="row items-center q-gutter-sm">
                        <q-avatar size="34px" style="background: #e8f1ec;">
                          <q-icon name="savings" size="16px" color="positive" />
                        </q-avatar>
                        <div>
                          <div class="text-weight-bold" style="color: #2f7d5c; font-size: 0.9rem;">
                            +{{ settings.currency }}{{ settings.formatNumber(contrib.amount) }}
                          </div>
                          <div class="text-caption text-grey-6">{{ formatDate(contrib.date) }}</div>
                          <div v-if="contrib.notes" class="text-caption text-grey-5">{{ contrib.notes }}</div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-slide-item>
            </div>

            <div v-else class="text-center q-py-xl text-grey-5" style="font-size: 0.85rem;">
              {{ $t('occasionGoals.noContributions') }}
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Add Contribution Dialog -->
    <q-dialog v-model="showContribDialog" persistent>
      <q-card style="border-radius: 10px; width: 100%; max-width: 500px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: var(--text-primary);">
            {{ $t('occasionGoals.addContribution') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup
            style="background: var(--card-cream); color: var(--text-muted);" />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="saveContribution" greedy>
            <q-input v-model.number="contribForm.amount" :label="$t('occasionGoals.contributionAmount')"
              outlined dense type="number" color="dark" :prefix="settings.currency"
              :rules="[(v) => (v && v > 0) || $t('common.validAmount')]" style="margin-bottom: 10px;" />
            <q-input v-model="contribForm.date" :label="$t('occasionGoals.contributionDate')"
              outlined dense color="dark" readonly style="margin-bottom: 10px;"
              :rules="[(v) => !!v || $t('common.dateRequired')]">
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="contribForm.date" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input v-model="contribForm.notes" :label="$t('occasionGoals.contributionNotes')"
              outlined dense color="dark" style="margin-bottom: 16px;" />
            <q-btn type="submit" class="full-width bg-primary-gradient" text-color="white" rounded unelevated
              :label="$t('common.save')" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirm Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="border-radius: 10px; min-width: 280px; background: white;">
        <q-card-section class="row items-center justify-between no-wrap q-pb-none">
          <div class="text-h6 text-weight-bold q-pl-sm" style="color: var(--text-primary);">
            {{ $t('occasionGoals.deleteGoal') }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup
            style="background: var(--card-cream); color: var(--text-muted);" />
        </q-card-section>
        <q-card-section>
          <div class="text-body2 text-grey-8">{{ $t('occasionGoals.deleteConfirm') }}</div>
        </q-card-section>
        <q-card-actions align="right" class="q-pt-none q-pb-md q-px-md">
          <q-btn flat rounded color="grey-7" :label="$t('common.cancel')" v-close-popup />
          <q-btn unelevated rounded color="negative" :label="$t('common.delete')" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useOccasionGoalStore } from 'stores/occasionGoalStore'
import { useSettingsStore } from 'stores/settingsStore'

const $q = useQuasar()
const { t } = useI18n()
const goalStore = useOccasionGoalStore()
const settings = useSettingsStore()

const activeTab = ref('active')
const saving = ref(false)

const showGoalDialog = ref(false)
const showDetailDialog = ref(false)
const showContribDialog = ref(false)
const showDeleteDialog = ref(false)

const editingGoal = ref(null)
const selectedGoalId = ref(null)
const selectedGoal = computed(() => goalStore.goals.find((g) => g.id === selectedGoalId.value) || null)
const deletingGoal = ref(null)

const goalForm = reactive({
  name: '',
  type: 'custom',
  targetDate: '',
  targetAmount: null,
})

const contribForm = reactive({
  amount: null,
  date: new Date().toISOString().slice(0, 10),
  notes: '',
})

const goalTypes = computed(() => [
  { value: 'eid', label: t('occasionGoals.typeEid'), icon: 'star', color: '#16a34a' },
  { value: 'qurbani', label: t('occasionGoals.typeQurbani'), icon: 'pets', color: '#7c3aed' },
  { value: 'birthday', label: t('occasionGoals.typeBirthday'), icon: 'cake', color: '#db2777' },
  { value: 'anniversary', label: t('occasionGoals.typeAnniversary'), icon: 'favorite', color: '#dc2626' },
  { value: 'custom', label: t('occasionGoals.typeCustom'), icon: 'flag', color: '#2563eb' },
])

function typeIcon(type) {
  return goalTypes.value.find((t) => t.value === type)?.icon || 'flag'
}

function typeColor(type) {
  return goalTypes.value.find((t) => t.value === type)?.color || '#2563eb'
}

function formatDate(date) {
  if (!date) return ''
  const locale = settings.language === 'bn' ? 'bn-BD' : 'en-US'
  return new Date(date).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
}

function calcMonthlyNeeded(goal) {
  if (!goal.targetDate) return 0
  const now = new Date()
  const target = new Date(goal.targetDate)
  const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
  if (months <= 0) return 0
  const remaining = (goal.targetAmount || 0) - (goal.currentSaved || 0)
  return remaining > 0 ? Math.ceil(remaining / months) : 0
}

function progressPercent(goal) {
  if (!goal.targetAmount) return 0
  return Math.min(1, (goal.currentSaved || 0) / goal.targetAmount)
}

function goalStatus(goal) {
  if (goal.completed) return 'achieved'
  if (new Date(goal.targetDate) < new Date()) return 'overdue'
  return 'onTrack'
}

function progressColor(goal) {
  const s = goalStatus(goal)
  if (s === 'achieved') return 'positive'
  if (s === 'overdue') return 'negative'
  return 'primary'
}

function statusClass(goal) {
  const s = goalStatus(goal)
  if (s === 'overdue') return 'badge-overdue'
  if (s === 'achieved') return 'badge-achieved'
  return 'badge-ontrack'
}

const sortedContributions = computed(() => {
  if (!selectedGoal.value?.contributions) return []
  return [...selectedGoal.value.contributions].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
})

function onSwipe({ reset }, action, goal) {
  setTimeout(() => {
    if (action === 'delete') {
      deletingGoal.value = goal
      showDeleteDialog.value = true
    } else if (action === 'complete') {
      onMarkComplete(goal)
    }
  }, 300)
  setTimeout(() => reset(), 100)
}

function openAddDialog() {
  editingGoal.value = null
  goalForm.name = ''
  goalForm.type = 'custom'
  goalForm.targetDate = ''
  goalForm.targetAmount = null
  showGoalDialog.value = true
}

function openEditFromDetail() {
  if (!selectedGoal.value) return
  editingGoal.value = selectedGoal.value
  goalForm.name = selectedGoal.value.name
  goalForm.type = selectedGoal.value.type
  goalForm.targetDate = selectedGoal.value.targetDate
  goalForm.targetAmount = selectedGoal.value.targetAmount
  showDetailDialog.value = false
  showGoalDialog.value = true
}

async function saveGoal() {
  saving.value = true
  try {
    if (editingGoal.value) {
      await goalStore.updateGoal(editingGoal.value.id, {
        name: goalForm.name,
        type: goalForm.type,
        targetDate: goalForm.targetDate,
        targetAmount: goalForm.targetAmount,
      })
      $q.notify({ type: 'positive', icon: 'check_circle', message: t('occasionGoals.goalUpdated'), position: 'top' })
    } else {
      await goalStore.addGoal({ ...goalForm })
      $q.notify({ type: 'positive', icon: 'check_circle', message: t('occasionGoals.goalAdded'), position: 'top' })
    }
    showGoalDialog.value = false
  } finally {
    saving.value = false
  }
}

function openDetail(goal) {
  selectedGoalId.value = goal.id
  showDetailDialog.value = true
}

function openAddContribution() {
  contribForm.amount = null
  contribForm.date = new Date().toISOString().slice(0, 10)
  contribForm.notes = ''
  showContribDialog.value = true
}

async function saveContribution() {
  if (!selectedGoal.value) return
  saving.value = true
  try {
    await goalStore.addContribution(selectedGoal.value.id, { ...contribForm })
    $q.notify({ type: 'positive', icon: 'check_circle', message: t('occasionGoals.contributionAdded'), position: 'top' })
    showContribDialog.value = false
  } finally {
    saving.value = false
  }
}

function onDeleteContribution(idx, resetFn) {
  if (resetFn) setTimeout(() => resetFn(), 100)
  const realIdx = selectedGoal.value.contributions.findIndex(
    (c) => c === sortedContributions.value[idx],
  )
  if (realIdx < 0) return
  setTimeout(() => {
    $q.dialog({
      title: t('occasionGoals.deleteContribution'),
      message: t('occasionGoals.deleteContribConfirm'),
      cancel: t('common.cancel'),
      ok: { label: t('common.delete'), color: 'negative', unelevated: true },
      persistent: true,
    }).onOk(async () => {
      await goalStore.deleteContribution(selectedGoal.value.id, realIdx)
      $q.notify({ type: 'positive', message: t('occasionGoals.contributionDeleted'), position: 'top' })
    })
  }, 300)
}

async function onMarkComplete(goal) {
  await goalStore.updateGoal(goal.id, { completed: true })
  if (selectedGoal.value?.id === goal.id) showDetailDialog.value = false
  $q.notify({ type: 'positive', icon: 'emoji_events', message: t('occasionGoals.achieved'), position: 'top' })
}


async function confirmDelete() {
  if (!deletingGoal.value) return
  if (selectedGoal.value?.id === deletingGoal.value.id) showDetailDialog.value = false
  await goalStore.deleteGoal(deletingGoal.value.id)
  showDeleteDialog.value = false
  $q.notify({ type: 'negative', icon: 'delete', message: t('occasionGoals.goalDeleted'), position: 'top' })
}

onMounted(() => goalStore.listenGoals())
onUnmounted(() => goalStore.stopListening())
</script>

<style scoped>
.goal-status-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 7px;
  border-radius: 4px;
  flex-shrink: 0;
}
.badge-ontrack { background: #e8f1ec; color: #2f7d5c; }
.badge-overdue { background: #fbeae6; color: #b14437; }
.badge-achieved { background: #e8f1ec; color: #2f7d5c; }

.type-pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: all 0.12s;
}
</style>
