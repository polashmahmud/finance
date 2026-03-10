<template>
  <q-page class="lp">
    <!-- ===== NAVBAR ===== -->
    <header class="lp-nav">
      <div class="lp-container lp-nav__inner">
        <!-- Logo -->
        <div class="lp-nav__logo row items-center no-wrap cursor-pointer" @click="scrollToTop">
          <div class="lp-logo-icon">
            <q-icon name="account_balance_wallet" size="18px" />
          </div>
          <span class="lp-nav__brand">
            {{ $t('layout.financeManager') }}
          </span>
        </div>

        <!-- Desktop nav links -->
        <nav class="lp-nav__links gt-xs">
          <a href="#features" class="lp-nav__link">{{ $t('landing.nav.features') }}</a>
          <a href="#getapp" class="lp-nav__link">{{ $t('landing.getApp.navLabel') }}</a>
          <a href="https://github.com/polashmahmud/finance" target="_blank" rel="noopener noreferrer" class="lp-nav__link lp-nav__link--icon">
            <q-icon name="mdi-github" size="16px" />
            GitHub
          </a>
          <q-btn-toggle v-model="locale" toggle-color="dark" color="white" text-color="dark" unelevated dense rounded
            no-caps :options="langOptions" class="lp-lang-toggle" />
          <template v-if="isAuthenticated">
            <q-btn unelevated no-caps color="dark" text-color="white" :label="$t('landing.nav.dashboard')"
              :to="'/dashboard'" size="sm" style="border-radius:8px;" />
          </template>
          <template v-else>
            <q-btn flat no-caps color="dark" :label="$t('landing.nav.login')" :to="'/login'" size="sm" />
            <q-btn unelevated no-caps color="dark" text-color="white" :label="$t('landing.nav.register')"
              :to="'/register'" size="sm" style="border-radius:8px;" />
          </template>
        </nav>

        <!-- Mobile: lang + hamburger -->
        <div class="lp-nav__mobile lt-sm row items-center q-gutter-xs">
          <q-btn-toggle v-model="locale" toggle-color="dark" color="white" text-color="dark" unelevated dense rounded
            no-caps :options="langOptions" class="lp-lang-toggle" />
          <q-btn flat round dense icon="menu" color="dark" @click="mobileMenuOpen = !mobileMenuOpen" />
        </div>
      </div>

      <!-- Mobile menu -->
      <transition name="slide-down">
        <div v-if="mobileMenuOpen" class="lp-mobile-menu">
          <div class="lp-container">
            <a href="#features" class="lp-mobile-menu__item" @click="mobileMenuOpen = false">{{ $t('landing.nav.features') }}</a>
            <a href="#getapp" class="lp-mobile-menu__item" @click="mobileMenuOpen = false">{{ $t('landing.getApp.navLabel') }}</a>
            <template v-if="isAuthenticated">
              <router-link to="/dashboard" class="lp-mobile-menu__item" @click="mobileMenuOpen = false">{{ $t('landing.nav.dashboard') }}</router-link>
            </template>
            <template v-else>
              <router-link to="/login" class="lp-mobile-menu__item" @click="mobileMenuOpen = false">{{ $t('landing.nav.login') }}</router-link>
              <router-link to="/register" class="lp-mobile-menu__item" @click="mobileMenuOpen = false">{{ $t('landing.nav.register') }}</router-link>
            </template>
            <a href="https://github.com/polashmahmud/finance" target="_blank" rel="noopener noreferrer" class="lp-mobile-menu__item" @click="mobileMenuOpen = false">GitHub</a>
          </div>
        </div>
      </transition>
    </header>

    <!-- ===== HERO ===== -->
    <section class="lp-hero">
      <div class="lp-container">
        <div class="lp-hero__inner">
          <!-- Left: text -->
          <div class="lp-hero__text">
            <div class="lp-hero__eyebrow">{{ $t('landing.hero.badge') }}</div>
            <h1 class="lp-hero__title">{{ $t('landing.hero.title') }}<br><span class="lp-hero__accent">{{ $t('landing.hero.titleHighlight') }}</span></h1>
            <p class="lp-hero__sub">{{ $t('landing.hero.subtitle') }}</p>
            <div class="lp-hero__actions">
              <template v-if="isAuthenticated">
                <q-btn unelevated no-caps color="dark" text-color="white" :label="$t('landing.nav.dashboard')"
                  to="/dashboard" size="md" class="lp-btn-primary" />
              </template>
              <template v-else>
                <q-btn unelevated no-caps color="dark" text-color="white" :label="$t('landing.hero.ctaStart')"
                  to="/register" size="md" class="lp-btn-primary" />
                <q-btn flat no-caps color="dark" :label="$t('landing.hero.ctaLogin')" to="/login" size="md" class="lp-btn-ghost" />
              </template>
            </div>
            <div class="lp-hero__stats">
              <div v-for="stat in stats" :key="stat.label" class="lp-stat">
                <span class="lp-stat__val">{{ stat.value }}</span>
                <span class="lp-stat__lbl">{{ stat.label }}</span>
              </div>
            </div>
          </div>
          <!-- Right: visual card -->
          <div class="lp-hero__visual" aria-hidden="true">
            <div class="lp-mockcard">
              <div class="lp-mockcard__header">
                <span class="lp-mockcard__dot" style="background:#ff5f57"></span>
                <span class="lp-mockcard__dot" style="background:#febc2e"></span>
                <span class="lp-mockcard__dot" style="background:#28c840"></span>
              </div>
              <div class="lp-mockcard__balance-label">{{ $t('dashboard.totalBalance') }}</div>
              <div class="lp-mockcard__balance">৳ 1,24,500</div>
              <div class="lp-mockcard__chips">
                <span class="lp-mockcard__chip lp-mockcard__chip--green"><q-icon name="arrow_upward" size="12px" /> ৳ 45,000</span>
                <span class="lp-mockcard__chip lp-mockcard__chip--red"><q-icon name="arrow_downward" size="12px" /> ৳ 18,200</span>
              </div>
              <div class="lp-mockcard__divider"></div>
              <div v-for="row in mockRows" :key="row.label" class="lp-mockcard__row">
                <div class="lp-mockcard__row-left">
                  <span class="lp-mockcard__icon" :style="{ background: row.bg }"><q-icon :name="row.icon" size="13px" :style="{ color: row.color }" /></span>
                  <span class="lp-mockcard__row-label">{{ row.label }}</span>
                </div>
                <span class="lp-mockcard__row-val" :style="{ color: row.valColor }">{{ row.val }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FEATURES ===== -->
    <section id="features" class="lp-features">
      <div class="lp-container">
        <div class="lp-section-head">
          <p class="lp-section-eye">{{ $t('landing.features.sectionTitle') }}</p>
          <h2 class="lp-section-title">{{ $t('landing.features.sectionTitleHighlight') }}</h2>
        </div>
        <div class="lp-features-grid">
          <div v-for="feature in features" :key="feature.icon" class="lp-feat-card">
            <div class="lp-feat-card__icon-wrap">
              <q-icon :name="feature.icon" size="22px" color="dark" />
            </div>
            <h3 class="lp-feat-card__title">{{ feature.title }}</h3>
            <p class="lp-feat-card__desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== GET THE APP ===== -->
    <section id="getapp" class="lp-getapp">
      <div class="lp-container lp-getapp__inner">
        <div class="lp-getapp__text">
          <p class="lp-section-eye" style="color: #3ddc84;">Android</p>
          <h2 class="lp-getapp__title">{{ $t('landing.getApp.title') }}</h2>
          <p class="lp-getapp__sub">{{ $t('landing.getApp.subtitle') }}</p>
          <a href="https://play.google.com/store/apps/details?id=com.polashmahmud.finance" target="_blank"
            rel="noopener noreferrer" class="lp-play-badge">
            <div class="lp-play-badge__icon"><q-icon name="android" size="32px" color="white" /></div>
            <div class="lp-play-badge__text">
              <span class="lp-play-badge__small">{{ $t('landing.getApp.availableOn') }}</span>
              <span class="lp-play-badge__big">Google Play</span>
            </div>
          </a>
        </div>
        <div class="lp-getapp__visual" aria-hidden="true">
          <div class="lp-phone">
            <div class="lp-phone__screen">
              <div class="lp-phone__status"></div>
              <div class="lp-phone__row lp-phone__row--green"><q-icon name="arrow_upward" size="11px" /> ৳ 45,000</div>
              <div class="lp-phone__row lp-phone__row--red"><q-icon name="arrow_downward" size="11px" /> ৳ 18,200</div>
              <div class="lp-phone__divider"></div>
              <div class="lp-phone__label">{{ $t('loans.totalReceivable') }}</div>
              <div class="lp-phone__amount" style="color:#22c55e">৳ 12,000</div>
              <div class="lp-phone__label" style="margin-top:6px">{{ $t('loans.totalPayable') }}</div>
              <div class="lp-phone__amount" style="color:#ef4444">৳ 5,000</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="lp-cta">
      <div class="lp-container lp-cta__inner">
        <h2 class="lp-cta__title">{{ $t('landing.cta.title') }}</h2>
        <p class="lp-cta__sub">{{ $t('landing.cta.subtitle') }}</p>
        <div class="lp-cta__actions">
          <template v-if="isAuthenticated">
            <q-btn unelevated no-caps color="white" text-color="dark" :label="$t('landing.nav.dashboard')"
              to="/dashboard" size="md" class="lp-btn-inverted" />
          </template>
          <template v-else>
            <q-btn unelevated no-caps color="white" text-color="dark" :label="$t('landing.cta.button')"
              to="/register" size="md" class="lp-btn-inverted" />
          </template>
          <a href="https://play.google.com/store/apps/details?id=com.polashmahmud.finance" target="_blank"
            rel="noopener noreferrer" class="lp-cta__play-link">
            <q-icon name="android" size="16px" style="margin-right:4px" />
            {{ $t('landing.getApp.heroBtn') }}
          </a>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="lp-footer">
      <div class="lp-container lp-footer__inner">
        <div class="lp-footer__brand">
          <q-icon name="account_balance_wallet" size="16px" style="color:#999" />
          <span>{{ $t('layout.financeManager') }}</span>
        </div>
        <div class="lp-footer__links">
          <router-link to="/privacy-policy" class="lp-footer__link">{{ $t('landing.footer.privacyPolicy') }}</router-link>
          <a href="https://github.com/polashmahmud/finance" target="_blank" rel="noopener noreferrer" class="lp-footer__link lp-footer__link--icon">
            <q-icon name="mdi-github" size="15px" /> GitHub
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.polashmahmud.finance" target="_blank"
            rel="noopener noreferrer" class="lp-footer__link lp-footer__link--icon">
            <q-icon name="android" size="15px" style="color:#3ddc84" /> Android
          </a>
          <span class="lp-footer__copy">&copy; {{ currentYear }}</span>
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
  { value: '7+', label: t('landing.nav.features') },
  { value: '100%', label: 'Free' },
  { value: '🔒', label: t('landing.features.f6Title') },
])

