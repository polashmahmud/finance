<template>
  <section class="integrations">
    <div class="integrations__inner">
      <div class="integrations__header reveal">
        <div class="section-badge">Integrations</div>
        <h2 class="integrations__title">Works with your financial life</h2>
        <p class="integrations__subtitle">
          Track money across all your accounts — banks, mobile wallets, cash, and more.
        </p>
      </div>

      <div class="integrations__grid reveal" style="transition-delay: 0.1s">
        <div
          v-for="item in integrations"
          :key="item.name"
          class="integration-card"
        >
          <div class="integration-card__icon" :style="{ background: item.bg }">
            {{ item.emoji }}
          </div>
          <div class="integration-card__name">{{ item.name }}</div>
          <div class="integration-card__type">{{ item.type }}</div>
        </div>
      </div>

      <div class="integrations__note reveal" style="transition-delay: 0.2s">
        <div class="integrations__note-inner">
          <span class="integrations__note-icon">💡</span>
          <span>
            No bank API required. Simply log transactions manually — works with any bank, anywhere in the world.
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from 'src/composables/useScrollReveal'

useScrollReveal('.reveal')

const integrations = [
  { emoji: '🏦', name: 'Dutch-Bangla Bank', type: 'Commercial Bank', bg: 'rgba(59,130,246,0.15)' },
  { emoji: '📱', name: 'bKash', type: 'Mobile Banking', bg: 'rgba(236,72,153,0.15)' },
  { emoji: '🌿', name: 'Nagad', type: 'Mobile Banking', bg: 'rgba(34,197,94,0.15)' },
  { emoji: '🔷', name: 'Rocket', type: 'Mobile Banking', bg: 'rgba(139,92,246,0.15)' },
  { emoji: '🏛️', name: 'Any Bank', type: 'All Banks Supported', bg: 'rgba(249,115,22,0.15)' },
  { emoji: '💵', name: 'Cash', type: 'Physical Cash', bg: 'rgba(234,179,8,0.15)' },
  { emoji: '💳', name: 'Credit Card', type: 'Credit & Debit', bg: 'rgba(239,68,68,0.15)' },
  { emoji: '🌍', name: 'Foreign Currency', type: '50+ Currencies', bg: 'rgba(20,184,166,0.15)' },
]
</script>

<style scoped lang="scss">
.integrations {
  padding: 100px 24px;
  background: #fafaf7;
  border-top: 1px solid #e9e5dc;

  &__inner {
    max-width: 1000px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: 56px;
  }

  &__title {
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
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

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;

    @media (max-width: 1023px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 767px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__note {
    display: flex;
    justify-content: center;
  }

  &__note-inner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 20px;
    background: rgba(42, 102, 149, 0.05);
    border: 1px solid rgba(42, 102, 149, 0.15);
    border-radius: 12px;
    font-size: 0.85rem;
    color: #7c7a73;
    line-height: 1.5;
    max-width: 600px;
    text-align: left;
  }

  &__note-icon {
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: 1px;
  }
}

.integration-card {
  padding: 20px 16px;
  background: #ffffff;
  border: 1px solid #e9e5dc;
  border-radius: 16px;
  text-align: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: #d4d0c8;
    box-shadow: 0 8px 24px rgba(22, 22, 26, 0.08);
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 12px;
  }

  &__name {
    font-size: 0.8rem;
    font-weight: 700;
    color: #16161a;
    margin-bottom: 4px;
  }

  &__type {
    font-size: 0.7rem;
    color: #7c7a73;
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
