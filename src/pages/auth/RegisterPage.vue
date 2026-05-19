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
            Start your<br />
            <span class="auth-brand__title-gradient">financial journey</span>
          </h2>
          <p class="auth-brand__subtitle">
            Join 10,000+ people who use MyFinance to track expenses, build budgets, and reach their financial goals.
          </p>
        </div>

        <!-- Mini mockup / visual -->
        <div class="auth-brand__mockup">
          <div class="brand-mockup-card">
            <div class="brand-mockup-label">Monthly Overview · May 2026</div>
            <div class="brand-mockup-row">
              <div class="brand-mockup-stat">
                <div class="brand-mockup-stat-value brand-mockup-stat-value--in">৳ 45,000</div>
                <div class="brand-mockup-stat-label">↑ Income</div>
              </div>
              <div class="brand-mockup-divider"></div>
              <div class="brand-mockup-stat">
                <div class="brand-mockup-stat-value brand-mockup-stat-value--out">৳ 12,800</div>
                <div class="brand-mockup-stat-label">↓ Expenses</div>
              </div>
              <div class="brand-mockup-divider"></div>
              <div class="brand-mockup-stat">
                <div class="brand-mockup-stat-value brand-mockup-stat-value--save">৳ 32,200</div>
                <div class="brand-mockup-stat-label">= Savings</div>
              </div>
            </div>
            <div class="brand-mockup-bars">
              <div v-for="b in mockBudgets" :key="b.name" class="brand-mockup-bar-row">
                <span class="brand-mockup-bar-name">{{ b.name }}</span>
                <div class="brand-mockup-bar-track">
                  <div class="brand-mockup-bar-fill" :style="{ width: b.pct + '%', background: b.color }"></div>
                </div>
                <span class="brand-mockup-bar-pct">{{ b.pct }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="auth-brand__tagline">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#2f7d5c">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Free forever. No credit card required.
        </div>
      </div>

      <!-- Right: register card -->
      <div class="auth-card-wrap">
        <!-- Mobile-only logo -->
        <router-link to="/" class="auth-card__mobile-logo">
          <span>💰</span>
          <span>MyFinance</span>
        </router-link>

        <div class="auth-card">
          <div class="auth-card__header">
            <h1 class="auth-card__title">Create your account</h1>
            <p class="auth-card__subtitle">Free forever. Start tracking in minutes.</p>
          </div>

          <q-form @submit.prevent="onRegister" class="auth-form">
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
              <label class="auth-label">Password</label>
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
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  autocomplete="new-password"
                  @input="checkStrength"
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
              <!-- Password strength -->
              <div v-if="password" class="auth-strength">
                <div class="auth-strength-bars">
                  <div
                    v-for="i in 4"
                    :key="i"
                    class="auth-strength-bar"
                    :class="{
                      'auth-strength-bar--weak': strength >= i && strength < 2,
                      'auth-strength-bar--fair': strength >= i && strength === 2,
                      'auth-strength-bar--good': strength >= i && strength === 3,
                      'auth-strength-bar--strong': strength >= i && strength === 4,
                    }"
                  ></div>
                </div>
                <span class="auth-strength-label" :class="`auth-strength-label--${strengthLabel.key}`">
                  {{ strengthLabel.text }}
                </span>
              </div>
              <span v-if="errors.password" class="auth-error">{{ errors.password }}</span>
            </div>

            <!-- Confirm password -->
            <div class="auth-field">
              <label class="auth-label">Confirm password</label>
              <div class="auth-input-wrap" :class="{ 'auth-input-wrap--error': errors.confirm }">
                <div class="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  class="auth-input"
                  placeholder="Repeat your password"
                  autocomplete="new-password"
                  @blur="validateConfirm"
                />
              </div>
              <span v-if="errors.confirm" class="auth-error">{{ errors.confirm }}</span>
            </div>

            <!-- Server error -->
            <div v-if="serverError" class="auth-server-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b14437" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ serverError }}
            </div>

            <!-- Terms note -->
            <p class="auth-terms">
              By creating an account you agree to our
              <router-link to="/privacy-policy" class="auth-terms-link">Privacy Policy</router-link>.
            </p>

            <!-- Submit -->
            <button type="submit" class="auth-submit" :disabled="loading">
              <span v-if="!loading">Create Free Account</span>
              <span v-else class="auth-spinner"></span>
            </button>
          </q-form>

          <div class="auth-card__footer">
            Already have an account?
            <router-link to="/login" class="auth-card__footer-link">Sign in →</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/authStore'
