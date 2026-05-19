<template>
  <nav class="lp-nav" :class="{ 'lp-nav--scrolled': scrolled }">
    <div class="lp-nav__inner">
      <a class="lp-nav__logo" href="/">
        <span class="lp-nav__logo-icon">💰</span>
        <span class="lp-nav__logo-text">MyFinance</span>
      </a>

      <div class="lp-nav__links" v-if="!$q.screen.lt.md">
        <a v-for="link in navLinks" :key="link.href" class="lp-nav__link" @click.prevent="scrollTo(link.href)">
          {{ link.label }}
        </a>
      </div>

      <div class="lp-nav__actions">
        <router-link to="/login" class="lp-nav__link lp-nav__link--login" v-if="!$q.screen.lt.sm">
          Log In
        </router-link>
        <router-link to="/register" class="lp-nav__cta">
          Get Started
        </router-link>
        <button class="lp-nav__hamburger" v-if="$q.screen.lt.md" @click="mobileMenu = !mobileMenu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <div class="lp-nav__mobile" :class="{ 'lp-nav__mobile--open': mobileMenu }">
      <a v-for="link in navLinks" :key="link.href" class="lp-nav__mobile-link" @click.prevent="scrollTo(link.href)">
        {{ link.label }}
      </a>
      <router-link to="/login" class="lp-nav__mobile-link">Log In</router-link>
      <router-link to="/register" class="lp-nav__mobile-cta">Get Started Free →</router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const scrolled = ref(false)
const mobileMenu = ref(false)

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Testimonials', href: '#testimonials' },
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 24
}

const scrollTo = (href) => {
  mobileMenu.value = false
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped lang="scss">
.lp-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 24px;
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  border-bottom: 1px solid transparent;

  &--scrolled {
    background: rgba(250, 250, 247, 0.92);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    border-color: #e9e5dc;
    box-shadow: 0 1px 0 rgba(22, 22, 26, 0.04), 0 4px 16px rgba(22, 22, 26, 0.06);
  }

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    height: 68px;
    display: flex;
    align-items: center;
    gap: 32px;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;

    &-icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    &-text {
      font-size: 1.1rem;
      font-weight: 800;
      color: #16161a;
      letter-spacing: -0.03em;
    }
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    justify-content: center;
  }

  &__link {
    padding: 8px 14px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #7c7a73;
    text-decoration: none;
    border-radius: 8px;
    cursor: pointer;
    transition: color 0.2s, background 0.2s;

    &:hover {
      color: #16161a;
      background: rgba(22, 22, 26, 0.05);
    }

    &--login {
      color: #7c7a73;

      &:hover {
        color: #16161a;
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    flex-shrink: 0;
  }

  &__cta {
    padding: 9px 20px;
    background: #16161a;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 700;
    border-radius: 10px;
    text-decoration: none;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 12px rgba(22, 22, 26, 0.25);

    &:hover {
      opacity: 0.88;
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(22, 22, 26, 0.35);
    }
  }

  &__hamburger {
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;

    span {
      display: block;
      width: 22px;
      height: 2px;
      background: #7c7a73;
      border-radius: 2px;
      transition: background 0.2s;
    }

    &:hover span {
      background: #16161a;
    }
  }

  &__mobile {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease;
    border-top: 1px solid transparent;
    background: rgba(250, 250, 247, 0.97);
    backdrop-filter: blur(12px);

    &--open {
      max-height: 400px;
      border-color: #e9e5dc;
    }

    display: flex;
    flex-direction: column;
    padding: 0 4px;
  }

  &__mobile-link {
    padding: 14px 12px;
    font-size: 0.95rem;
    font-weight: 500;
    color: #7c7a73;
    text-decoration: none;
    border-radius: 8px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #16161a;
    }
  }

  &__mobile-cta {
    margin: 12px 12px 16px;
    padding: 14px;
    background: #16161a;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 700;
    border-radius: 12px;
    text-decoration: none;
    text-align: center;
  }
}
</style>
