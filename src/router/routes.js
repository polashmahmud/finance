const routes = [
  // Landing page (public)
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [{ path: '', component: () => import('pages/LandingPage.vue') }],
  },

  // Auth routes
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/LoginPage.vue') }],
  },
  {
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/RegisterPage.vue') }],
  },
  {
    path: '/splash',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/SplashPage.vue') }],
  },

  // Main app routes (protected)
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'accounts', component: () => import('pages/AccountsPage.vue') },
      { path: 'add-income', component: () => import('pages/AddIncomePage.vue') },
      { path: 'add-expense', component: () => import('pages/AddExpensePage.vue') },
      { path: 'transfer', component: () => import('pages/TransferPage.vue') },
      { path: 'categories', component: () => import('pages/CategoriesPage.vue') },
      { path: 'market-lists', component: () => import('pages/MarketListsPage.vue') },
      { path: 'notes', component: () => import('pages/NotesPage.vue') },
      { path: 'reports', component: () => import('pages/ReportsPage.vue') },
      { path: 'search', component: () => import('pages/SearchPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') },
      { path: 'help', component: () => import('pages/HelpPage.vue') },
      { path: 'all-transactions', component: () => import('pages/AllTransactionsPage.vue') },
      {
        path: 'account/:id/transactions',
        component: () => import('pages/AccountTransactionsPage.vue'),
      },
      {
        path: 'category/:id/transactions',
        component: () => import('pages/CategoryTransactionsPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