import { Notify } from 'quasar'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const serverError = ref('')
const strength = ref(0)

const errors = reactive({ email: '', password: '', confirm: '' })

const mockBudgets = [
  { name: 'Food', pct: 72, color: '#b16a26' },
  { name: 'Transport', pct: 45, color: '#2a6695' },
  { name: 'Shopping', pct: 88, color: '#b14437' },
]

const strengthLabel = computed(() => {
  const map = [
    { key: 'weak', text: 'Weak' },
    { key: 'weak', text: 'Weak' },
    { key: 'fair', text: 'Fair' },
    { key: 'good', text: 'Good' },
    { key: 'strong', text: 'Strong' },
  ]
  return map[strength.value] || map[0]
})

function checkStrength() {
  const p = password.value
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  strength.value = score
}

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
  } else if (password.value.length < 8) {
    errors.password = 'At least 8 characters required'
  } else if (!/[0-9]/.test(password.value)) {
    errors.password = 'Must include at least one number'
  } else if (!/[A-Z]/.test(password.value)) {
    errors.password = 'Must include at least one uppercase letter'
  } else {
    errors.password = ''
  }
}

function validateConfirm() {
  if (!confirmPassword.value) {
    errors.confirm = 'Please confirm your password'
  } else if (confirmPassword.value !== password.value) {
    errors.confirm = 'Passwords do not match'
  } else {
    errors.confirm = ''
  }
}

async function onRegister() {
  validateEmail()
  validatePassword()
  validateConfirm()
  if (errors.email || errors.password || errors.confirm) return

  serverError.value = ''
  loading.value = true
  try {
    const result = await auth.register(email.value, password.value)
    if (result.success) {
      Notify.create({ message: t('auth.registerSuccess'), color: 'positive' })
      router.push('/dashboard')
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
  background: #fafaf7;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  font-family: 'Plus Jakarta Sans', 'Hind Siliguri', system-ui, sans-serif;
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
    background: radial-gradient(circle, rgba(42, 102, 149, 0.07) 0%, transparent 70%);
    top: -150px;
    right: -100px;
  }

  &--2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(47, 125, 92, 0.08) 0%, transparent 70%);
    bottom: -100px;
    left: -100px;
  }
}

.auth-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(22, 22, 26, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(22, 22, 26, 0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at 70% 50%, black 20%, transparent 75%);
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

// ── Left brand panel (dark ink) ──
.auth-brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 56px;
  background: #16161a;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  gap: 32px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

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
    color: #ffffff;
    letter-spacing: -0.03em;
    position: relative;

    span:first-child { font-size: 1.5rem; }
  }

  &__title {
    font-size: 2.4rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.95);
    letter-spacing: -0.04em;
    line-height: 1.15;
    margin: 0 0 12px;
    position: relative;

    &-gradient {
      background: linear-gradient(135deg, rgba(47, 125, 92, 0.9), rgba(42, 102, 149, 0.9));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__subtitle {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.42);
    line-height: 1.65;
    margin: 0;
  }

  &__tagline {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.42);
    font-weight: 500;
    position: relative;
  }
}

// ── Mini mockup ──
.auth-brand__mockup {
  padding: 0;
  position: relative;
}

.brand-mockup-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 16px;
  padding: 18px 20px;
}

.brand-mockup-label {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 14px;
}

.brand-mockup-row {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 16px;
}

