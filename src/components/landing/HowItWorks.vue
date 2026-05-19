<template>
  <section class="hiw" id="how-it-works">
    <div class="hiw__bg">
      <div class="hiw__blob"></div>
    </div>

    <div class="hiw__inner">
      <div class="hiw__header reveal">
        <div class="section-badge">Process</div>
        <h2 class="hiw__title">Up and running in minutes</h2>
        <p class="hiw__subtitle">
          No complex setup. No importing bank statements. Just sign up and start tracking.
        </p>
      </div>

      <div class="hiw__steps">
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          class="hiw__step reveal"
          :style="{ transitionDelay: `${i * 0.15}s` }"
        >
          <div class="hiw__connector" v-if="i < steps.length - 1"></div>

          <div class="hiw__step-number">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="hiw__step-icon">{{ step.icon }}</div>
          <h3 class="hiw__step-title">{{ step.title }}</h3>
          <p class="hiw__step-desc">{{ step.desc }}</p>
          <div class="hiw__step-detail">{{ step.detail }}</div>
        </div>
      </div>

      <div class="hiw__cta reveal">
        <router-link to="/register" class="hiw__cta-btn">
          Start Tracking Now →
        </router-link>
        <p class="hiw__cta-note">Free forever. No credit card required.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from 'src/composables/useScrollReveal'

useScrollReveal('.reveal')

const steps = [
  {
    icon: '🏦',
    title: 'Add Your Accounts',
    desc: 'Connect your bank accounts, mobile wallets (bKash, Nagad), and cash holdings.',
    detail: 'Takes under 2 minutes',
  },
  {
    icon: '📝',
    title: 'Record Transactions',
    desc: 'Log income, expenses, and transfers with categories, notes, and amounts in seconds.',
    detail: 'Quick-add in 5 seconds',
  },
  {
    icon: '🎯',
    title: 'Set Your Budgets',
    desc: 'Define monthly spending limits per category. Visual alerts show when you\'re approaching limits.',
    detail: 'Smart budget alerts',
  },
  {
    icon: '📈',
    title: 'Analyze & Grow',
    desc: 'Explore detailed reports, identify spending patterns, and make smarter financial decisions.',
    detail: 'Rich analytics dashboard',
  },
]
</script>

<style scoped lang="scss">
.hiw {
  position: relative;
  padding: 100px 24px;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &__blob {
    position: absolute;
    width: 700px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: blur(60px);
  }

  &__inner {
    position: relative;
    max-width: 1200px;
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

  &__steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    position: relative;
    margin-bottom: 64px;

    @media (max-width: 1023px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 32px 48px;
    }

    @media (max-width: 599px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  &__step {
    position: relative;
    padding: 0 32px;
    text-align: center;

    @media (max-width: 1023px) {
      padding: 0;
    }
  }

  &__connector {
    position: absolute;
    top: 40px;
    right: 0;
    width: 50%;
    height: 1px;
    background: linear-gradient(90deg, rgba(249, 115, 22, 0.4), transparent);
    z-index: 0;

    @media (max-width: 1023px) {
      display: none;
    }
  }

  &__step-number {
    font-size: 0.7rem;
    font-weight: 800;
    color: rgba(249, 115, 22, 0.5);
    letter-spacing: 0.1em;
    margin-bottom: 16px;
  }

  &__step-icon {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin: 0 auto 20px;
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

    .hiw__step:hover & {
      transform: translateY(-4px);
      border-color: rgba(249, 115, 22, 0.3);
      box-shadow: 0 12px 32px rgba(249, 115, 22, 0.15);
    }
  }

  &__step-title {
    font-size: 1rem;
    font-weight: 800;
    color: #e2e8f0;
    margin: 0 0 10px;
    letter-spacing: -0.02em;
  }

  &__step-desc {
    font-size: 0.85rem;
    color: #64748b;
    line-height: 1.6;
    margin: 0 0 12px;
  }

  &__step-detail {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(249, 115, 22, 0.08);
    border: 1px solid rgba(249, 115, 22, 0.15);
    border-radius: 100px;
    font-size: 0.72rem;
    font-weight: 600;
    color: #f97316;
  }

  &__cta {
    text-align: center;
  }

  &__cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    background: linear-gradient(135deg, #f97316, #ef4444);
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 12px;
    text-decoration: none;
    box-shadow: 0 4px 24px rgba(249, 115, 22, 0.4);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    margin-bottom: 14px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(249, 115, 22, 0.55);
    }
  }

  &__cta-note {
    font-size: 0.82rem;
    color: #475569;
    margin: 0;
  }
}

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
