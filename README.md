# My Finance

A full-featured personal finance management application built with [Quasar Framework](https://quasar.dev) (Vue 3), Firebase, and Capacitor. Available as a **Progressive Web App (PWA)** and **Android app**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Firebase Setup](#firebase-setup)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Building for Production](#building-for-production)
- [Building for Android](#building-for-android)
- [Linting & Formatting](#linting--formatting)
- [Application Routes](#application-routes)

---

## Features

- **Dashboard** — Monthly income/expense summary with balance overview and balance-mood emojis
- **Accounts** — Manage multiple financial accounts (cash, bank, mobile banking, etc.)
- **Transactions** — Add income, expenses, and transfers between accounts
- **Categories** — Custom categories with icons and colors for organizing transactions
- **Reports** — Visual charts (powered by ApexCharts) for income/expense analysis
- **Market Lists** — Shopping list manager
- **Notes** — Quick personal notes
- **Search** — Full-text search across all transactions
- **Bilingual UI** — Full support for **Bengali (বাংলা)** and **English**
- **Dark Mode** — Toggle between light and dark themes
- **App Lock** — PIN-based lock screen with SHA-256 hashed PIN storage
- **Offline Support** — Firestore persistent local cache; writes are queued and synced automatically when back online
- **PWA** — Installable on desktop and mobile browsers
- **Android** — Native Android app via Capacitor

---

## Tech Stack

| Layer                | Technology                                                     |
| -------------------- | -------------------------------------------------------------- |
| Framework            | [Quasar v2](https://quasar.dev) + [Vue 3](https://vuejs.org)   |
| Language             | JavaScript (ES2022 modules)                                    |
| State Management     | [Pinia](https://pinia.vuejs.org)                               |
| Routing              | [Vue Router v4](https://router.vuejs.org)                      |
| Backend / Auth       | [Firebase v12](https://firebase.google.com) (Auth + Firestore) |
| Charts               | [ApexCharts](https://apexcharts.com) via vue3-apexcharts       |
| Internationalisation | [vue-i18n v11](https://vue-i18n.intlify.dev)                   |
| PWA                  | Workbox (GenerateSW mode)                                      |
| Mobile               | [Capacitor](https://capacitorjs.com) (Android)                 |
| Package Manager      | [pnpm](https://pnpm.io)                                        |
| Build Tool           | Vite (via @quasar/app-vite)                                    |
| Linter               | ESLint (flat config) + Prettier                                |

---

## Project Structure

```
finance/
├── src/
│   ├── boot/               # App boot files (Firebase, Pinia, i18n)
│   ├── components/         # Shared Vue components
│   ├── css/                # Global SCSS styles
│   ├── i18n/               # Translation files (bn.js, en.js)
│   ├── layouts/            # Page layouts (Main, Auth, Landing)
│   ├── pages/              # Route-level page components
│   ├── router/             # Vue Router config & routes
│   └── stores/             # Pinia stores (auth, account, transaction, etc.)
├── src-capacitor/          # Android / Capacitor project
├── src-pwa/                # PWA service worker & manifest
├── public/                 # Static assets & custom fonts
├── quasar.config.js        # Quasar CLI configuration
├── .env.example            # Environment variables template
└── package.json
```

---

## Prerequisites

Make sure the following are installed before you begin:

| Tool       | Minimum Version | Install                   |
| ---------- | --------------- | ------------------------- |
| Node.js    | v20 (LTS)       | https://nodejs.org        |
| pnpm       | v10             | `npm install -g pnpm`     |
| Quasar CLI | latest          | `pnpm add -g @quasar/cli` |
| Git        | any             | https://git-scm.com       |

For Android development, additionally install:

| Tool           | Notes                                    |
| -------------- | ---------------------------------------- |
| Java JDK 17+   | https://adoptium.net                     |
| Android Studio | https://developer.android.com/studio     |
| Android SDK    | Install via Android Studio → SDK Manager |

---

## Firebase Setup

This project requires a Firebase project with **Authentication** and **Firestore** enabled.

### 1. Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**, give it a name, and follow the wizard
3. Enable **Google Analytics** if desired

### 2. Enable Authentication

1. In the Firebase console, go to **Build → Authentication**
2. Click **Get started**
3. Under the **Sign-in method** tab, enable **Email/Password**

### 3. Create a Firestore Database

1. Go to **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (recommended) or test mode for local development
4. Select a region close to your users
5. **Important:** This app uses a named database with the ID `finance`.
   After the default database is created, go to the **Databases** list and create an additional database with the ID `finance`.

### 4. Set Firestore Security Rules

In **Firestore → Rules**, apply the following to protect each user's data:

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

### 5. Get Your Web App Credentials

1. In **Project Settings → General**, scroll down to **Your apps**
2. Click **Add app → Web (`</>`)**
3. Register the app and copy the `firebaseConfig` values — you will need these in the next step

---

## Environment Variables

Create a `.env` file in the project root by copying the provided template:

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase project values:

```dotenv
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> **Never** commit `.env` to version control. It is already listed in `.gitignore`.

---

## Installation

Clone the repository and install all dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/finance.git
cd finance

# Install dependencies using pnpm
pnpm install
```

---

## Running the App

### Development Server (Web / SPA)

```bash
pnpm dev
# or
quasar dev
```

The browser will open automatically at `http://localhost:9000`.

### Development Server (PWA mode)

```bash
quasar dev -m pwa
```

### Development Server (Android / Capacitor)

```bash
quasar dev -m capacitor -T android
```

This will sync web assets to the Capacitor project and launch the app via Android Studio or a connected device.

---

## Building for Production

### Web / SPA

```bash
pnpm build
# or
quasar build
```

Output files are placed in `dist/spa/`. Deploy this folder to any static hosting provider.

### Progressive Web App (PWA)

```bash
quasar build -m pwa
```

Output files are placed in `dist/pwa/`.

### Deploy to Firebase Hosting (optional)

```bash
# Install the Firebase CLI
npm install -g firebase-tools

# Login and initialise hosting
firebase login
firebase init hosting

# Deploy
firebase deploy --only hosting
```

When prompted for the public directory during `firebase init hosting`, enter `dist/spa` (or `dist/pwa` for PWA builds).

---

## Building for Android

### 1. Build the web assets and sync to Capacitor

```bash
quasar build -m capacitor -T android
```

### 2. Open in Android Studio

```bash
cd src-capacitor
npx cap open android
```

### 3. Build the APK or AAB

Inside Android Studio, go to **Build → Build Bundle(s) / APK(s)** and select your desired output format.

> **Note:** Make sure `src-capacitor/android/local.properties` contains the correct `sdk.dir` path pointing to your Android SDK installation, for example:
>
> ```
> sdk.dir=C\:\\Users\\YourName\\AppData\\Local\\Android\\Sdk
> ```

---

## Linting & Formatting

```bash
# Check for lint errors
pnpm lint

# Auto-format all files with Prettier
pnpm format
```

---

## Application Routes

| Path                                   | Page                      | Auth Required |
| -------------------------------------- | ------------------------- | ------------- |
| `/`                                    | Landing page              | No            |
| `/login`                               | Login                     | No            |
| `/register`                            | Register                  | No            |
| `/dashboard`                           | Home / Dashboard          | Yes           |
| `/dashboard/accounts`                  | Accounts list             | Yes           |
| `/dashboard/add-income`                | Add income                | Yes           |
| `/dashboard/add-expense`               | Add expense               | Yes           |
| `/dashboard/transfer`                  | Transfer between accounts | Yes           |
| `/dashboard/categories`                | Manage categories         | Yes           |
| `/dashboard/market-lists`              | Shopping / market lists   | Yes           |
| `/dashboard/notes`                     | Personal notes            | Yes           |
| `/dashboard/reports`                   | Charts & reports          | Yes           |
| `/dashboard/search`                    | Search transactions       | Yes           |
| `/dashboard/all-transactions`          | Full transaction history  | Yes           |
| `/dashboard/account/:id/transactions`  | Per-account transactions  | Yes           |
| `/dashboard/category/:id/transactions` | Per-category transactions | Yes           |
| `/dashboard/settings`                  | App settings              | Yes           |
| `/dashboard/help`                      | Help page                 | Yes           |

---

## License

This project is licensed under the **MIT License** — free to use, modify, and distribute for both personal and commercial purposes. See the [LICENSE](LICENSE) file for the full text.
