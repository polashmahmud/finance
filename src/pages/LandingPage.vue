<template>
  <q-page class="landing-page">
    <!-- ===== NAVBAR ===== -->
    <header class="landing-nav">
      <div class="landing-container landing-nav__inner">
        <!-- Logo -->
        <div class="landing-nav__logo row items-center q-gutter-sm no-wrap cursor-pointer" @click="scrollToTop">
          <q-icon name="account_balance_wallet" size="26px" color="dark" />
          <span class="text-weight-bold" style="font-size: 1.05rem; letter-spacing: -0.02em;">
            {{ $t('layout.financeManager') }}
          </span>
        </div>

        <!-- Desktop nav links -->
        <nav class="landing-nav__links row items-center q-gutter-md gt-xs">
          <a href="#features" class="landing-nav__link">{{ $t('landing.nav.features') }}</a>

          <!-- GitHub link -->
          <a href="https://github.com/polashmahmud/finance" target="_blank" rel="noopener noreferrer"
            class="landing-nav__link row items-center q-gutter-xs no-wrap">
            <q-icon name="mdi-github" size="18px" />
            <span>GitHub</span>
          </a>

          <!-- Language switcher -->
          <q-btn-toggle v-model="locale" toggle-color="dark" color="white" text-color="dark" unelevated dense rounded
            no-caps :options="langOptions" class="landing-lang-toggle" />

          <template v-if="isAuthenticated">
            <q-btn unelevated rounded no-caps color="dark" text-color="white" :label="$t('landing.nav.dashboard')"
              :to="'/dashboard'" size="sm" />
          </template>
          <template v-else>
            <q-btn flat rounded no-caps color="dark" :label="$t('landing.nav.login')" :to="'/login'" size="sm" />
            <q-btn unelevated rounded no-caps color="dark" text-color="white" :label="$t('landing.nav.register')"
              :to="'/register'" size="sm" />
          </template>
        </nav>

        <!-- Mobile: lang toggle + hamburger -->
        <div class="landing-nav__mobile row items-center q-gutter-sm lt-sm">
          <q-btn-toggle v-model="locale" toggle-color="dark" color="white" text-color="dark" unelevated dense rounded
            no-caps :options="langOptions" class="landing-lang-toggle" />
          <q-btn flat round dense icon="menu" color="dark" @click="mobileMenuOpen = !mobileMenuOpen" />
        </div>
      </div>

      <!-- Mobile dropdown menu -->
      <transition name="slide-down">
        <div v-if="mobileMenuOpen" class="landing-mobile-menu">
          <div class="landing-container">
            <a href="#features" class="landing-mobile-menu__item" @click="mobileMenuOpen = false">
              <q-icon name="star_outline" size="18px" class="q-mr-sm" />
              {{ $t('landing.nav.features') }}
            </a>
            <template v-if="isAuthenticated">
              <router-link to="/dashboard" class="landing-mobile-menu__item" @click="mobileMenuOpen = false">
                <q-icon name="dashboard" size="18px" class="q-mr-sm" />
                {{ $t('landing.nav.dashboard') }}
              </router-link>
            </template>
            <template v-else>
              <router-link to="/login" class="landing-mobile-menu__item" @click="mobileMenuOpen = false">
                <q-icon name="login" size="18px" class="q-mr-sm" />
                {{ $t('landing.nav.login') }}
              </router-link>
              <router-link to="/register" class="landing-mobile-menu__item" @click="mobileMenuOpen = false">
                <q-icon name="person_add" size="18px" class="q-mr-sm" />
                {{ $t('landing.nav.register') }}
              </router-link>
            </template>
            <a href="https://github.com/polashmahmud/finance" target="_blank" rel="noopener noreferrer"
              class="landing-mobile-menu__item" @click="mobileMenuOpen = false">
              <q-icon name="mdi-github" size="18px" class="q-mr-sm" />
              GitHub
            </a>
          </div>
        </div>
      </transition>
    </header>

    <!-- ===== HERO ===== -->
    <section class="landing-hero">
      <div class="landing-container landing-hero__inner">
        <div class="landing-hero__badge">
          <q-icon name="account_balance_wallet" size="16px" class="q-mr-xs" />
          {{ $t('landing.hero.badge') }}
        </div>

        <h1 class="landing-hero__title">
          {{ $t('landing.hero.title') }}&nbsp;<span class="landing-hero__highlight">{{ $t('landing.hero.titleHighlight')
            }}</span>
        </h1>

        <p class="landing-hero__subtitle">{{ $t('landing.hero.subtitle') }}</p>

        <div class="landing-hero__actions row items-center q-gutter-md">
          <template v-if="isAuthenticated">
            <q-btn unelevated rounded no-caps color="dark" text-color="white" :label="$t('landing.nav.dashboard')"
              to="/dashboard" size="md" class="landing-btn-primary" />
          </template>
          <template v-else>
            <q-btn unelevated rounded no-caps color="dark" text-color="white" :label="$t('landing.hero.ctaStart')"
              to="/register" size="md" class="landing-btn-primary" />
            <q-btn outline rounded no-caps color="dark" :label="$t('landing.hero.ctaLogin')" to="/login" size="md" />
          </template>
        </div>

        <!-- Stats row -->
        <div class="landing-hero__stats row q-gutter-lg q-mt-xl">
          <div v-for="stat in stats" :key="stat.label" class="landing-stat column items-center">
            <div class="landing-stat__value">{{ stat.value }}</div>
            <div class="landing-stat__label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Decorative shapes -->
      <div class="landing-hero__shape landing-hero__shape--1" aria-hidden="true" />
      <div class="landing-hero__shape landing-hero__shape--2" aria-hidden="true" />
    </section>

    <!-- ===== FEATURES ===== -->
    <section id="features" class="landing-features">
      <div class="landing-container">
        <div class="landing-section-header text-center q-mb-xl">
          <div class="landing-section-badge q-mb-sm">{{ $t('landing.features.sectionTitle') }}</div>
          <h2 class="landing-section-title">
            {{ $t('landing.features.sectionTitleHighlight') }}
          </h2>
        </div>

        <div class="landing-features-grid">
          <div v-for="feature in features" :key="feature.icon" class="landing-feature-card">
            <div class="landing-feature-card__icon">
              <q-icon :name="feature.icon" size="24px" color="dark" />
            </div>
            <h3 class="landing-feature-card__title">{{ feature.title }}</h3>
            <p class="landing-feature-card__desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA BANNER ===== -->
    <section class="landing-cta">
      <div class="landing-container landing-cta__inner text-center">
        <h2 class="landing-cta__title">{{ $t('landing.cta.title') }}</h2>
        <p class="landing-cta__subtitle">{{ $t('landing.cta.subtitle') }}</p>
        <template v-if="isAuthenticated">
          <q-btn unelevated rounded no-caps color="white" text-color="dark" :label="$t('landing.nav.dashboard')"
            to="/dashboard" size="md" class="landing-btn-inverted" />
        </template>
        <template v-else>
          <q-btn unelevated rounded no-caps color="white" text-color="dark" :label="$t('landing.cta.button')"
            to="/register" size="md" class="landing-btn-inverted" />
        </template>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="landing-footer">
      <div class="landing-container landing-footer__inner">
        <div class="row items-center q-gutter-sm">
          <q-icon name="account_balance_wallet" size="18px" color="grey-6" />
          <span class="text-weight-medium text-grey-7" style="font-size: 0.9rem;">
            {{ $t('layout.financeManager') }}
          </span>
        </div>
        <div class="row items-center q-gutter-md">
          <a href="https://github.com/polashmahmud/finance" target="_blank" rel="noopener noreferrer"
            class="row items-center q-gutter-xs text-grey-6 no-decoration"
            style="font-size: 0.85rem; text-decoration: none;">
            <q-icon name="mdi-github" size="18px" />
            <span>GitHub</span>
          </a>
          <div class="text-grey-6" style="font-size: 0.8rem;">
            &copy; {{ currentYear }} {{ $t('landing.footer.rights') }}
          </div>
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/authStore'

