import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import LoginScreen from '../views/LoginScreen.vue'
import VotacionsScreen from '../views/VotacionsScreen.vue'

// History mode needs a real HTTP server; Electron loads the app over file://.
const history =
  window.location.protocol === 'file:'
    ? createWebHashHistory()
    : createWebHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history,
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginScreen,
    },
    {
      path: '/votacions',
      name: 'votacions',
       component: VotacionsScreen,
    },
  ],
})

export default router
