import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to) => {
    const authStoreModule = await import('src/stores/authStore')
    const authStore = authStoreModule.useAuthStore()

    // Wait for Firebase auth to be ready before making any decisions
    await authStore.waitForAuth()

    // Landing page and auth pages are public; everything under /dashboard requires auth
    const authRequired = to.path.startsWith('/dashboard')

    if (authRequired && !authStore.isAuthenticated) {
      return '/login'
    }

    // PIN lock check: if authenticated but PIN not yet entered
    if (authStore.isAuthenticated && authRequired) {
      const settingsStoreModule = await import('src/stores/settingsStore')
      const settingsStore = settingsStoreModule.useSettingsStore()
      if (settingsStore.appLock && !settingsStore.isAuthenticated) {
        return '/splash'
      }
    }

    // Authenticated user visiting login/register → go to dashboard
    const loginPages = ['/login', '/register']
    if (loginPages.includes(to.path) && authStore.isAuthenticated) {
      const settingsStoreModule = await import('src/stores/settingsStore')
      const settingsStore = settingsStoreModule.useSettingsStore()
      // Only redirect if no PIN lock, or PIN already entered
      if (!settingsStore.appLock || settingsStore.isAuthenticated) {
        return '/dashboard'
      }
    }

    return true
  })

  return Router
})