.brand-mockup-stat {
  flex: 1;
  text-align: center;

  &-value {
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 3px;

    &--in { color: #2f7d5c; }
    &--out { color: #b14437; }
    &--save { color: #2a6695; }
  }

  &-label {
    font-size: 0.62rem;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 500;
  }
}

.brand-mockup-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.07);
}

.brand-mockup-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.brand-mockup-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mockup-bar-name {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.4);
  width: 56px;
  flex-shrink: 0;
}

.brand-mockup-bar-track {
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  overflow: hidden;
}

.brand-mockup-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.brand-mockup-bar-pct {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 600;
  width: 28px;
  text-align: right;
  flex-shrink: 0;
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
  color: #16161a;
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
  background: #ffffff;
  border: 1px solid #e9e5dc;
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 4px 24px rgba(22, 22, 26, 0.07), 0 1px 0 rgba(22, 22, 26, 0.03);

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
    color: #16161a;
    letter-spacing: -0.04em;
    margin: 0 0 6px;
  }

  &__subtitle {
    font-size: 0.875rem;
    color: #7c7a73;
    margin: 0;
  }

  &__footer {
    margin-top: 20px;
    text-align: center;
    font-size: 0.85rem;
    color: #7c7a73;

    &-link {
      color: #2f7d5c;
      font-weight: 700;
      text-decoration: none;
      transition: color 0.2s;
      margin-left: 4px;

      &:hover { color: #16161a; }
    }
  }
}

// ── Form elements ──
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #3a3a40;
  letter-spacing: 0.02em;
}

.auth-input-wrap {
  display: flex;
  align-items: center;
  background: #fafaf7;
  border: 1px solid #e9e5dc;
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: rgba(22, 22, 26, 0.4);
    box-shadow: 0 0 0 3px rgba(22, 22, 26, 0.05);
    background: #ffffff;
  }

  &--error {
    border-color: rgba(177, 68, 55, 0.5) !important;
    box-shadow: 0 0 0 3px rgba(177, 68, 55, 0.06) !important;
  }
}

.auth-input-icon {
  padding: 0 14px;
  color: #b8b5ac;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  .auth-input-wrap:focus-within & {
    color: #7c7a73;
  }
}

.auth-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 13px 0;
  font-size: 0.9rem;
  color: #16161a;
  font-family: inherit;
  min-width: 0;

  &::placeholder { color: #b8b5ac; }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #fafaf7 inset !important;
    -webkit-text-fill-color: #16161a !important;
  }
}

.auth-input-toggle {
  padding: 0 14px;
  background: none;
  border: none;
  color: #b8b5ac;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  flex-shrink: 0;

  &:hover { color: #7c7a73; }
}

// ── Password strength ──
.auth-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;

  &-bars {
    display: flex;
    gap: 4px;
    flex: 1;
  }

  &-bar {
    height: 3px;
    flex: 1;
    border-radius: 2px;
    background: #e9e5dc;
    transition: background 0.3s ease;

    &--weak  { background: #b14437; }
    &--fair  { background: #b16a26; }
    &--good  { background: #2a6695; }
    &--strong { background: #2f7d5c; }
  }

  &-label {
    font-size: 0.72rem;
    font-weight: 700;
    flex-shrink: 0;

    &--weak   { color: #b14437; }
    &--fair   { color: #b16a26; }
    &--good   { color: #2a6695; }
    &--strong { color: #2f7d5c; }
  }
}

.auth-error {
  font-size: 0.75rem;
  color: #b14437;
  font-weight: 500;
}

.auth-server-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(177, 68, 55, 0.05);
  border: 1px solid rgba(177, 68, 55, 0.18);
  border-radius: 10px;
  font-size: 0.82rem;
  color: #b14437;
  font-weight: 500;
}

.auth-terms {
  font-size: 0.78rem;
  color: #7c7a73;
  margin: 0;
  line-height: 1.5;

  &-link {
    color: #2f7d5c;
    text-decoration: none;
    font-weight: 600;

    &:hover { text-decoration: underline; }
  }
}

.auth-submit {
  width: 100%;
  padding: 14px;
  background: #16161a;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(22, 22, 26, 0.3);
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  margin-top: 4px;

  &:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(22, 22, 26, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
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