const { t, locale } = useI18n()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentYear = new Date().getFullYear()
const mobileMenuOpen = ref(false)

const langOptions = [
  { label: 'EN', value: 'en' },
  { label: 'বাং', value: 'bn' },
]

const stats = computed(() => [
  { value: '6+', label: t('landing.nav.features') },
  { value: '100%', label: 'Free' },
  { value: '🔒', label: t('landing.features.f6Title') },
])

const features = computed(() => [
  {
    icon: 'swap_vert',
    title: t('landing.features.f1Title'),
    desc: t('landing.features.f1Desc'),
  },
  {
    icon: 'savings',
    title: t('landing.features.f2Title'),
    desc: t('landing.features.f2Desc'),
  },
  {
    icon: 'account_balance_wallet',
    title: t('landing.features.f3Title'),
    desc: t('landing.features.f3Desc'),
  },
  {
    icon: 'shopping_cart',
    title: t('landing.features.f4Title'),
    desc: t('landing.features.f4Desc'),
  },
  {
    icon: 'bar_chart',
    title: t('landing.features.f5Title'),
    desc: t('landing.features.f5Desc'),
  },
  {
    icon: 'lock',
    title: t('landing.features.f6Title'),
    desc: t('landing.features.f6Desc'),
  },
])

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
// ===== LAYOUT =====
.landing-page {
  background: #ffffff;
  color: #111111;
  font-family: inherit;
}

