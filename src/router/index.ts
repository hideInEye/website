import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Test from '../components/test';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "introduce" */ '../view/login/login.vue'),
  },
  {
    path: '/',
    name: 'dashboard',
    redirect: '/home',
    component: () =>
      import(/* webpackChunkName: "introduce" */ '../Layout/index.vue'),
    children: [
      // { path: '/', redirect: '/login' },
      {
        path: 'home',
        name: 'home',
        // meta: {
        //     isLogin: true // 添加该字段，表示进入这个路由是需要登录的
        // },
        component: () =>
          import(/* webpackChunkName: "introduce" */ '../view/home/index.vue'),
      },
      {
        path: 'admin',
        name: 'admin',
        // meta: {
        //     isLogin: true // 添加该字段，表示进入这个路由是需要登录的
        // },
        component: () =>
          import(/* webpackChunkName: "introduce" */ '../view/admin/index.vue'),
      },
      {
        path: 'about',
        name: 'about',
        // meta: {
        //     isLogin: true // 添加该字段，表示进入这个路由是需要登录的
        // },
        component: () =>
          import(/* webpackChunkName: "introduce" */ '../view/about/index.vue'),
      },
      {
        path: '/article/detail',
        name: 'articleDetail',
        component: () =>
          import(
            /* webpackChunkName: "introduce" */ '../view/article/detail.vue'
          ),
      },
    ],
  },
  {
    path: '/test',
    name: 'test',
    component: Test,
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('../components/demo.vue'),
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