const mockRows = computed(() => [
  { icon: 'restaurant', bg: '#fff3e0', color: '#f97316', label: t('landing.features.f1Title').split(' ')[0], val: '-৳ 3,200', valColor: '#ef4444' },
  { icon: 'savings', bg: '#e8f5e9', color: '#22c55e', label: t('landing.features.f2Title').split(' ')[0], val: '+৳ 20,000', valColor: '#22c55e' },
  { icon: 'handshake', bg: '#f0f4ff', color: '#6366f1', label: t('loans.title'), val: '৳ 7,000', valColor: '#6366f1' },
])

const features = computed(() => [
  { icon: 'swap_vert', title: t('landing.features.f1Title'), desc: t('landing.features.f1Desc') },
  { icon: 'savings', title: t('landing.features.f2Title'), desc: t('landing.features.f2Desc') },
  { icon: 'account_balance_wallet', title: t('landing.features.f3Title'), desc: t('landing.features.f3Desc') },
  { icon: 'handshake', title: t('landing.features.f7Title'), desc: t('landing.features.f7Desc') },
  { icon: 'bar_chart', title: t('landing.features.f5Title'), desc: t('landing.features.f5Desc') },
  { icon: 'shopping_cart', title: t('landing.features.f4Title'), desc: t('landing.features.f4Desc') },
  { icon: 'lock', title: t('landing.features.f6Title'), desc: t('landing.features.f6Desc') },
])

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
// ── Base ──────────────────────────────────────────────────────
.lp {
  background: #fff;
  color: #111;
  font-family: inherit;
}