.landing-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}

// ===== NAVBAR =====
.landing-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e5e5e5;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }

  &__logo {
    text-decoration: none;
    color: inherit;
    flex-shrink: 0;
  }

  &__links {
    display: flex;
    align-items: center;
  }

  &__link {
    color: #444;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.15s;

    &:hover {
      color: #111;
    }
  }

  &__mobile {
    display: flex;
    align-items: center;
  }
}

.landing-lang-toggle {
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 0.75rem !important;

  :deep(.q-btn) {
    font-size: 0.75rem;
    padding: 2px 10px;
    min-height: 28px;
  }
}

// Mobile menu
.landing-mobile-menu {
  background: #fff;
  border-top: 1px solid #eee;
  padding: 8px 0 12px;

  &__item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    color: #333;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      color: #111;
    }
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 300px;
}

// ===== HERO =====
.landing-hero {
  position: relative;
  padding: 80px 0 100px;
  overflow: hidden;
  background: linear-gradient(160deg, #fafafa 0%, #f0f0f0 100%);

  &__inner {
    position: relative;
    z-index: 1;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    background: #111;
    color: #fff;
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  &__title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    margin: 0 0 20px;
    max-width: 680px;
  }

  &__highlight {
    background: linear-gradient(135deg, #111 0%, #555 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: underline;
    text-decoration-color: rgba(17, 17, 17, 0.25);
    text-underline-offset: 6px;
  }

  &__subtitle {
    font-size: 1.1rem;
    color: #555;
    line-height: 1.7;
    max-width: 560px;
    margin: 0 0 36px;
  }

  &__actions {
    flex-wrap: wrap;
  }

  &__stats {
    flex-wrap: wrap;
  }

  &__shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.06;
    background: #111;

    &--1 {
      width: 500px;
      height: 500px;
      right: -100px;
      top: -150px;
    }

    &--2 {
      width: 300px;
      height: 300px;
      right: 200px;
      bottom: -80px;
    }
  }
}

.landing-stat {
  &__value {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  &__label {
    font-size: 0.78rem;
    color: #666;
    font-weight: 500;
    text-align: center;
    margin-top: 2px;
  }
}

// ===== BUTTONS =====
.landing-btn-primary {
  padding: 0 28px !important;
  font-size: 0.95rem !important;
  height: 44px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15) !important;
}

.landing-btn-inverted {
  padding: 0 32px !important;
  font-size: 1rem !important;
  height: 48px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
}

// ===== SECTION HEADER =====
.landing-section-header {
  max-width: 560px;
  margin: 0 auto;
}

.landing-section-badge {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.landing-section-title {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin: 0;
}

// ===== FEATURES =====
.landing-features {
  padding: 80px 0;
  background: #ffffff;
}

.landing-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.landing-feature-card {
  padding: 28px;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  transition: box-shadow 0.2s, transform 0.2s;
  background: #fff;

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: #f5f5f5;
    border-radius: 12px;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 8px;
    letter-spacing: -0.01em;
  }

  &__desc {
    font-size: 0.875rem;
    color: #666;
    line-height: 1.65;
    margin: 0;
  }
}

// ===== CTA BANNER =====
.landing-cta {
  background: #111111;
  color: #ffffff;
  padding: 80px 0;

  &__inner {
    max-width: 600px;
  }

  &__title {
    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    margin: 0 0 16px;
    color: #fff;
  }

  &__subtitle {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.7;
    margin: 0 0 36px;
  }
}

// ===== FOOTER =====
.landing-footer {
  border-top: 1px solid #e5e5e5;
  padding: 24px 0;
  background: #fafafa;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
}

// ===== RESPONSIVE =====
@media (max-width: 599px) {
  .landing-hero {
    padding: 56px 0 72px;

    &__title {
      font-size: 2rem;
    }

    &__subtitle {
      font-size: 1rem;
    }
  }

  .landing-features {
    padding: 56px 0;
  }

  .landing-features-grid {
    grid-template-columns: 1fr;
  }

  .landing-cta {
    padding: 56px 0;
  }

  .landing-footer__inner {
    justify-content: center;
    text-align: center;
  }
}
</style>
