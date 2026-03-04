<template>
  <q-page class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="page-title">{{ $t('help.title') }}</div>
      <div class="page-subtitle">{{ $t('help.subtitle') }}</div>
    </div>

    <!-- Table of Contents -->
    <q-card class="finance-card q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-sm">
          <q-icon name="list" class="q-mr-xs" />
          {{ $t('help.toc') }}
        </div>
        <q-list dense>
          <q-item v-for="(section, idx) in sections" :key="idx" clickable v-ripple @click="scrollTo('section-' + idx)"
            class="rounded-borders">
            <q-item-section avatar style="min-width: 32px">
              <q-avatar :color="section.color" text-color="white" size="24px" class="text-caption text-weight-bold">
                {{ idx + 1 }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-body2">{{ section.title }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" size="xs" color="grey" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Sections -->
    <div v-for="(section, idx) in sections" :key="idx" :id="'section-' + idx" class="q-mb-lg">
      <div class="row items-center q-mb-sm q-gutter-sm">
        <q-avatar :color="section.color" text-color="white" size="32px">
          <q-icon :name="section.icon" size="18px" />
        </q-avatar>
        <div class="text-h6 text-weight-bold">{{ section.title }}</div>
      </div>

      <q-card class="finance-card">
        <q-card-section>
          <div v-for="(step, sIdx) in section.steps" :key="sIdx" class="q-mb-md"
            :class="{ 'q-mb-none': sIdx === section.steps.length - 1 }">
            <div class="row items-start q-gutter-sm">
              <q-badge :color="section.color" class="q-mt-xs" style="min-width: 24px; justify-content: center;">
                {{ sIdx + 1 }}
              </q-badge>
              <div class="col">
                <div class="text-body2 text-weight-medium">{{ step.label }}</div>
                <div v-if="step.detail" class="text-caption text-grey-7 q-mt-xs">{{ step.detail }}</div>
              </div>
            </div>
            <q-separator v-if="sIdx < section.steps.length - 1" class="q-mt-sm" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Tips Section -->
    <div class="q-mb-lg">
      <div class="row items-center q-mb-sm q-gutter-sm">
        <q-avatar color="amber-8" text-color="white" size="32px">
          <q-icon name="tips_and_updates" size="18px" />
        </q-avatar>
        <div class="text-h6 text-weight-bold">{{ $t('help.tips.title') }}</div>
      </div>
      <q-card class="finance-card">
        <q-card-section>
          <div v-for="(tip, tIdx) in tips" :key="tIdx" class="q-mb-sm"
            :class="{ 'q-mb-none': tIdx === tips.length - 1 }">
            <div class="row items-start q-gutter-sm">
              <q-icon name="lightbulb" color="amber-8" size="20px" class="q-mt-xs" />
              <div class="col text-body2">{{ tip }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Back to top -->
    <div class="text-center q-mt-md q-mb-xl">
      <q-btn flat round icon="arrow_upward" color="dark" @click="scrollTo('top')" />
      <div class="text-caption text-grey">{{ $t('help.backToTop') }}</div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const sections = computed(() => [
  {
    title: t('help.sections.register.title'),
    icon: 'person_add',
    color: 'blue',
    steps: [
      { label: t('help.sections.register.s1'), detail: t('help.sections.register.s1d') },
      { label: t('help.sections.register.s2'), detail: t('help.sections.register.s2d') },
      { label: t('help.sections.register.s3'), detail: t('help.sections.register.s3d') },
      { label: t('help.sections.register.s4'), detail: t('help.sections.register.s4d') },
    ],
  },
  {
    title: t('help.sections.login.title'),
    icon: 'login',
    color: 'teal',
    steps: [
      { label: t('help.sections.login.s1') },
      { label: t('help.sections.login.s2'), detail: t('help.sections.login.s2d') },
      { label: t('help.sections.login.s3'), detail: t('help.sections.login.s3d') },
    ],
  },
  {
    title: t('help.sections.accounts.title'),
    icon: 'account_balance_wallet',
    color: 'indigo',
    steps: [
      { label: t('help.sections.accounts.s1'), detail: t('help.sections.accounts.s1d') },
      { label: t('help.sections.accounts.s2'), detail: t('help.sections.accounts.s2d') },
      { label: t('help.sections.accounts.s3'), detail: t('help.sections.accounts.s3d') },
      { label: t('help.sections.accounts.s4'), detail: t('help.sections.accounts.s4d') },
    ],
  },
  {
    title: t('help.sections.categories.title'),
    icon: 'category',
    color: 'purple',
    steps: [
      { label: t('help.sections.categories.s1'), detail: t('help.sections.categories.s1d') },
      { label: t('help.sections.categories.s2'), detail: t('help.sections.categories.s2d') },
      { label: t('help.sections.categories.s3'), detail: t('help.sections.categories.s3d') },
      { label: t('help.sections.categories.s4'), detail: t('help.sections.categories.s4d') },
    ],
  },
  {
    title: t('help.sections.income.title'),
    icon: 'trending_up',
    color: 'green',
    steps: [
      { label: t('help.sections.income.s1'), detail: t('help.sections.income.s1d') },
      { label: t('help.sections.income.s2'), detail: t('help.sections.income.s2d') },
      { label: t('help.sections.income.s3'), detail: t('help.sections.income.s3d') },
      { label: t('help.sections.income.s4') },
    ],
  },
  {
    title: t('help.sections.expense.title'),
    icon: 'trending_down',
    color: 'red',
    steps: [
      { label: t('help.sections.expense.s1'), detail: t('help.sections.expense.s1d') },
      { label: t('help.sections.expense.s2'), detail: t('help.sections.expense.s2d') },
      { label: t('help.sections.expense.s3'), detail: t('help.sections.expense.s3d') },
      { label: t('help.sections.expense.s4') },
    ],
  },
  {
    title: t('help.sections.transfer.title'),
    icon: 'sync_alt',
    color: 'blue',
    steps: [
      { label: t('help.sections.transfer.s1'), detail: t('help.sections.transfer.s1d') },
      { label: t('help.sections.transfer.s2'), detail: t('help.sections.transfer.s2d') },
      { label: t('help.sections.transfer.s3'), detail: t('help.sections.transfer.s3d') },
      { label: t('help.sections.transfer.s4') },
    ],
  },
  {
    title: t('help.sections.dashboard.title'),
    icon: 'dashboard',
    color: 'dark',
    steps: [
      { label: t('help.sections.dashboard.s1'), detail: t('help.sections.dashboard.s1d') },
      { label: t('help.sections.dashboard.s2'), detail: t('help.sections.dashboard.s2d') },
      { label: t('help.sections.dashboard.s3'), detail: t('help.sections.dashboard.s3d') },
      { label: t('help.sections.dashboard.s4'), detail: t('help.sections.dashboard.s4d') },
    ],
  },
  {
    title: t('help.sections.reports.title'),
    icon: 'bar_chart',
    color: 'orange',
    steps: [
      { label: t('help.sections.reports.s1'), detail: t('help.sections.reports.s1d') },
      { label: t('help.sections.reports.s2'), detail: t('help.sections.reports.s2d') },
      { label: t('help.sections.reports.s3'), detail: t('help.sections.reports.s3d') },
      { label: t('help.sections.reports.s4'), detail: t('help.sections.reports.s4d') },
    ],
  },
  {
    title: t('help.sections.marketList.title'),
    icon: 'shopping_cart',
    color: 'green-8',
    steps: [
      { label: t('help.sections.marketList.s1'), detail: t('help.sections.marketList.s1d') },
      { label: t('help.sections.marketList.s2'), detail: t('help.sections.marketList.s2d') },
      { label: t('help.sections.marketList.s3'), detail: t('help.sections.marketList.s3d') },
      { label: t('help.sections.marketList.s4'), detail: t('help.sections.marketList.s4d') },
      { label: t('help.sections.marketList.s5'), detail: t('help.sections.marketList.s5d') },
    ],
  },
  {
    title: t('help.sections.notes.title'),
    icon: 'description',
    color: 'amber-9',
    steps: [
      { label: t('help.sections.notes.s1'), detail: t('help.sections.notes.s1d') },
      { label: t('help.sections.notes.s2'), detail: t('help.sections.notes.s2d') },
      { label: t('help.sections.notes.s3'), detail: t('help.sections.notes.s3d') },
    ],
  },
  {
    title: t('help.sections.search.title'),
    icon: 'search',
    color: 'cyan',
    steps: [
      { label: t('help.sections.search.s1'), detail: t('help.sections.search.s1d') },
      { label: t('help.sections.search.s2'), detail: t('help.sections.search.s2d') },
      { label: t('help.sections.search.s3'), detail: t('help.sections.search.s3d') },
    ],
  },
  {
    title: t('help.sections.settings.title'),
    icon: 'settings',
    color: 'grey-8',
    steps: [
      { label: t('help.sections.settings.s1'), detail: t('help.sections.settings.s1d') },
      { label: t('help.sections.settings.s2'), detail: t('help.sections.settings.s2d') },
      { label: t('help.sections.settings.s3'), detail: t('help.sections.settings.s3d') },
      { label: t('help.sections.settings.s4'), detail: t('help.sections.settings.s4d') },
      { label: t('help.sections.settings.s5'), detail: t('help.sections.settings.s5d') },
    ],
  },
  {
    title: t('help.sections.security.title'),
    icon: 'lock',
    color: 'red-8',
    steps: [
      { label: t('help.sections.security.s1'), detail: t('help.sections.security.s1d') },
      { label: t('help.sections.security.s2'), detail: t('help.sections.security.s2d') },
      { label: t('help.sections.security.s3'), detail: t('help.sections.security.s3d') },
    ],
  },
])

const tips = computed(() => [
  t('help.tips.t1'),
  t('help.tips.t2'),
  t('help.tips.t3'),
  t('help.tips.t4'),
  t('help.tips.t5'),
  t('help.tips.t6'),
  t('help.tips.t7'),
])

function scrollTo(id) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
