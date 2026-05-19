<template>
  <section class="hero">
    <div class="hero__bg">
      <div class="hero__blob hero__blob--1"></div>
      <div class="hero__blob hero__blob--2"></div>
      <div class="hero__blob hero__blob--3"></div>
      <div class="hero__grid"></div>
    </div>

    <div class="hero__inner">
      <div class="hero__content">
        <div class="hero__badge">
          <span class="hero__badge-dot"></span>
          Personal Finance, Simplified
        </div>

        <h1 class="hero__title">
          Your Money,<br />
          <span class="hero__title-gradient">Finally Under Control</span>
        </h1>

        <p class="hero__subtitle">
          Track income, expenses, loans, and budgets across all your accounts —
          all in one beautifully designed app. Works offline, available everywhere.
        </p>

        <div class="hero__actions">
          <router-link to="/register" class="hero__cta-primary">
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
          <a class="hero__cta-secondary" @click.prevent="scrollTo('#how-it-works')">
            <span class="hero__play-icon">▶</span>
            How It Works
          </a>
        </div>

        <div class="hero__trust">
          <span class="hero__trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            No credit card
          </span>
          <span class="hero__trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Free forever
          </span>
          <span class="hero__trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Works offline
          </span>
        </div>
      </div>

      <div class="hero__visual">
        <div class="hero__float-chip hero__float-chip--1">
          <span class="chip-dot chip-dot--green"></span>
          <span>+৳ 45,000 salary received</span>
        </div>
        <div class="hero__float-chip hero__float-chip--2">
          <span class="chip-dot chip-dot--orange"></span>
          <span>Budget 68% used this month</span>
        </div>
        <div class="hero__float-chip hero__float-chip--3">
          <span class="chip-dot chip-dot--blue"></span>
          <span>3 loans being tracked</span>
        </div>

        <div class="hero__mockup">
          <div class="mockup-bar">
            <div class="mockup-bar__dots">
              <span></span><span></span><span></span>
            </div>
            <div class="mockup-bar__title">My Finance — Dashboard</div>
          </div>

          <div class="mockup-body">
            <div class="mockup-header-row">
              <div class="mockup-avatar">P</div>
              <div>
                <div class="mockup-greeting">Good morning, Polash 👋</div>
                <div class="mockup-date">Tuesday, May 19</div>
              </div>
            </div>

            <div class="mockup-balance-card">
              <div class="mockup-balance-label">Total Balance</div>
              <div class="mockup-balance-amount">৳ 1,24,500</div>
              <div class="mockup-balance-chips">
                <div class="mockup-chip mockup-chip--income">
                  <span>↑</span> ৳ 45,000
                </div>
                <div class="mockup-chip mockup-chip--expense">
                  <span>↓</span> ৳ 12,800
                </div>
              </div>
              <div class="mockup-orb mockup-orb--1"></div>
              <div class="mockup-orb mockup-orb--2"></div>
            </div>

            <div class="mockup-accounts-row">
              <div class="mockup-account">
                <div class="mockup-account-icon" style="background: #3b82f6">🏦</div>
                <div class="mockup-account-name">Dutch-Bangla</div>
                <div class="mockup-account-bal">৳ 85,200</div>
              </div>
              <div class="mockup-account">
                <div class="mockup-account-icon" style="background: #22c55e">📱</div>
                <div class="mockup-account-name">bKash</div>
                <div class="mockup-account-bal">৳ 39,300</div>
              </div>
              <div class="mockup-account">
                <div class="mockup-account-icon" style="background: #8b5cf6">💳</div>
                <div class="mockup-account-name">Savings</div>
                <div class="mockup-account-bal">৳ 1,000</div>
              </div>
            </div>

            <div class="mockup-section-label">Recent Transactions</div>
            <div class="mockup-tx-list">
              <div class="mockup-tx">
                <div class="mockup-tx-icon" style="background: rgba(239,68,68,0.15); color: #ef4444">🍜</div>
                <div class="mockup-tx-info">
                  <div class="mockup-tx-name">Food & Dining</div>
                  <div class="mockup-tx-date">Today, 1:30 PM</div>
                </div>
                <div class="mockup-tx-amount mockup-tx-amount--expense">– ৳ 380</div>
              </div>
              <div class="mockup-tx">
                <div class="mockup-tx-icon" style="background: rgba(34,197,94,0.15); color: #22c55e">💼</div>
                <div class="mockup-tx-info">
                  <div class="mockup-tx-name">Monthly Salary</div>
                  <div class="mockup-tx-date">Yesterday</div>
                </div>
                <div class="mockup-tx-amount mockup-tx-amount--income">+ ৳ 45,000</div>
              </div>
              <div class="mockup-tx">
                <div class="mockup-tx-icon" style="background: rgba(249,115,22,0.15); color: #f97316">🛒</div>
                <div class="mockup-tx-info">
                  <div class="mockup-tx-name">Grocery Shopping</div>
                  <div class="mockup-tx-date">May 18</div>
                </div>
                <div class="mockup-tx-amount mockup-tx-amount--expense">– ৳ 2,450</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const scrollTo = (href) => {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 68px;
  overflow: hidden;

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
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, transparent 70%);
      top: -200px;
      right: -100px;
      animation: float-blob 12s ease-in-out infinite;
    }

    &--2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.14) 0%, transparent 70%);
      bottom: -150px;
      left: -100px;
      animation: float-blob 16s ease-in-out infinite reverse;
    }

    &--3 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
      top: 40%;
      left: 35%;
      animation: float-blob 20s ease-in-out infinite;
    }
  }

  &__grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
  }

  &__inner {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 24px 100px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;

    @media (max-width: 1023px) {
      grid-template-columns: 1fr;
      gap: 60px;
      padding: 60px 24px 80px;
    }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px 6px 8px;
    background: rgba(249, 115, 22, 0.1);
    border: 1px solid rgba(249, 115, 22, 0.25);
    border-radius: 100px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #f97316;
    margin-bottom: 24px;

    &-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #f97316;
      box-shadow: 0 0 8px #f97316;
      animation: pulse-dot 2s ease-in-out infinite;
    }
  }

  &__title {
    font-size: clamp(2.8rem, 5vw, 4.2rem);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.04em;
    color: #f1f5f9;
    margin: 0 0 20px;

    &-gradient {
      background: linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__subtitle {
    font-size: 1.125rem;
    line-height: 1.7;
    color: #94a3b8;
    margin: 0 0 36px;
    max-width: 520px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  &__cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: linear-gradient(135deg, #f97316, #ef4444);
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 12px;
    text-decoration: none;
    box-shadow: 0 4px 24px rgba(249, 115, 22, 0.4);
    transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(249, 115, 22, 0.55);
      opacity: 0.95;
    }

    svg {
      transition: transform 0.25s ease;
    }

    &:hover svg {
      transform: translateX(3px);
    }
  }

  &__cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    color: #94a3b8;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: color 0.25s ease, background 0.25s ease;
    text-decoration: none;

    &:hover {
      color: #f1f5f9;
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &__play-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
  }

  &__trust {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;

    &-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 500;

      svg {
        flex-shrink: 0;
      }
    }
  }

  &__visual {
    position: relative;

    @media (max-width: 1023px) {
      max-width: 560px;
      margin: 0 auto;
    }
  }

  &__float-chip {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: rgba(15, 25, 45, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #e2e8f0;
    backdrop-filter: blur(10px);
    z-index: 10;
    white-space: nowrap;

    &--1 {
      top: 10%;
      left: -30px;
      animation: float-chip 5s ease-in-out infinite;
    }

    &--2 {
      bottom: 20%;
      left: -40px;
      animation: float-chip 7s ease-in-out infinite 1s;
    }

    &--3 {
      top: 20%;
      right: -20px;
      animation: float-chip 6s ease-in-out infinite 0.5s;
    }

    @media (max-width: 1023px) {
      display: none;
    }
  }
}

.chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;

  &--green { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
  &--orange { background: #f97316; box-shadow: 0 0 8px #f97316; }
  &--blue { background: #3b82f6; box-shadow: 0 0 8px #3b82f6; }
}

// ---- Mockup ----
.hero__mockup {
  border-radius: 16px;
  overflow: hidden;
  background: #0d1525;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.mockup-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  &__dots {
    display: flex;
    gap: 6px;

    span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);

      &:nth-child(1) { background: #ef4444; opacity: 0.7; }
      &:nth-child(2) { background: #f59e0b; opacity: 0.7; }
      &:nth-child(3) { background: #22c55e; opacity: 0.7; }
    }
  }

  &__title {
    font-size: 0.72rem;
    color: #475569;
    font-weight: 500;
    flex: 1;
    text-align: center;
  }
}

.mockup-body {
  padding: 16px;
}

.mockup-header-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.mockup-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ef4444);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.mockup-greeting {
  font-size: 0.78rem;
  font-weight: 700;
  color: #e2e8f0;
}

.mockup-date {
  font-size: 0.68rem;
  color: #475569;
  margin-top: 1px;
}

.mockup-balance-card {
  position: relative;
  border-radius: 12px;
  padding: 16px;
  background: linear-gradient(145deg, #1e2d42 0%, #0f1e35 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 12px;
  overflow: hidden;
}

.mockup-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;

  &--1 {
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(249, 115, 22, 0.2), transparent 70%);
    top: -40px;
    right: -20px;
  }

  &--2 {
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%);
    bottom: -20px;
    left: 20px;
  }
}

