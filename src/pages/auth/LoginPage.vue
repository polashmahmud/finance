<template>
  <div class="auth-page">
    <!-- Background blobs -->
    <div class="auth-bg">
      <div class="auth-blob auth-blob--1"></div>
      <div class="auth-blob auth-blob--2"></div>
      <div class="auth-grid"></div>
    </div>

    <!-- Layout -->
    <div class="auth-layout">
      <!-- Left brand panel (desktop only) -->
      <div class="auth-brand">
        <router-link to="/" class="auth-brand__logo">
          <span>💰</span>
          <span>MyFinance</span>
        </router-link>

        <div class="auth-brand__hero">
          <h2 class="auth-brand__title">
            Your finances,<br />
            <span class="auth-brand__title-gradient">under control</span>
          </h2>
          <p class="auth-brand__subtitle">
            Track every taka, set smart budgets, and grow your wealth — all in one free app.
          </p>
        </div>

        <div class="auth-brand__features">
          <div v-for="f in features" :key="f" class="auth-brand__feature">
            <div class="auth-brand__feature-check">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            {{ f }}
          </div>
        </div>

        <div class="auth-brand__stat">
          <div class="auth-brand__stat-avatars">
            <span v-for="i in 4" :key="i" class="auth-brand__stat-av" :style="{ background: avatarColors[i-1] }">
              {{ avatarLetters[i-1] }}
            </span>
          </div>
          <div class="auth-brand__stat-text">
            <strong>10,000+</strong> users trust MyFinance
          </div>
        </div>
      </div>

      <!-- Right: auth card -->
      <div class="auth-card-wrap">
        <!-- Mobile-only logo -->
        <router-link to="/" class="auth-card__mobile-logo">
          <span>💰</span>
          <span>MyFinance</span>
        </router-link>

        <div class="auth-card">
          <div class="auth-card__header">
            <h1 class="auth-card__title">Welcome back</h1>
            <p class="auth-card__subtitle">Sign in to your account to continue</p>
          </div>

          <q-form @submit.prevent="onLogin" class="auth-form">
            <!-- Email -->
            <div class="auth-field">
              <label class="auth-label">Email address</label>
              <div class="auth-input-wrap" :class="{ 'auth-input-wrap--error': errors.email }">
                <div class="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,12 2,6"/>
                  </svg>
                </div>
                <input
                  v-model="email"
                  type="email"
                  class="auth-input"
                  placeholder="you@example.com"
                  autocomplete="email"
                  @blur="validateEmail"
                />
              </div>
              <span v-if="errors.email" class="auth-error">{{ errors.email }}</span>
            </div>

            <!-- Password -->
            <div class="auth-field">
              <div class="auth-label-row">
                <label class="auth-label">Password</label>
                <a href="#" class="auth-forgot" @click.prevent>Forgot password?</a>
              </div>
              <div class="auth-input-wrap" :class="{ 'auth-input-wrap--error': errors.password }">
                <div class="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="auth-input"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  @blur="validatePassword"
                />
                <button type="button" class="auth-input-toggle" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <span v-if="errors.password" class="auth-error">{{ errors.password }}</span>
            </div>

            <!-- Server error -->
            <div v-if="serverError" class="auth-server-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ serverError }}
            </div>

            <!-- Submit -->
            <button type="submit" class="auth-submit" :class="{ 'auth-submit--loading': loading }" :disabled="loading">
              <span v-if="!loading">Sign In</span>
              <span v-else class="auth-spinner"></span>
            </button>
          </q-form>

          <div class="auth-card__footer">
            Don't have an account?
            <router-link to="/register" class="auth-card__footer-link">Create one free →</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/authStore'
import { useSettingsStore } from 'stores/settingsStore'
import { Notify } from 'quasar'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const settings = useSettingsStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const serverError = ref('')

const errors = reactive({ email: '', password: '' })

const features = [
  'Track all your accounts in one place',
  'Set smart monthly budgets',
  'Manage loans & installments',
  'Works offline, syncs automatically',
  'Bengali & English language support',
]

const avatarColors = [
  'linear-gradient(135deg,#f97316,#ef4444)',
  'linear-gradient(135deg,#8b5cf6,#3b82f6)',
  'linear-gradient(135deg,#22c55e,#14b8a6)',
  'linear-gradient(135deg,#ec4899,#f97316)',
]
const avatarLetters = ['R', 'N', 'A', 'K']

function validateEmail() {
  if (!email.value) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Enter a valid email address'
  } else {
    errors.email = ''
  }
}

