<template>
  <section class="features" id="features">
    <div class="features__inner">
      <div class="features__header reveal">
        <div class="section-badge">Features</div>
        <h2 class="features__title">Everything your finances need</h2>
        <p class="features__subtitle">
          From daily expense tracking to long-term loan management — MyFinance covers every corner of your financial life.
        </p>
      </div>

      <div class="features__grid">
        <div
          v-for="(feature, i) in features"
          :key="feature.title"
          class="feature-card reveal"
          :style="{ transitionDelay: `${i * 0.08}s` }"
          :class="{ 'feature-card--highlight': feature.highlight }"
        >
          <div class="feature-card__icon" :style="{ background: feature.iconBg }">
            <span>{{ feature.icon }}</span>
          </div>
          <h3 class="feature-card__title">{{ feature.title }}</h3>
          <p class="feature-card__desc">{{ feature.desc }}</p>
          <div v-if="feature.tags" class="feature-card__tags">
            <span v-for="tag in feature.tags" :key="tag" class="feature-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from 'src/composables/useScrollReveal'

useScrollReveal('.reveal')

const features = [
  {
    icon: '🏦',
    iconBg: 'rgba(59, 130, 246, 0.15)',
    title: 'Multi-Account Tracking',
    desc: 'Manage bank accounts, mobile banking, and cash wallets. See your complete financial picture in one view.',
    tags: ['Bank', 'bKash', 'Nagad', 'Cash'],
    highlight: false,
  },
  {
    icon: '📊',
    iconBg: 'rgba(139, 92, 246, 0.15)',
    title: 'Smart Budget Tracking',
    desc: 'Set monthly budgets per category. Visual fill bars show exactly how much you\'ve spent versus planned.',
    tags: ['Monthly', 'Categories', 'Alerts'],
    highlight: true,
  },
  {
    icon: '📈',
    iconBg: 'rgba(34, 197, 94, 0.15)',
    title: 'Reports & Analytics',
    desc: 'Beautiful charts showing income vs expense trends, category breakdowns, and budget vs actual comparisons.',
    tags: ['Charts', 'Trends', 'Export'],
    highlight: false,
  },
  {
    icon: '🤝',
    iconBg: 'rgba(249, 115, 22, 0.15)',
    title: 'Loan Management',
    desc: 'Track money you lend and borrow. Set scheduled installments with automatic monthly due reminders.',
    tags: ['Receivable', 'Payable', 'Scheduled'],
    highlight: false,
  },
  {
    icon: '🌐',
    iconBg: 'rgba(20, 184, 166, 0.15)',
    title: 'Offline-First',
    desc: 'Works without internet. All your data syncs automatically when connection returns. Never lose a transaction.',
    tags: ['PWA', 'Sync', 'Reliable'],
    highlight: false,
  },
  {
    icon: '🌏',
    iconBg: 'rgba(236, 72, 153, 0.15)',
    title: 'Multi-Language & Currency',
    desc: 'Full Bengali and English support with Bengali numerals. Supports 50+ currencies with custom formatting.',
    tags: ['বাংলা', 'English', '50+ Currencies'],
    highlight: false,
  },
  {
    icon: '🛒',
    iconBg: 'rgba(234, 179, 8, 0.15)',
    title: 'Shopping Lists',
    desc: 'Create smart shopping lists with checkable items. Organize your market runs and never forget anything.',
    highlight: false,
    tags: [],
  },
  {
    icon: '🔒',
    iconBg: 'rgba(239, 68, 68, 0.15)',
    title: 'PIN App Lock',
    desc: 'Protect your financial data with a secure PIN lock screen. Keep your money details private.',
    highlight: false,
    tags: [],
  },
  {
    icon: '⚡',
    iconBg: 'rgba(59, 130, 246, 0.15)',
    title: 'Instant Entry',
    desc: 'Quick-add dialogs for rapid income and expense logging. Record transactions in under 5 seconds.',
    highlight: false,
    tags: [],
  },
]
</script>

<style scoped lang="scss">
.features {
  padding: 100px 24px;
  background: #fafaf7;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: 64px;
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
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.65;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 1023px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 599px) {
      grid-template-columns: 1fr;
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

.feature-card {
  padding: 28px 24px;
  background: #ffffff;
  border: 1px solid #e9e5dc;
  border-radius: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: default;

  &:hover {
    transform: translateY(-4px);
    border-color: #d4d0c8;
    box-shadow: 0 12px 32px rgba(22, 22, 26, 0.08);
  }

  &--highlight {
    background: #f0f7f4;
    border-color: rgba(47, 125, 92, 0.2);

    &:hover {
      border-color: rgba(47, 125, 92, 0.35);
      box-shadow: 0 12px 32px rgba(47, 125, 92, 0.1);
    }
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #16161a;
    margin: 0 0 8px;
    letter-spacing: -0.02em;
  }

  &__desc {
    font-size: 0.88rem;
    color: #7c7a73;
    line-height: 1.6;
    margin: 0 0 16px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}

.feature-tag {
  padding: 3px 9px;
  background: #f5f1e8;
  border: 1px solid #e9e5dc;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #7c7a73;
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
