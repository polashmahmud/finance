<template>
  <section class="trusted">
    <div class="trusted__inner">
      <p class="trusted__label reveal">Trusted by finance-savvy people across South Asia</p>

      <div class="trusted__stats reveal">
        <div v-for="stat in stats" :key="stat.value" class="trusted__stat">
          <div class="trusted__stat-value">{{ stat.value }}</div>
          <div class="trusted__stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <div class="trusted__platforms reveal">
        <div class="trusted__platform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          iOS App
        </div>
        <div class="trusted__platform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0007.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 10.1867.3432 13.2986 0 17h24c-.3435-3.7014-2.6892-6.8133-6.1185-8.6786"/>
          </svg>
          Android App
        </div>
        <div class="trusted__platform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          Web App
        </div>
        <div class="trusted__platform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Offline-First
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useScrollReveal } from 'src/composables/useScrollReveal'

useScrollReveal('.reveal')

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '৳500Cr+', label: 'Money Tracked' },
  { value: '50+', label: 'Currencies' },
  { value: '4.9★', label: 'User Rating' },
]
</script>

<style scoped lang="scss">
.trusted {
  padding: 60px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  &__label {
    font-size: 0.85rem;
    color: #475569;
    font-weight: 500;
    margin: 0 0 40px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 48px;

    @media (max-width: 767px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__stat {
    padding: 28px 20px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 16px;
    transition: background 0.25s, border-color 0.25s;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(249, 115, 22, 0.2);
    }

    &-value {
      font-size: 2.2rem;
      font-weight: 900;
      background: linear-gradient(135deg, #f97316, #ef4444);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.04em;
      margin-bottom: 6px;
    }

    &-label {
      font-size: 0.82rem;
      color: #64748b;
      font-weight: 500;
    }
  }

  &__platforms {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__platform {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 100px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
    transition: color 0.2s, border-color 0.2s, background 0.2s;

    &:hover {
      color: #94a3b8;
      border-color: rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.06);
    }
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
