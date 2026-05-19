<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__top">
        <div class="footer__brand">
          <a href="/" class="footer__logo">
            <span>💰</span>
            <span>MyFinance</span>
          </a>
          <p class="footer__tagline">
            Personal finance management, simplified. Track, budget, and grow your wealth — free forever.
          </p>
          <div class="footer__social">
            <a href="#" class="footer__social-link" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer__links">
          <div v-for="col in linkCols" :key="col.title" class="footer__col">
            <h4 class="footer__col-title">{{ col.title }}</h4>
            <ul class="footer__col-list">
              <li v-for="link in col.links" :key="link.label">
                <component
                  :is="link.to ? 'router-link' : 'a'"
                  v-bind="link.to ? { to: link.to } : { href: link.href || '#' }"
                  class="footer__link"
                >
                  {{ link.label }}
                </component>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">
          © {{ new Date().getFullYear() }} MyFinance. Built with ❤️ in Bangladesh. All rights reserved.
        </p>
        <div class="footer__bottom-links">
          <router-link to="/privacy-policy" class="footer__link">Privacy Policy</router-link>
          <span class="footer__sep">·</span>
          <a href="#" class="footer__link">Terms of Service</a>
          <span class="footer__sep">·</span>
          <a href="#" class="footer__link">Support</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const linkCols = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Dashboard Preview', href: '#dashboard' },
      { label: 'Testimonials', href: '#testimonials' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Get Started Free', to: '/register' },
      { label: 'Sign In', to: '/login' },
      { label: 'Settings', to: '/dashboard/settings' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
]
</script>

<style scoped lang="scss">
.footer {
  background: #16161a;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 64px 24px 32px;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__top {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 64px;
    margin-bottom: 48px;

    @media (max-width: 1023px) {
      grid-template-columns: 1fr;
      gap: 48px;
    }
  }

  &__brand {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    font-size: 1.15rem;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: -0.03em;
    margin-bottom: 14px;

    span:first-child {
      font-size: 1.4rem;
    }
  }

  &__tagline {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.42);
    line-height: 1.65;
    margin: 0 0 20px;
  }

  &__social {
    display: flex;
    gap: 8px;
  }

  &__social-link {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.4);
    text-decoration: none;
    transition: color 0.2s, background 0.2s, border-color 0.2s;

    &:hover {
      color: rgba(255, 255, 255, 0.75);
      background: rgba(255, 255, 255, 0.09);
      border-color: rgba(255, 255, 255, 0.14);
    }
  }

  &__links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;

    @media (max-width: 599px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__col {
    &-title {
      font-size: 0.78rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.88);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 16px;
    }

    &-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }

  &__link {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.4);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: rgba(255, 255, 255, 0.75);
    }
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-top: 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    flex-wrap: wrap;

    @media (max-width: 599px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__copy {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.22);
    margin: 0;
  }

  &__bottom-links {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__sep {
    color: rgba(255, 255, 255, 0.15);
    font-size: 0.8rem;
  }
}
</style>
