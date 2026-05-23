# Finance App — Project Audit Report
> Generated: 2026-05-23 | Stack: Vue 3 + Quasar + Firebase + Capacitor

---

## Task List

### 🔴 P0 — Critical (Do Now)
- [ ] SEC-01 — Rotate Firebase credentials in Firebase Console
- [ ] SEC-01 — Purge `.env` from entire git history (`git-filter-repo`)
- [x] SEC-02 — Add `firestore.rules` with per-user auth rules
- [x] SEC-03 — Enable Firebase App Check

### 🟠 P1 — High
- [ ] SEC-04 — Add Firestore write validators for amount field
- [ ] SEC-05 — Replace raw `console.error` with sanitized logger (`src/utils/logger.js`)
- [ ] SEC-06 — Move PIN hash to `sessionStorage`, add 10-min inactivity lock
- [ ] SEC-07 — Move avatar upload to Firebase Storage, store URL not base64
- [ ] SEC-09 — Fix balance update with Firestore batch write
- [ ] BUG-01 — Add 10s timeout to auth ready promise in `src/router/index.js`
- [ ] BUG-02 — Cascade delete transactions when category/account deleted
- [ ] BUG-04 — Unsubscribe `onSnapshot` in `onUnmounted` in `ReportsPage.vue`
- [ ] Add offline detection UI

### 🟡 P2 — Medium
- [ ] SEC-08 — Replace in-memory rate limit with Firebase App Check + reCAPTCHA v3
- [ ] SEC-10 — Encrypt data export with Web Crypto API
- [ ] BUG-03 — Fix loan due date timezone using `Intl.DateTimeFormat`
- [x] BUG-05 — Remove temp item from array on Firestore write failure
- [ ] PERF-01 — Pre-compute category spend map in store (fix O(N×M))
- [ ] PERF-02 — Add Firestore pagination (limit 50, load more on scroll)
- [ ] PERF-03 — Defer goals/loans store load by 2s or lazy-load
- [ ] Add error toast notifications on save failure

