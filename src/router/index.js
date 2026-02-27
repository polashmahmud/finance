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

    const publicPages = ['/login', '/register', '/splash']
    const authRequired = !publicPages.includes(to.path)

    if (authRequired && !authStore.isAuthenticated) {
      // User is not authenticated, redirect to login
      return '/login'
    }

    if (!authRequired && authStore.isAuthenticated && to.path !== '/splash') {
      // User is already authenticated, redirect to home
      return '/'
    }

    // PIN lock check: if Firebase-authenticated but PIN lock is on and not yet unlocked
    if (authStore.isAuthenticated && to.path !== '/splash') {
      const settingsStoreModule = await import('src/stores/settingsStore')
      const settingsStore = settingsStoreModule.useSettingsStore()
      if (settingsStore.appLock && !settingsStore.isAuthenticated) {
        return '/splash'
      }
    }

    // Allow navigation
    return true
  })

  return Router
})
