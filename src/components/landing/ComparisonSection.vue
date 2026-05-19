<template>
  <section class="comparison">
    <div class="comparison__inner">
      <div class="comparison__header reveal">
        <div class="section-badge">Why MyFinance</div>
        <h2 class="comparison__title">The smarter choice for your finances</h2>
        <p class="comparison__subtitle">
          See how MyFinance stacks up against the alternatives.
        </p>
      </div>

      <div class="comparison__table-wrap reveal" style="transition-delay: 0.1s">
        <div class="comp-table">
          <!-- Header -->
          <div class="comp-header">
            <div class="comp-header__feature"></div>
            <div class="comp-header__col comp-header__col--highlight">
              <div class="comp-header__badge">⭐ Recommended</div>
              <div class="comp-header__name">MyFinance</div>
              <div class="comp-header__sub">Free, full-featured</div>
            </div>
            <div class="comp-header__col">
              <div class="comp-header__name">Spreadsheets</div>
              <div class="comp-header__sub">Manual, error-prone</div>
            </div>
            <div class="comp-header__col">
              <div class="comp-header__name">Other Apps</div>
              <div class="comp-header__sub">Paid or limited</div>
            </div>
          </div>

          <!-- Rows -->
          <div
            v-for="row in rows"
            :key="row.feature"
            class="comp-row"
          >
            <div class="comp-row__feature">{{ row.feature }}</div>
            <div class="comp-row__cell comp-row__cell--highlight">
              <check-icon v-if="row.a === true" color="#2f7d5c" />
              <cross-icon v-else-if="row.a === false" />
              <span v-else class="comp-row__text comp-row__text--accent">{{ row.a }}</span>
            </div>
            <div class="comp-row__cell">
              <check-icon v-if="row.b === true" color="#94a3b8" />
              <cross-icon v-else-if="row.b === false" />
              <span v-else class="comp-row__text">{{ row.b }}</span>
            </div>
            <div class="comp-row__cell">
              <check-icon v-if="row.c === true" color="#94a3b8" />
              <cross-icon v-else-if="row.c === false" />
              <span v-else class="comp-row__text">{{ row.c }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'
import { useScrollReveal } from 'src/composables/useScrollReveal'

useScrollReveal('.reveal')

const CheckIcon = ({ color = '#2f7d5c' }) =>
  h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' }, [
    h('circle', { cx: 12, cy: 12, r: 10, fill: color, opacity: 0.12 }),
    h('path', { d: 'M9 12l2 2 4-4', stroke: color, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  ])

const CrossIcon = () =>
  h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' }, [
    h('circle', { cx: 12, cy: 12, r: 10, fill: '#b14437', opacity: 0.1 }),
    h('path', { d: 'M15 9l-6 6M9 9l6 6', stroke: '#b14437', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.6 }),
  ])

const rows = [
  { feature: 'Free to use', a: true, b: true, c: false },
  { feature: 'Works offline', a: true, b: false, c: false },
  { feature: 'Mobile app (iOS & Android)', a: true, b: false, c: true },
  { feature: 'Real-time sync', a: true, b: false, c: true },
  { feature: 'Bengali language support', a: true, b: false, c: false },
  { feature: 'Loan tracking', a: true, b: '⚠ Manual', c: false },
  { feature: 'Category budgets', a: true, b: '⚠ Manual', c: 'Paid only' },
  { feature: 'Shopping lists', a: true, b: false, c: false },
  { feature: 'PIN app lock', a: true, b: false, c: 'Paid only' },
  { feature: 'Multiple accounts', a: true, b: true, c: true },
  { feature: 'Reports & analytics', a: true, b: '⚠ Manual', c: true },
  { feature: 'No ads, ever', a: true, b: true, c: false },
]
</script>

<style scoped lang="scss">
.comparison {
  padding: 100px 24px;
  background: #fafaf7;

  &__inner {
    max-width: 1000px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: 56px;
  }

  &__title {
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 900;
    color: #16161a;
    letter-spacing: -0.04em;
    margin: 12px 0 16px;
    line-height: 1.15;
  }

  &__subtitle {
    font-size: 1.05rem;
    color: #7c7a73;
    max-width: 440px;
    margin: 0 auto;
    line-height: 1.65;
  }

  &__table-wrap {
    overflow-x: auto;
    border-radius: 20px;
    border: 1px solid #e9e5dc;
    box-shadow: 0 2px 16px rgba(22, 22, 26, 0.05);
  }
}

.comp-table {
  min-width: 600px;
  background: #ffffff;
}

.comp-header {
  display: grid;
  grid-template-columns: 1fr repeat(3, 160px);
  gap: 0;
  border-bottom: 1px solid #e9e5dc;

  @media (max-width: 767px) {
    grid-template-columns: 1fr repeat(3, 120px);
  }

  &__feature { padding: 24px 20px; }

  &__col {
    padding: 24px 16px;
    text-align: center;
    border-left: 1px solid #e9e5dc;

    &--highlight {
      background: #f0f7f4;
      border-color: rgba(47, 125, 92, 0.2);
    }
  }

  &__badge {
    display: inline-block;
    padding: 3px 10px;
    background: rgba(47, 125, 92, 0.12);
    border-radius: 100px;
    font-size: 0.65rem;
    font-weight: 700;
    color: #2f7d5c;
    margin-bottom: 8px;
  }

  &__name {
    font-size: 0.95rem;
    font-weight: 800;
    color: #16161a;
    margin-bottom: 4px;
  }

  &__sub {
    font-size: 0.72rem;
    color: #7c7a73;
  }
}

.comp-row {
  display: grid;
  grid-template-columns: 1fr repeat(3, 160px);
  gap: 0;
  border-bottom: 1px solid #efece4;
  transition: background 0.2s;

  @media (max-width: 767px) {
    grid-template-columns: 1fr repeat(3, 120px);
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafaf7;
  }

  &__feature {
    padding: 14px 20px;
    font-size: 0.85rem;
    color: #3a3a40;
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  &__cell {
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #efece4;

    &--highlight {
      background: rgba(47, 125, 92, 0.03);
      border-color: rgba(47, 125, 92, 0.1);
    }
  }

  &__text {
    font-size: 0.75rem;
    color: #7c7a73;
    font-weight: 500;

    &--accent {
      color: #2f7d5c;
    }
  }
}

.section-badge {
  display: inline-block;
  padding: 5px 14px;
  background: rgba(47, 125, 92, 0.08);
  border: 1px solid rgba(47, 125, 92, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #2f7d5c;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
