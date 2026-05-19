<template>
  <section class="testimonials" id="testimonials">
    <div class="testimonials__bg">
      <div class="testimonials__blob"></div>
    </div>

    <div class="testimonials__inner">
      <div class="testimonials__header reveal">
        <div class="section-badge">Testimonials</div>
        <h2 class="testimonials__title">Loved by thousands of users</h2>
        <p class="testimonials__subtitle">
          Real people. Real finances. Real results.
        </p>
      </div>

      <div class="testimonials__grid">
        <div
          v-for="(t, i) in testimonials"
          :key="t.name"
          class="testimonial-card reveal"
          :style="{ transitionDelay: `${i * 0.1}s` }"
        >
          <div class="testimonial-card__stars">
            <span v-for="n in 5" :key="n">⭐</span>
          </div>
          <blockquote class="testimonial-card__quote">"{{ t.quote }}"</blockquote>
          <div class="testimonial-card__author">
            <div class="testimonial-card__avatar" :style="{ background: t.color }">
              {{ t.initials }}
            </div>
            <div>
              <div class="testimonial-card__name">{{ t.name }}</div>
              <div class="testimonial-card__role">{{ t.role }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="testimonials__rating reveal" style="transition-delay: 0.3s">
        <div class="rating-card">
          <div class="rating-card__stars">⭐⭐⭐⭐⭐</div>
          <div class="rating-card__score">4.9 / 5</div>
          <div class="rating-card__desc">Average rating from 10,000+ users</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from 'src/composables/useScrollReveal'

useScrollReveal('.reveal')

const testimonials = [
  {
    quote:
      'MyFinance changed how I manage money. The Bengali support is perfect for me, and tracking loans between friends is so easy now.',
    name: 'Rahim Uddin',
    role: 'Software Engineer, Dhaka',
    initials: 'RU',
    color: 'linear-gradient(135deg, #2f7d5c, #2a6695)',
  },
  {
    quote:
      'I used to spend hours on spreadsheets. Now I log everything in seconds. The budget tracking feature is a game-changer for controlling my spending.',
    name: 'Nusrat Jahan',
    role: 'Freelance Designer, Chittagong',
    initials: 'NJ',
    color: 'linear-gradient(135deg, #2a6695, #16161a)',
  },
  {
    quote:
      'Works offline perfectly during my commute. My Finance syncs when I get home. The reports help me plan every month in advance.',
    name: 'Arif Hassan',
    role: 'Business Owner, Sylhet',
    initials: 'AH',
    color: 'linear-gradient(135deg, #2f7d5c, #3a3a40)',
  },
  {
    quote:
      'The loan management feature alone is worth it. I track everything I lend to family with installment schedules. No more awkward conversations!',
    name: 'Sharmin Akter',
    role: 'Teacher, Rajshahi',
    initials: 'SA',
    color: 'linear-gradient(135deg, #b14437, #b16a26)',
  },
  {
    quote:
      'Finally an app that understands my financial needs. Multiple accounts, budgets, and the dark mode is gorgeous. 10/10 would recommend.',
    name: 'Kamal Hossain',
    role: 'Medical Professional, Comilla',
    initials: 'KH',
    color: 'linear-gradient(135deg, #2a6695, #2f7d5c)',
  },
  {
    quote:
      'The shopping list feature is a bonus I didn\'t expect! My family uses it every weekend. The PIN lock keeps my data private from curious eyes.',
    name: 'Fatema Begum',
    role: 'Homemaker, Khulna',
    initials: 'FB',
    color: 'linear-gradient(135deg, #b16a26, #16161a)',
  },
]
</script>

<style scoped lang="scss">
.testimonials {
  position: relative;
  padding: 100px 24px;
  overflow: hidden;
  background: #f5f1e8;

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &__blob {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(47, 125, 92, 0.06) 0%, transparent 70%);
    bottom: -200px;
    right: -100px;
    filter: blur(60px);
  }

  &__inner {
    position: relative;
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
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.65;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 48px;

    @media (max-width: 1023px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 599px) {
      grid-template-columns: 1fr;
    }
  }

  &__rating {
    display: flex;
    justify-content: center;
  }
}

.testimonial-card {
  padding: 28px 24px;
  background: #ffffff;
  border: 1px solid #e9e5dc;
  border-radius: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: #d4d0c8;
    box-shadow: 0 12px 32px rgba(22, 22, 26, 0.08);
  }

  &__stars {
    font-size: 0.8rem;
    margin-bottom: 14px;
    letter-spacing: 1px;
  }

  &__quote {
    font-size: 0.9rem;
    color: #7c7a73;
    line-height: 1.7;
    margin: 0 0 20px;
    font-style: normal;
    quotes: none;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.85rem;
    color: #fff;
    flex-shrink: 0;
  }

  &__name {
    font-size: 0.88rem;
    font-weight: 700;
    color: #16161a;
  }

  &__role {
    font-size: 0.75rem;
    color: #7c7a73;
    margin-top: 2px;
  }
}

.rating-card {
  text-align: center;
  padding: 28px 48px;
  background: rgba(47, 125, 92, 0.06);
  border: 1px solid rgba(47, 125, 92, 0.15);
  border-radius: 20px;

  &__stars {
    font-size: 1.4rem;
    letter-spacing: 3px;
    margin-bottom: 8px;
  }

  &__score {
    font-size: 2.4rem;
    font-weight: 900;
    color: #16161a;
    letter-spacing: -0.04em;
    margin-bottom: 6px;
  }

  &__desc {
    font-size: 0.82rem;
    color: #7c7a73;
    font-weight: 500;
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