function validatePassword() {
  if (!password.value) {
    errors.password = 'Password is required'
  } else {
    errors.password = ''
  }
}

async function onLogin() {
  validateEmail()
  validatePassword()
  if (errors.email || errors.password) return

  serverError.value = ''
  loading.value = true
  try {
    const result = await auth.login(email.value, password.value)
    if (result.success) {
      Notify.create({ message: t('auth.loginSuccess'), color: 'positive' })
      router.push(settings.appLock ? '/splash' : '/dashboard')
    } else {
      serverError.value = result.error
    }
  } catch {
    serverError.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  background: #07101e;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

// ── Background ──
.auth-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.auth-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);

  &--1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, transparent 70%);
    top: -150px;
    left: -100px;
  }

  &--2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.14) 0%, transparent 70%);
    bottom: -100px;
    right: -100px;
  }
}

.auth-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at 30% 50%, black 20%, transparent 75%);
}

// ── Layout ──
.auth-layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;

  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
}

// ── Left brand panel ──
.auth-brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 56px;
  background: linear-gradient(145deg, rgba(249, 115, 22, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  gap: 36px;

  @media (max-width: 1023px) {
    display: none;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    font-size: 1.15rem;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: -0.03em;

    span:first-child { font-size: 1.5rem; }
  }

  &__hero { }

  &__title {
    font-size: 2.6rem;
    font-weight: 900;
    color: #f1f5f9;
    letter-spacing: -0.04em;
    line-height: 1.15;
    margin: 0 0 14px;

    &-gradient {
      background: linear-gradient(135deg, #f97316, #ef4444);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__subtitle {
    font-size: 0.95rem;
    color: #64748b;
    line-height: 1.65;
    margin: 0;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.875rem;
    color: #94a3b8;
    font-weight: 500;
  }

  &__feature-check {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    max-width: fit-content;
  }

  &__stat-avatars {
    display: flex;
  }

  &__stat-av {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 800;
    color: #fff;
    border: 2px solid #07101e;
    margin-left: -8px;

    &:first-child { margin-left: 0; }
  }

  &__stat-text {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;

    strong {
      color: #e2e8f0;
      font-weight: 700;
    }
  }
}

// ── Right auth card wrap ──
.auth-card-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  min-height: 100vh;

  @media (max-width: 599px) {
    padding: 32px 20px;
  }
}

.auth-card__mobile-logo {
  display: none;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: -0.03em;
  margin-bottom: 32px;

  span:first-child { font-size: 1.4rem; }

  @media (max-width: 1023px) {
    display: flex;
  }
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px 36px;
  backdrop-filter: blur(10px);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);

  @media (max-width: 599px) {
    padding: 32px 24px;
    border-radius: 20px;
  }

  &__header {
    margin-bottom: 28px;
  }

  &__title {
    font-size: 1.65rem;
    font-weight: 900;
    color: #f1f5f9;
    letter-spacing: -0.04em;
    margin: 0 0 6px;
  }

  &__subtitle {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  &__footer {
    margin-top: 24px;
    text-align: center;
    font-size: 0.85rem;
    color: #475569;

    &-link {
      color: #f97316;
      font-weight: 700;
      text-decoration: none;
      transition: color 0.2s;
      margin-left: 4px;

      &:hover { color: #fb923c; }
    }
  }
}

// ── Form elements ──
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.auth-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.02em;
}

.auth-forgot {
  font-size: 0.78rem;
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;

  &:hover { color: #f97316; }
}

.auth-input-wrap {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: rgba(249, 115, 22, 0.5);
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.08);
    background: rgba(249, 115, 22, 0.03);
  }

  &--error {
    border-color: rgba(239, 68, 68, 0.5) !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.06) !important;
  }
}

.auth-input-icon {
  padding: 0 14px;
  color: #334155;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  .auth-input-wrap:focus-within & {
    color: #f97316;
  }
}

.auth-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 13px 0;
  font-size: 0.9rem;
  color: #f1f5f9;
  font-family: inherit;

  &::placeholder { color: #334155; }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #0d1525 inset !important;
    -webkit-text-fill-color: #f1f5f9 !important;
  }
}

.auth-input-toggle {
  padding: 0 14px;
  background: none;
  border: none;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  flex-shrink: 0;

  &:hover { color: #94a3b8; }
}

.auth-error {
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 500;
}

.auth-server-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  font-size: 0.82rem;
  color: #fca5a5;
  font-weight: 500;
}

.auth-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #f97316, #ef4444);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.35);
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  margin-top: 4px;

  &:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(249, 115, 22, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.auth-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
