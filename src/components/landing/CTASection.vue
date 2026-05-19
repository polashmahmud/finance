<template>
  <section class="cta">
    <div class="cta__bg">
      <div class="cta__blob cta__blob--1"></div>
      <div class="cta__blob cta__blob--2"></div>
    </div>

    <div class="cta__inner reveal">
      <div class="cta__card">
        <div class="cta__glow"></div>

        <div class="cta__badge">🚀 Get Started Today</div>
        <h2 class="cta__title">
          Take control of your<br />
          <span class="cta__title-gradient">financial future</span>
        </h2>
        <p class="cta__subtitle">
          Join 10,000+ people who use MyFinance to track expenses, manage budgets, and
          reach their financial goals. Free. Forever.
        </p>

        <div class="cta__actions">
          <router-link to="/register" class="cta__btn-primary">
            Create Free Account
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
          <router-link to="/login" class="cta__btn-secondary">
            Sign In →
          </router-link>
        </div>

        <div class="cta__perks">
          <div v-for="perk in perks" :key="perk" class="cta__perk">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#2f7d5c">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ perk }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from 'src/composables/useScrollReveal'

useScrollReveal('.reveal')

const perks = [
  'No credit card required',
  'Free forever — no hidden fees',
  'Works offline on all devices',
  'Bengali & English support',
]
</script>

<style scoped lang="scss">
.cta {
  position: relative;
  padding: 80px 24px 120px;
  overflow: hidden;
  background: #16161a;

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &__blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);

    &--1 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(47, 125, 92, 0.18) 0%, transparent 70%);
      top: -100px;
      left: -100px;
    }

    &--2 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(42, 102, 149, 0.12) 0%, transparent 70%);
      bottom: -100px;
      right: -50px;
    }
  }

  &__inner {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }

  &__card {
    position: relative;
    padding: 64px 48px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(47, 125, 92, 0.2);
    border-radius: 28px;
    text-align: center;
    overflow: hidden;

    @media (max-width: 599px) {
      padding: 48px 24px;
    }
  }

  &__glow {
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
    height: 300px;
    background: radial-gradient(ellipse, rgba(47, 125, 92, 0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  &__badge {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(47, 125, 92, 0.12);
    border: 1px solid rgba(47, 125, 92, 0.3);
    border-radius: 100px;
    font-size: 0.82rem;
    font-weight: 700;
    color: #2f7d5c;
    margin-bottom: 24px;
  }

  &__title {
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 900;
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: -0.04em;
    line-height: 1.15;
    margin: 0 0 20px;

    &-gradient {
      background: linear-gradient(135deg, #2f7d5c 0%, #2a6695 60%, rgba(255,255,255,0.7) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__subtitle {
    font-size: 1.05rem;
    color: rgba(255, 255, 255, 0.42);
    line-height: 1.7;
    max-width: 520px;
    margin: 0 auto 40px;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 32px;
  }

  &__btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 36px;
    background: #2f7d5c;
    color: #fff;
    font-size: 1.05rem;
    font-weight: 700;
    border-radius: 14px;
    text-decoration: none;
    box-shadow: 0 4px 28px rgba(47, 125, 92, 0.45);
    transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 36px rgba(47, 125, 92, 0.6);
      opacity: 0.92;
    }

    svg {
      transition: transform 0.25s ease;
    }

    &:hover svg {
      transform: translateX(3px);
    }
  }

  &__btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 16px 24px;
    color: rgba(255, 255, 255, 0.45);
    font-size: 1rem;
    font-weight: 600;
    border-radius: 14px;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: color 0.2s, border-color 0.2s, background 0.2s;

    &:hover {
      color: rgba(255, 255, 255, 0.88);
      border-color: rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &__perks {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;

    @media (max-width: 599px) {
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
  }

  &__perk {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.35);
    font-weight: 500;
  }
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
