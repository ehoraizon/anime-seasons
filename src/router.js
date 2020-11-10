// Base dependencies
import Vue from 'vue'
import { IonicVueRouter } from '@ionic/vue'

Vue.use(IonicVueRouter)

export default new IonicVueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: "/", redirect: "app/home" },
    { path: "/anime/:id" , component: () => import('./views/AnimeInfo/index.vue'), props: true},
    {
      path: "/app",
      component: () => import("./components/Tabs.vue"),
      children: [
        {
          path: "home",
          name: "home",
          components: {
            home: () =>
              import("./views/Home")
          }
        },
        {
          path: 'search',
          name: 'search',
          components: {
            search: () => 
            import('./views/Search')
          }
        },
        {
          path: 'follow',
          name: 'follow',
          components: {
            follow: () => 
            import('./views/Follow')
          }
        },
        {
          path: 'info',
          name: 'info',
          components: {
            info: () => 
            import('./views/Info')
          }
        },
        {
          path: 'sheduler',
          name: 'sheduler',
          components: {
            sheduler: () => 
            import('./views/Sheduler')
          }
        },
      ]
    }
  ],
})
