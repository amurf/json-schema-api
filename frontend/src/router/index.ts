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
    component: () => import(/* webpackChunkName: "form" */ '../views/Form.vue')
  },
  {
    path: '/cadc',
    name: 'CADC',
    component: () => import(/* webpackChunkName: "cadc" */ '../views/CADC.vue')
  },
  {
    path: '/editor',
    name: 'Form Editor',
    component: () => import(/* webpackChunkName: "form-editor" */ '../views/FormEdit.vue')
  },
  {
    path: '/designer',
    name: 'Designer',
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
