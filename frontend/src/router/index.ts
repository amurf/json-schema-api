import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/form',
    name: 'Form',
    // route level code-splitting
    // this generates a separate chunk (form.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "form" */ '../views/Form.vue')
  },
  {
    path: '/designer',
    name: 'Designer',
    // route level code-splitting
    // this generates a separate chunk (form.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "designer" */ '../views/Designer.vue'),
    children: [
    {
      path: 'table/:name',
      name: 'Table Details',
      component: () => import(/* webpackChunkName: "table-details" */ '../components/TableDetails.vue')
    },
    {
      path: 'add',
      name: 'Add table',
      component: () => import(/* webpackChunkName: "add-table" */ '../components/AddTable.vue')
    },
    {
      path: 'save',
      name: 'Save',
      component: () => import(/* webpackChunkName: "save" */ '../components/Save.vue')
    },
    ],
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