.mockup-balance-label {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.mockup-balance-amount {
  font-size: 1.6rem;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: -0.03em;
  margin-bottom: 10px;
}

.mockup-balance-chips {
  display: flex;
  gap: 8px;
}

.mockup-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 0.68rem;
  font-weight: 700;

  &--income {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  &--expense {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }
}

.mockup-accounts-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.mockup-account {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 10px 8px;
  text-align: center;

  &-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    margin: 0 auto 6px;
  }

  &-name {
    font-size: 0.6rem;
    color: #64748b;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-bal {
    font-size: 0.7rem;
    font-weight: 700;
    color: #e2e8f0;
  }
}

.mockup-section-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

.mockup-tx-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mockup-tx {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);

  &-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    flex-shrink: 0;
  }

  &-info {
    flex: 1;
    min-width: 0;
  }

  &-name {
    font-size: 0.72rem;
    font-weight: 600;
    color: #e2e8f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-date {
    font-size: 0.62rem;
    color: #475569;
    margin-top: 1px;
  }

  &-amount {
    font-size: 0.72rem;
    font-weight: 700;
    flex-shrink: 0;

    &--income { color: #22c55e; }
    &--expense { color: #ef4444; }
  }
}

// ---- Animations ----
@keyframes float-blob {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(20px, -20px); }
  66% { transform: translate(-15px, 15px); }
}

@keyframes float-chip {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
</style>
