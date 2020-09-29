import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login-page',
      component: require('@/pages/LoginPage/App.vue').default
    },
    {
      path: '/home',
      name: 'home-page',
      component: require('@/pages/HomePage/App.vue').default,
      children: [
        {
          name: 'mp-list',
          path: ':type',
          component: require('@/pages/HomePage/MiniAppList.vue').default
        },
        {
          name: 'card-list',
          path: 'card-list/:id',
          component: require('@/pages/HomePage/CardList.vue').default
        },
        {
          name: 'create-mp',
          path: 'create-mini-app/:type',
          component: require('@/pages/HomePage/CreateMiniAppForm.vue').default
        },
        {
          name: 'create-card',
          path: 'create-card/:id',
          component: require('@/pages/HomePage/CreateCardForm.vue').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
