import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import {getToken} from '../helpers/functions'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/panel',
      name: 'panel',
      component: () => import('../views/PanelView.vue'),
      meta:{ adminAuth:true },
      children:[
        {
          path:'home',
          name:'home-panel',
          component: () => import('../views/panel-childs/HomePanelView.vue'),
        },
        {
          path:'add-admin',
          name:'add-admin',
          component: () => import('../views/panel-childs/AddAdminView.vue'),
        },
        {
          path:'list-admin',
          name:'list-admin',
          component: () => import('../views/panel-childs/ListAdminsView.vue'),
        },
        {
          path:'add-category',
          name:'add-category',
          component: () => import('../views/panel-childs/AddCategoryView.vue'),
        },
        {
          path:'list-category',
          name:'list-category',
          component: () => import('../views/panel-childs/ListCategoryView.vue'),
        },
        {
          path:'add-product',
          name:'add-product',
          component: () => import('../views/panel-childs/AddProductView.vue'),
        },
        {
          path:'list-product',
          name:'list-product',
          component: () => import('../views/panel-childs/ListProductView.vue'),
        },
        {
          path:'edit-product/:_id',
          name:'edit-product',
          component: () => import('../views/panel-childs/EditProductView.vue'),
        },
        {
          path:'orders',
          name:'orders',
          component: () => import('../views/panel-childs/OrdersView.vue'),
        },
        {
          path:'profile',
          name:'profile',
          component: () => import('../views/panel-childs/ProfileView.vue'),
        }
      ]
    },
    {
      path:'/:catchAll(.*)',
      name:'error',
      component: () => import('../views/ErrorView.vue')
    }
  ]
})
router.beforeEach((to,from,next)=>{
  const token = getToken()
  if(to.matched.some(route=> route.meta.adminAuth)){
    if(! token){
      next({name: 'auth'})
    }else{
      next()
    }
  }else{
    next()
  }
})

export default router