.lp-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

// ── Navbar ────────────────────────────────────────────────────
.lp-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 58px;
  }

  &__logo {
    gap: 10px;
    text-decoration: none;
    color: inherit;
    flex-shrink: 0;
  }

  &__brand {
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #111;
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    color: #555;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 8px;
    transition: background 0.12s, color 0.12s;

    &:hover {
      background: #f5f5f5;
      color: #111;
    }

    &--icon {
      gap: 5px;
    }
  }

  &__mobile {
    display: flex;
    align-items: center;
  }
}

.lp-logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #111;
  color: #fff;
  border-radius: 8px;
  flex-shrink: 0;
}

.lp-lang-toggle {
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.75rem !important;
  margin: 0 4px;

  :deep(.q-btn) {
    font-size: 0.72rem;
    padding: 2px 9px;
    min-height: 26px;
  }
}

// Mobile menu
.lp-mobile-menu {
  background: #fff;
  border-top: 1px solid #f0f0f0;
  padding: 6px 0 10px;

  &__item {
    display: block;
    padding: 11px 0;
    color: #333;
    text-decoration: none;
    font-size: 0.93rem;
    font-weight: 500;
    border-bottom: 1px solid #f5f5f5;
    cursor: pointer;

    &:last-child { border-bottom: none; }
    &:hover { color: #111; }
  }
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.18s ease;
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; max-height: 0; }
.slide-down-enter-to, .slide-down-leave-from { opacity: 1; max-height: 280px; }

// ── Hero ──────────────────────────────────────────────────────
.lp-hero {
  padding: 72px 0 80px;
  background: #fafafa;
  border-bottom: 1px solid #ebebeb;

  &__inner {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 60px;
    align-items: center;
  }

  &__eyebrow {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #888;
    margin-bottom: 18px;
  }

  &__title {
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: -0.035em;
    margin: 0 0 20px;
    color: #111;
  }

  &__accent {
    color: #111;
    border-bottom: 3px solid #111;
    padding-bottom: 2px;
  }

  &__sub {
    font-size: 1.05rem;
    color: #666;
    line-height: 1.72;
    margin: 0 0 32px;
    max-width: 480px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }

  &__stats {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    padding-top: 8px;
    border-top: 1px solid #e5e5e5;
  }
}

.lp-stat {
  display: flex;
  flex-direction: column;

  &__val {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #111;
    line-height: 1;
  }

  &__lbl {
    font-size: 0.75rem;
    color: #888;
    font-weight: 500;
    margin-top: 3px;
  }
}

// Mock card visual
.lp-mockcard {
  background: #fff;
  border-radius: 20px;
  padding: 20px 22px;
  box-shadow: 0 2px 0 #e5e5e5, 0 12px 40px rgba(0,0,0,0.08);
  border: 1px solid #ebebeb;

  &__header {
    display: flex;
    gap: 5px;
    margin-bottom: 18px;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }

  &__balance-label {
    font-size: 0.72rem;
    color: #999;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }

  &__balance {
    font-size: 1.7rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #111;
    margin-bottom: 12px;
  }

  &__chips {
    display: flex;
    gap: 8px;
    margin-bottom: 18px;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.77rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;

    &--green { background: #e8f5e9; color: #22c55e; }
    &--red   { background: #fef2f2; color: #ef4444; }
  }

  &__divider {
    height: 1px;
    background: #f0f0f0;
    margin: 0 0 14px;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 0;
    border-bottom: 1px solid #f8f8f8;

    &:last-child { border-bottom: none; }
  }

  &__row-left {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  &__icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__row-label {
    font-size: 0.82rem;
    font-weight: 600;
    color: #333;
  }

  &__row-val {
    font-size: 0.82rem;
    font-weight: 700;
  }
}

// Buttons
.lp-btn-primary {
  border-radius: 9px !important;
  padding: 0 22px !important;
  height: 42px !important;
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12) !important;
}

.lp-btn-ghost {
  border-radius: 9px !important;
  height: 42px !important;
  font-size: 0.9rem !important;
  color: #555 !important;
}

.lp-btn-inverted {
  border-radius: 9px !important;
  padding: 0 28px !important;
  height: 44px !important;
  font-size: 0.95rem !important;
  font-weight: 600 !important;
}

// ── Features ──────────────────────────────────────────────────
.lp-features {
  padding: 80px 0;
  background: #fff;
}

.lp-section-head {
  text-align: center;
  margin-bottom: 48px;
}

.lp-section-eye {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #888;
  margin: 0 0 10px;
}

.lp-section-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.2;
  margin: 0;
  color: #111;
}

.lp-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1px;
  background: #ebebeb;
  border: 1px solid #ebebeb;
  border-radius: 16px;
  overflow: hidden;
}

.lp-feat-card {
  background: #fff;
  padding: 28px 26px;
  transition: background 0.15s;

  &:hover {
    background: #fafafa;
  }

  &__icon-wrap {
    width: 42px;
    height: 42px;
    background: #f2f2f2;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
  }

  &__title {
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin: 0 0 7px;
    color: #111;
  }

  &__desc {
    font-size: 0.85rem;
    color: #777;
    line-height: 1.62;
    margin: 0;
  }
}

// ── Get the App ──────────────────────────────────────────────
.lp-getapp {
  padding: 80px 0;
  background: #0d1117;
  color: #fff;

  &__inner {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 64px;
    align-items: center;
  }

  &__text {
    max-width: 520px;
  }

  &__title {
    font-size: clamp(1.5rem, 3vw, 2.1rem);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.2;
    margin: 0 0 14px;
    color: #fff;
  }

  &__sub {
    font-size: 0.97rem;
    color: rgba(255,255,255,0.58);
    line-height: 1.72;
    margin: 0 0 28px;
  }
}

.lp-play-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #3ddc84;
  color: #0d1117;
  border-radius: 14px;
  padding: 12px 20px;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 20px rgba(61, 220, 132, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(61, 220, 132, 0.45);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(0,0,0,0.12);
    border-radius: 10px;
    flex-shrink: 0;
  }

  &__text {
    display: flex;
    flex-direction: column;
  }

  &__small {
    font-size: 0.7rem;
    font-weight: 600;
    opacity: 0.7;
    letter-spacing: 0.03em;
    line-height: 1;
  }

  &__big {
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.3;
    color: #0d1117;
  }
}

// Phone mockup
.lp-phone {
  width: 180px;
  background: #1c2432;
  border-radius: 24px;
  padding: 20px 16px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);

  &__screen {
    display: flex;
    flex-direction: column;
  }

  &__status {
    width: 48px;
    height: 4px;
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
    margin: 0 auto 16px;
  }

  &__row {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 5px 10px;
    border-radius: 8px;
    margin-bottom: 6px;

    &--green { background: rgba(34,197,94,0.15); color: #22c55e; }
    &--red   { background: rgba(239,68,68,0.15);  color: #ef4444; }
  }

  &__divider {
    height: 1px;
    background: rgba(255,255,255,0.08);
    margin: 10px 0;
  }

  &__label {
    font-size: 0.68rem;
    color: rgba(255,255,255,0.4);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 2px;
  }

  &__amount {
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
}

// ── CTA ──────────────────────────────────────────────────────
.lp-cta {
  padding: 80px 0;
  background: #111;
  color: #fff;

  &__inner {
    max-width: 580px;
  }

  &__title {
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 800;
    letter-spacing: -0.035em;
    margin: 0 0 14px;
    color: #fff;
  }

  &__sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.7;
    margin: 0 0 32px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__play-link {
    display: inline-flex;
    align-items: center;
    color: rgba(255,255,255,0.55);
    font-size: 0.87rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.15s;

    &:hover { color: #3ddc84; }
  }
}

// ── Footer ───────────────────────────────────────────────────
.lp-footer {
  border-top: 1px solid #ebebeb;
  padding: 20px 0;
  background: #fafafa;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #888;
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #999;
    font-size: 0.82rem;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.12s;

    &:hover { color: #333; }

    &--icon { gap: 4px; }
  }

  &__copy {
    color: #bbb;
    font-size: 0.8rem;
  }
}

// ── Responsive ───────────────────────────────────────────────
@media (max-width: 900px) {
  .lp-hero__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .lp-hero__visual {
    display: none;
  }
  .lp-getapp {
    &__inner {
      grid-template-columns: 1fr;
      gap: 36px;
    }
  }
  .lp-phone {
    display: none;
  }
}

@media (max-width: 599px) {
  .lp-hero {
    padding: 52px 0 60px;
    &__title { font-size: 2rem; }
    &__sub { font-size: 0.97rem; }
  }
  .lp-features {
    padding: 56px 0;
  }
  .lp-features-grid {
    grid-template-columns: 1fr;
  }
  .lp-getapp {
    padding: 56px 0;
    &__inner { text-align: center; }
    &__text { max-width: 100%; }
    .lp-section-eye, .lp-play-badge { margin-left: auto; margin-right: auto; }
  }
  .lp-cta {
    padding: 56px 0;
    &__actions { flex-direction: column; align-items: flex-start; }
  }
  .lp-footer__inner {
    justify-content: center;
    text-align: center;
  }
}
</style>