### 🟢 P3 — Low / Features
- [ ] SEC-11 — Strengthen password policy (12 chars + special char)
- [ ] SEC-12 — Add `Cache-Control: no-store` meta tag
- [ ] SEC-13 — Gate all `console.*` behind `import.meta.env.DEV`
- [ ] UX-01 — Empty state onboarding (3-step wizard for new users)
- [ ] UX-02 — Reorganize Settings into tabs (Profile / Preferences / Security / Data)
- [ ] UX-03 — Bulk transaction actions (long-press select mode)
- [ ] UX-04 — Transaction sort + advanced filter panel
- [ ] UX-05 — Search result highlighting with `<mark>` tag
- [ ] UX-06 — Loan installment timeline / progress bar
- [ ] UX-07 — Expandable "Other" slice in pie charts + data table
- [ ] UX-08 — Better form validation messages with examples
- [ ] UX-09 — Move toast to top-center, 2s auto-dismiss
- [ ] UX-10 — Complete dark mode with CSS custom properties
- [ ] UX-11 — Add date range picker to Reports page
- [ ] UX-12 — Fix mobile layout cramped on < 375px screens
- [ ] UX-13 — Swipe-to-delete/edit on transaction list (`QSwipeAction`)
- [ ] UX-14 — Biometric auth (fingerprint / Face ID via Capacitor)
- [ ] UX-15 — Category icon picker (50 finance icons)
- [ ] FEAT-01 — Recurring transactions (schema + Cloud Function + UI toggle)
- [ ] FEAT-02 — Budget alerts + FCM push notifications
- [ ] FEAT-03 — CSV import with column mapping UI (PapaParse)
- [ ] FEAT-04 — Multi-currency per account + forex API
- [ ] FEAT-05 — Year-over-year analytics with date range picker
- [ ] FEAT-06 — Debt payoff calculator (snowball / avalanche)
- [ ] FEAT-07 — Auto-categorization rules manager
- [ ] FEAT-08 — Account reconciliation (import bank CSV, match transactions)
- [ ] FEAT-09 — Scheduled future transactions + calendar view
- [ ] FEAT-10 — Shared wallet (family/couple) with permissions
- [ ] FEAT-11 — Bill reminders
- [ ] FEAT-12 — Receipt OCR (Google ML Kit)
- [ ] FEAT-13 — Investment tracking
- [ ] FEAT-14 — Tax tagging
- [ ] FEAT-15 — Home screen widget (Capacitor)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Security Issues](#2-security-issues)
3. [Code Quality & Bugs](#3-code-quality--bugs)
4. [Missing Features](#4-missing-features)
5. [UX/Usability Improvements](#5-uxusability-improvements)
6. [Immediate Action Items](#6-immediate-action-items)

---

## 1. Project Overview

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Quasar Framework v2.16 |
| State | Pinia |
| Backend | Firebase (Firestore, Auth, Analytics) |
| Build | Vite + Quasar CLI |
| Mobile | Capacitor 7 (iOS/Android) |
| PWA | Workbox Service Workers |
| i18n | Vue-i18n (English + Bengali) |
| Charts | ApexCharts |

### Pages & Modules

| Module | Pages |
|--------|-------|
| Auth | LoginPage, RegisterPage, SplashPage (PIN lock), LandingPage |
| Dashboard | IndexPage (overview, quick entry, recent transactions) |
| Accounts | AccountsPage, AccountTransactionsPage |
| Transactions | AddExpensePage, AddIncomePage, AllTransactionsPage, CategoryTransactionsPage, SearchPage |
| Loans | LoansPage (receivable, payable, installments) |
| Goals | OccasionGoalsPage (savings targets with deadline) |
| Reports | ReportsPage (pie charts, budget vs actual, trends) |
| Settings | SettingsPage (profile, security, currency, language, export) |
| Misc | NotesPage, MarketListsPage, HelpPage, PrivacyPolicyPage |

---

## 2. Security Issues

### 🔴 CRITICAL

#### SEC-01 — Firebase Credentials Exposed
- **File:** `.env`
- **Problem:** Live Firebase API key, project ID, and config committed or accessible
- **Impact:** Entire database accessible by anyone with the key
- **Fix:**
  1. Immediately rotate all Firebase API keys in Firebase Console
  2. Run `git filter-repo` or BFG to purge `.env` from git history
  3. Re-generate credentials and store only in deployment environment variables

```bash
# Remove .env from entire git history
npx git-filter-repo --path .env --invert-paths
```

---

#### SEC-02 — No Firestore Security Rules
- **Problem:** No `firestore.rules` file found in project
- **Impact:** If default rules are open (test mode), all user data is publicly readable/writable
- **Fix:** Add `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

#### SEC-03 — Session Hijacking → Full Data Access
- **Problem:** All Firestore ops rely solely on Firebase Auth token
- **Impact:** Stolen/leaked auth token exposes entire user financial data
- **Fix:**
  - Enable Firebase App Check (blocks unauthorized clients)
  - Add short token refresh intervals
  - Log suspicious access patterns in Firebase Console

---

### 🟠 HIGH

#### SEC-04 — Input Validation Only on Client
- **File:** `src/stores/transactionStore.js`, `IndexPage.vue:792`
- **Problem:** Amount/note fields validated only in Vue components, not enforced at Firestore level
- **Impact:** Malicious data (negative amounts, XSS strings) can be written directly via Firebase SDK
- **Fix:** Add Firestore security rule validators:

```
allow write: if request.resource.data.amount is number
             && request.resource.data.amount > 0
             && request.resource.data.amount < 10000000;
```

---

#### SEC-05 — Raw Firebase Errors Logged to Console
- **Files:** `transactionStore.js:52`, `accountStore.js:32`, `categoryStore.js` (multiple)
- **Problem:** `console.error('Error:', error)` logs raw Firebase error objects with internal details
- **Impact:** Production logs can expose collection paths, document IDs, user data
- **Fix:** Create a sanitized error logger:

```js
// src/utils/logger.js
export const logError = (context, error) => {
  if (import.meta.env.DEV) console.error(context, error)
  // else: send to Sentry/monitoring service
}
```

---

#### SEC-06 — PIN Stored Insecurely
- **File:** `src/pages/SplashPage.vue`, `src/stores/settingsStore.js`
- **Problem:**
  - PIN hashed with SHA-256 (good) but hash stored in plain `localStorage`
  - `localStorage` accessible via browser DevTools, extensions, malicious scripts
  - No auto-lock on logout or inactivity timeout
- **Fix:**
  - Use `sessionStorage` instead of `localStorage` (clears on tab close)
  - Add 10-minute inactivity auto-lock
  - Call `lock()` on auth `signOut()`

```js
// settingsStore.js — add inactivity timer
let inactivityTimer
export const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer)
  inactivityTimer = setTimeout(() => lock(), 10 * 60 * 1000)
}
```

---

#### SEC-07 — Avatar Stored as Base64 in Firestore
- **File:** `src/stores/authStore.js:139`
- **Problem:** User avatar uploaded as base64 data URL directly into Firestore document
- **Impact:**
  - No size validation — attacker can store MBs of data per user
  - Firestore document limit is 1MB — can crash document writes
  - No image format/content validation
- **Fix:** Use Firebase Storage:

```js
// Upload to Firebase Storage, store download URL in Firestore
const avatarRef = ref(storage, `avatars/${userId}`)
await uploadBytes(avatarRef, blob)
const url = await getDownloadURL(avatarRef)
await updateDoc(userRef, { avatarUrl: url }) // not base64
```

---

### 🟡 MEDIUM

#### SEC-08 — In-Memory Rate Limiting (Bypassable)
- **File:** `src/stores/authStore.js:35-50`
- **Problem:** Login rate limit (5 attempts/15 min) stored in JavaScript memory — resets on page refresh
- **Fix:** Use Firebase Authentication's built-in brute-force protection + reCAPTCHA v3:

```js
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
initializeAppCheck(app, { provider: new ReCaptchaV3Provider(SITE_KEY) })
```

---

#### SEC-09 — Balance Update Race Condition
- **Files:** `IndexPage.vue:860-864`, `AddExpensePage.vue:136-137`
- **Problem:** Transaction write and balance update are two separate Firestore operations
- **Impact:** Network failure between the two leaves balance inconsistent with transactions
- **Fix:** Use Firestore batch writes:

```js
const batch = writeBatch(db)
batch.set(transactionRef, transactionData)
batch.update(accountRef, { balance: increment(-amount) })
await batch.commit() // atomic — both succeed or both fail
```

---

#### SEC-10 — Data Export Not Encrypted
- **File:** `src/pages/SettingsPage.vue`
- **Problem:** Financial data exported as plain JSON — no password protection
- **Fix:** Encrypt export with user's password before download:

```js
// Use Web Crypto API to AES-256 encrypt before download
const exportData = JSON.stringify(data)
const encrypted = await window.crypto.subtle.encrypt(...)
```

---

### 🟢 LOW

#### SEC-11 — Weak Password Policy
- **File:** `src/pages/RegisterPage.vue`
- **Problem:** Accepts 8 chars with 1 uppercase + 1 number; no special character requirement
- **Fix:** Minimum 12 chars, require special character, check against HaveIBeenPwned API

#### SEC-12 — No Cache-Control Headers
- **Problem:** Financial data pages cached by browser
- **Fix:** Add to `public/index.html`:
```html
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
```

#### SEC-13 — Console Logs in Production
- Multiple `console.error/warn` in production build
- Remove all or gate behind `import.meta.env.DEV` check

---

## 3. Code Quality & Bugs

### 🐛 Bugs

#### BUG-01 — Auth State Hangs Forever
- **File:** `src/router/index.js:41`
- **Problem:** Waits for `isAuthReady` with no timeout — if Firebase auth never resolves, app freezes
- **Fix:**

```js
await Promise.race([
  authReadyPromise,
  new Promise((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), 10000))
])
```

---

#### BUG-02 — Orphaned Transactions After Delete
- **Problem:** Deleting a category or account doesn't clean up associated transactions
- **Impact:** SearchPage shows `undefined` category names for orphaned transactions
- **Fix:** Use Firestore batch delete on cascade:

```js
// When deleting a category, also delete/archive its transactions
const txQuery = query(txCollection, where('categoryId', '==', categoryId))
const txDocs = await getDocs(txQuery)
const batch = writeBatch(db)
txDocs.forEach(doc => batch.delete(doc.ref))
batch.delete(categoryRef)
await batch.commit()
```

---

#### BUG-03 — Loan Due Date Timezone Mismatch
- **File:** `src/stores/loanStore.js:55`
- **Problem:** `new Date(inst.dueDate)` assumes UTC; user's timezone from `settingsStore` not applied
- **Impact:** "This Month Due" shows wrong installments for users outside UTC
- **Fix:** Use `Intl.DateTimeFormat` or `date-fns-tz` for all date comparisons

---

#### BUG-04 — Memory Leak in Report Listeners
- **File:** `src/pages/ReportsPage.vue:22-59`
- **Problem:** `onSnapshot` listeners started in `onMounted` but no `onUnmounted` cleanup
- **Fix:**

```js
let unsubscribe
onMounted(() => { unsubscribe = onSnapshot(...) })
onUnmounted(() => unsubscribe?.())
```

---

#### BUG-05 — Optimistic Update Leaves Inconsistent State
- **File:** `src/stores/transactionStore.js:83-88`
- **Problem:** tempId transaction added to local array, replaced on success — but on failure, temp item stays
- **Fix:** Remove temp item from array on Firestore write failure

---

### ⚡ Performance Issues

#### PERF-01 — O(N×M) Category Spend Calculation
- **File:** `src/pages/IndexPage.vue:794-795`
- **Problem:** `getCategorySpent()` iterates all transactions per category on every render
- **Impact:** 10 categories × 1000 transactions = 10K iterations per re-render
- **Fix:** Pre-compute in store:

```js
// categoryStore.js
const categorySpentMap = computed(() => {
  return transactions.value.reduce((acc, tx) => {
    acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount
    return acc
  }, {})
})
```

---

#### PERF-02 — No Pagination on Transactions
- **Problem:** All stores fetch all documents at once — 10,000 transactions loaded on startup
- **Fix:** Use Firestore pagination:

```js
const first = query(collection(db, 'transactions'), orderBy('date', 'desc'), limit(50))
// Load more on scroll
```

---

#### PERF-03 — All Stores Load on Dashboard Mount
- **Problem:** Accounts, transactions, categories, loans, goals all start listeners simultaneously on dashboard
- **Fix:** Defer non-critical data (goals, loans) with 2s delay or lazy-load on tab scroll

---

## 4. Missing Features

### 🔴 High Priority

#### FEAT-01 — Recurring Transactions
- **Why needed:** Salary, rent, subscriptions are monthly — currently user must add manually each time
- **Implementation:**
  - Add `recurring: { enabled: bool, frequency: 'weekly'|'monthly'|'yearly', nextDate: timestamp }` to transaction schema
  - Cloud Function or scheduled check to auto-generate recurring transactions
  - UI: "Make this recurring" toggle in add/edit forms

---

#### FEAT-02 — Budget Alerts & Push Notifications
- **Why needed:** User has no way to know when they're overspending
- **Implementation:**
  - Use Firebase Cloud Messaging (FCM) for push notifications
  - Alert when category reaches 80% and 100% of budget
  - Weekly spending summary notification
  - Capacitor push plugin already available (Capacitor 7)

---

#### FEAT-03 — CSV Import for Bulk Transactions
- **Why needed:** Users migrating from other apps or importing bank statements
- **Implementation:**
  - CSV parser (PapaParse library)
  - Column mapping UI: "Which column is amount? date? description?"
  - Duplicate detection before import
  - Rollback if import fails

---

#### FEAT-04 — Multi-Currency per Account
- **Why needed:** Users with foreign accounts or travel expenses
- **Implementation:**
  - Add `currency` field per account (already has global currency setting)
  - Integrate free forex API (ExchangeRate-API or FreeCurrencyAPI)
  - Dashboard shows converted totals in base currency

---

#### FEAT-05 — Year-over-Year Analytics
- **Why needed:** Reports page shows only current period — no trend comparison
- **Implementation:**
  - Add date range picker to reports
  - Year/Month/Quarter comparison charts
  - "Spending this month vs same month last year"

---

### 🟡 Medium Priority

#### FEAT-06 — Debt Payoff Calculator (Snowball/Avalanche)
- Loans exist but no strategy simulator
- Show payoff date, total interest paid for each strategy
- Interactive slider: "What if I pay ৳500 extra/month?"

#### FEAT-07 — Auto-Categorization Rules
- User sets: "if note contains 'fuel' → Transportation category"
- Match on transaction note/description at save time
- UI: Rules manager in Settings

#### FEAT-08 — Account Reconciliation
- Import bank CSV, match against app transactions
- Show unmatched transactions on both sides
- Mark transactions as "reconciled"

#### FEAT-09 — Scheduled Future Transactions
- "Pay rent on 1st of every month" → shows in upcoming list
- Countdown to next payment
- Calendar view of scheduled payments

#### FEAT-10 — Shared Wallet (Family/Couple)
- Invite partner via email
- Shared view of combined expenses
- Permission: view-only vs full access

---

### 🟢 Low Priority

| Feature | Description |
|---------|-------------|
| FEAT-11 Bill Reminders | Notification before due dates |
| FEAT-12 Receipt OCR | Camera scan → auto-fill transaction (use Google ML Kit) |
| FEAT-13 Investment Tracking | Portfolio, P&L, dividend log |
| FEAT-14 Tax Tagging | Mark transactions as tax-deductible |
| FEAT-15 Widgets | Home screen widget showing balance (Capacitor Widget plugin) |

---

## 5. UX/Usability Improvements

### 🔴 Critical UX

#### UX-01 — Empty State Onboarding
- **Problem:** New user sees empty lists with no guidance
- **Fix:** Add illustrated empty states:
  - "No accounts yet — tap + to add your first account"
  - "No transactions this month — start by adding an expense"
  - Use a single onboarding flow for first-time users (3-step wizard)

---

#### UX-02 — Unorganized Settings Page
- **Problem:** Profile, security, currency, language, data export all mixed in one long scroll
- **Fix:** Group into tabs:
  - **Profile** — name, avatar, email
  - **Preferences** — currency, language, timezone, dark mode, emoji
  - **Security** — PIN, password change, biometrics
  - **Data** — export, import, backup, delete account

---

### 🟠 High UX

#### UX-03 — No Transaction Bulk Actions
- Can't select multiple transactions to delete, recategorize, or export
- **Fix:** Long-press to enter selection mode, floating action bar with bulk actions

#### UX-04 — Transaction Sort & Advanced Filter
- Currently always sorted newest-first
- **Fix:** Sort by: Date, Amount (high→low), Category
- Filter panel: date range picker, amount range slider, multi-category select

#### UX-05 — Search Result Highlighting
- **File:** `src/pages/SearchPage.vue`
- Search matches but no highlighting of matched text
- **Fix:** Wrap matched text in `<mark>` tag

#### UX-06 — Loan Installment Timeline View
- Installments shown as plain list; hard to understand schedule
- **Fix:** Add visual timeline or progress bar per loan showing paid vs remaining

---

### 🟡 Medium UX

#### UX-07 — Pie Charts Missing Detail
- Categories < 1% grouped as "Other" with no way to expand
- **Fix:** Add sortable data table below chart, clicking "Other" expands sub-items

#### UX-08 — Better Form Validation Feedback
- "Invalid amount" error doesn't explain what format is expected
- **Fix:**
  - Add placeholder: `e.g., 1500.00`
  - Inline green checkmark when field is valid
  - Error text: "Enter a positive number (e.g., 500 or 1250.75)"

#### UX-09 — Transaction Success Feedback
- Toast appears top-right (Quasar default) — easy to miss
- **Fix:** Move to top-center, auto-dismiss after 2s, include amount and category

#### UX-10 — Dark Mode Incomplete
- Toggle exists but not all components styled for dark
- **Fix:** Audit all components using `$q.dark.isActive`, use CSS custom properties:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
}
[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --text-primary: #e8e8e8;
}
```

#### UX-11 — Reports Date Range Picker
- Reports page has no date selector — stuck at current month
- **Fix:** Add date range picker (Quasar QDate), preset buttons: "This Month", "Last 3 Months", "This Year"

#### UX-12 — Mobile Layout Cramped
- Dashboard multi-column grid too narrow on small phones (< 375px)
- **Fix:** Single-column stack on mobile, `xs` breakpoint adjustments in Quasar grid

#### UX-13 — Missing Swipe Actions
- Mobile app but no swipe-to-delete or swipe-to-edit on transaction list items
- **Fix:** Implement Quasar `QSwipeAction` on transaction list items

#### UX-14 — No Biometric Auth
- PIN exists but no fingerprint/Face ID option
- **Fix:** Use Capacitor Biometrics plugin (`@capacitor-mlkit/barcode-scanning` already in project)

#### UX-15 — Category Icons Picker
- Categories have colors but no icon selection
- **Fix:** Add icon picker from a set of 50 finance-relevant emoji/icons

---

## 6. Immediate Action Items

> **Do these in the next 48 hours:**

| Priority | Action | Risk if Ignored |
|----------|--------|----------------|
| 🔴 P0 | Rotate Firebase credentials (SEC-01) | All user data exposed |
| 🔴 P0 | Add Firestore security rules (SEC-02) | Open read/write access |
| 🔴 P0 | Purge `.env` from git history (SEC-01) | Credentials leak permanently |
| 🟠 P1 | Fix balance batch write (SEC-09 / BUG) | Data corruption on network error |
| 🟠 P1 | Add offline detection UI | Silent failures confuse user |
| 🟠 P1 | Fix orphaned transactions (BUG-02) | Undefined references in Search |
| 🟡 P2 | Add error toast notifications | Users don't know when saves fail |
| 🟡 P2 | Fix memory leak in ReportsPage (BUG-04) | Memory grows unbounded |
| 🟡 P2 | Paginate transactions (PERF-02) | Slow load with >500 transactions |
| 🟢 P3 | Add empty state onboarding (UX-01) | Poor first-time user experience |

---

*This file is excluded from git (see .gitignore). Do not commit.*
