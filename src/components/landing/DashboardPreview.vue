<template>
  <section class="preview" id="dashboard">
    <div class="preview__inner">
      <div class="preview__header reveal">
        <div class="section-badge">Live Preview</div>
        <h2 class="preview__title">See your finances at a glance</h2>
        <p class="preview__subtitle">
          A clean, distraction-free dashboard designed to show what matters most — instantly.
        </p>
      </div>

      <div class="preview__layout">
        <div class="preview__callouts reveal">
          <div
            v-for="(callout, i) in callouts"
            :key="callout.title"
            class="callout"
            :class="{ 'callout--active': activeCallout === i }"
            @mouseenter="activeCallout = i"
          >
            <div class="callout__icon">{{ callout.icon }}</div>
            <div>
              <div class="callout__title">{{ callout.title }}</div>
              <div class="callout__desc">{{ callout.desc }}</div>
            </div>
          </div>
        </div>

        <div class="preview__screen reveal" style="transition-delay: 0.15s">
          <div class="screen-frame">
            <div class="screen-notch"></div>
            <div class="screen-body">
              <!-- Header -->
              <div class="sc-header">
                <div class="sc-avatar">P</div>
                <div class="sc-greeting">
                  <div class="sc-hello">Good morning, Polash 👋</div>
                  <div class="sc-date">Tuesday, May 19</div>
                </div>
                <div class="sc-bell">🔔</div>
              </div>

              <!-- Balance card -->
              <div class="sc-balance">
                <div class="sc-balance-label">Total Balance</div>
                <div class="sc-balance-amt">৳ 1,24,500</div>
                <div class="sc-balance-sub">
                  <div class="sc-chip sc-chip--green">↑ ৳ 45,000</div>
                  <div class="sc-chip sc-chip--red">↓ ৳ 12,800</div>
                </div>
                <div class="sc-orb sc-orb--1"></div>
                <div class="sc-orb sc-orb--2"></div>
              </div>

              <!-- Account cards -->
              <div class="sc-accounts">
                <div class="sc-account" v-for="acc in accounts" :key="acc.name">
                  <div class="sc-acc-icon" :style="{ background: acc.color }">{{ acc.emoji }}</div>
                  <div class="sc-acc-name">{{ acc.name }}</div>
                  <div class="sc-acc-bal">{{ acc.bal }}</div>
                </div>
              </div>

              <!-- Budget bars -->
              <div class="sc-section-lbl">Budget Status</div>
              <div class="sc-budgets">
                <div class="sc-budget" v-for="b in budgets" :key="b.name">
                  <div class="sc-budget-row">
                    <span class="sc-budget-name">{{ b.name }}</span>
                    <span class="sc-budget-pct" :style="{ color: b.pct > 80 ? '#ef4444' : '#f97316' }">{{ b.pct }}%</span>
                  </div>
                  <div class="sc-budget-track">
                    <div
                      class="sc-budget-fill"
                      :style="{
                        width: b.pct + '%',
                        background: b.pct > 80 ? '#ef4444' : 'linear-gradient(90deg, #f97316, #ef4444)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Recent transactions -->
              <div class="sc-section-lbl">Recent</div>
              <div class="sc-txs">
                <div class="sc-tx" v-for="tx in transactions" :key="tx.name">
                  <div class="sc-tx-icon" :style="{ background: tx.iconBg }">{{ tx.emoji }}</div>
                  <div class="sc-tx-info">
                    <div class="sc-tx-name">{{ tx.name }}</div>
                    <div class="sc-tx-date">{{ tx.date }}</div>
                  </div>
                  <div class="sc-tx-amt" :class="tx.type === 'income' ? 'sc-tx-amt--in' : 'sc-tx-amt--out'">
                    {{ tx.type === 'income' ? '+' : '–' }} {{ tx.amount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="preview__callouts preview__callouts--right reveal" style="transition-delay: 0.05s">
          <div
            v-for="(callout, i) in calloutsRight"
            :key="callout.title"
            class="callout callout--right"
            :class="{ 'callout--active': activeCalloutR === i }"
            @mouseenter="activeCalloutR = i"
          >
            <div class="callout__icon">{{ callout.icon }}</div>
            <div>
              <div class="callout__title">{{ callout.title }}</div>
              <div class="callout__desc">{{ callout.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from 'src/composables/useScrollReveal'

useScrollReveal('.reveal')

const activeCallout = ref(0)
const activeCalloutR = ref(0)

const callouts = [
  {
    icon: '💰',
    title: 'Real-time Balance',
    desc: 'Instantly reflects every transaction across all accounts.',
  },
  {
    icon: '📊',
    title: 'Budget Tracking',
    desc: 'Visual fill bars show category spending at a glance.',
  },
  {
    icon: '⚡',
    title: 'Quick Entry',
    desc: 'Log transactions in under 5 seconds with quick-add.',
  },
]

const calloutsRight = [
  {
    icon: '🎯',
    title: 'Smart Categories',
    desc: 'Organize spending into custom icon & color categories.',
  },
  {
    icon: '📱',
    title: 'Mobile-First',
    desc: 'Designed for thumb navigation on any screen size.',
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    desc: 'Easy on the eyes, day and night.',
  },
]

const accounts = [
  { name: 'Dutch-Bangla', emoji: '🏦', bal: '৳ 85,200', color: '#1d4ed8' },
  { name: 'bKash', emoji: '📱', bal: '৳ 39,300', color: '#15803d' },
  { name: 'Cash', emoji: '💵', bal: '৳ 1,000', color: '#7c3aed' },
]

const budgets = [
  { name: 'Food', pct: 72 },
  { name: 'Transport', pct: 45 },
  { name: 'Shopping', pct: 88 },
]

const transactions = [
  { name: 'Food & Dining', emoji: '🍜', date: 'Today 1:30 PM', type: 'expense', amount: '৳ 380', iconBg: 'rgba(239,68,68,0.15)' },
  { name: 'Monthly Salary', emoji: '💼', date: 'Yesterday', type: 'income', amount: '৳ 45,000', iconBg: 'rgba(34,197,94,0.15)' },
  { name: 'Grocery', emoji: '🛒', date: 'May 18', type: 'expense', amount: '৳ 2,450', iconBg: 'rgba(249,115,22,0.15)' },
]
</script>

<style scoped lang="scss">
.preview {
  padding: 100px 24px;

  &__inner {
    max-width: 1300px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: 72px;
  }

  &__title {
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 900;
    color: #f1f5f9;
    letter-spacing: -0.04em;
    margin: 12px 0 16px;
    line-height: 1.15;
  }

  &__subtitle {
    font-size: 1.05rem;
    color: #64748b;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.65;
  }

  &__layout {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 40px;
    align-items: center;

    @media (max-width: 1023px) {
      grid-template-columns: 1fr;
      gap: 48px;
    }
  }

  &__callouts {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &--right {
      @media (max-width: 1023px) {
        order: 3;
      }
    }

    @media (max-width: 1023px) {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 599px) {
      grid-template-columns: 1fr;
    }
  }

  &__screen {
    flex-shrink: 0;

    @media (max-width: 1023px) {
      max-width: 340px;
      margin: 0 auto;
      width: 100%;
    }
  }
}

.callout {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: default;
  transition: background 0.25s, border-color 0.25s;

  &--right {
    flex-direction: row-reverse;
    text-align: right;

    @media (max-width: 1023px) {
      flex-direction: column;
      text-align: left;
    }
  }

  &--active, &:hover {
    background: rgba(249, 115, 22, 0.05);
    border-color: rgba(249, 115, 22, 0.2);

    .callout__icon {
      background: rgba(249, 115, 22, 0.15);
    }
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
    transition: background 0.25s;
  }

  &__title {
    font-size: 0.88rem;
    font-weight: 700;
    color: #e2e8f0;
    margin-bottom: 4px;
  }

  &__desc {
    font-size: 0.78rem;
    color: #64748b;
    line-height: 1.5;
  }
}

// --- Phone Frame ---
.screen-frame {
  width: 280px;
  min-height: 560px;
  border-radius: 40px;
  background: #0a0f1a;
  border: 8px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 40px 80px rgba(0, 0, 0, 0.7),
    inset 0 0 60px rgba(249, 115, 22, 0.04);
  overflow: hidden;
  position: relative;

  @media (max-width: 1023px) {
    width: 100%;
    max-width: 320px;
  }
}

.screen-notch {
  width: 90px;
  height: 22px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0 0 14px 14px;
  margin: 0 auto 4px;
}

.screen-body {
  padding: 8px 12px 16px;
  height: 100%;
  overflow: hidden;
}

// screen components
.sc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.sc-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ef4444);
  color: #fff;
  font-weight: 800;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sc-hello {
  font-size: 0.62rem;
  font-weight: 700;
  color: #e2e8f0;
}

.sc-date {
  font-size: 0.55rem;
  color: #475569;
  margin-top: 1px;
}

.sc-bell {
  margin-left: auto;
  font-size: 0.9rem;
}

.sc-balance {
  position: relative;
  border-radius: 12px;
  padding: 12px;
  background: linear-gradient(145deg, #1e2d42 0%, #0f1e35 100%);
  margin-bottom: 10px;
  overflow: hidden;
}

.sc-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;

  &--1 {
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(249, 115, 22, 0.25), transparent 70%);
    top: -30px;
    right: -20px;
  }

  &--2 {
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%);
    bottom: -15px;
    left: 10px;
  }
}

.sc-balance-label {
  font-size: 0.58rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.sc-balance-amt {
  font-size: 1.4rem;
  font-weight: 900;
  color: #f1f5f9;
  letter-spacing: -0.04em;
  margin: 3px 0 8px;
}

.sc-balance-sub {
  display: flex;
  gap: 6px;
}

.sc-chip {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 100px;
  font-size: 0.58rem;
  font-weight: 700;

  &--green { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
  &--red { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
}

.sc-accounts {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.sc-account {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 7px 5px;
  text-align: center;
}

.sc-acc-icon {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  margin: 0 auto 4px;
}

.sc-acc-name {
  font-size: 0.52rem;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sc-acc-bal {
  font-size: 0.6rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-top: 2px;
}

.sc-section-lbl {
  font-size: 0.55rem;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}

.sc-budgets {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.sc-budget-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
}

.sc-budget-name {
  font-size: 0.6rem;
  color: #64748b;
  font-weight: 500;
}

.sc-budget-pct {
  font-size: 0.6rem;
  font-weight: 700;
}

.sc-budget-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.sc-budget-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease;
}

.sc-txs {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sc-tx {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 7px;
}

.sc-tx-icon {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  flex-shrink: 0;
}

.sc-tx-name {
  font-size: 0.62rem;
  font-weight: 600;
  color: #e2e8f0;
}

.sc-tx-date {
  font-size: 0.52rem;
  color: #334155;
}

.sc-tx-amt {
  margin-left: auto;
  font-size: 0.62rem;
  font-weight: 700;
  flex-shrink: 0;

  &--in { color: #22c55e; }
  &--out { color: #ef4444; }
}

.sc-greeting { flex: 1; min-width: 0; }

.section-badge {
  display: inline-block;
  padding: 5px 14px;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #f97316;
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
