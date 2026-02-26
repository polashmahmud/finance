import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import { watch } from 'vue'
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

  Router.beforeEach(async (to, from, next) => {
    // We import authStore dynamically here to avoid initialization order issues
    const authStoreModule = await import('src/stores/authStore')
    const authStore = authStoreModule.useAuthStore()

    const publicPages = ['/login', '/register', '/splash']
    const authRequired = !publicPages.includes(to.path)

    // Wait for the auth to be ready before making routing decisions
    if (!authStore.isAuthReady) {
      // The boot file should ideally resolve this, but just in case:
      const stopWatch = watch(
        () => authStore.isAuthReady,
        (ready) => {
          if (ready) {
            stopWatch()
            handleNavigation()
          }
        },
      )
    } else {
      handleNavigation()
    }

    function handleNavigation() {
      if (authRequired && !authStore.isAuthenticated) {
        // User is not authenticated, trying to access a protected page
        return next('/login')
      } else if (!authRequired && authStore.isAuthenticated) {
        // User is authenticated, trying to access login/register
        if (to.path !== '/splash') {
          return next('/')
        }
        return next()
      } else {
        return next()
      }
    }
  })

  return Router
})
