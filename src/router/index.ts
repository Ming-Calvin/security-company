// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
// import stores from '@/stores';
import Layout from '@/layout/index.vue'; // 引入 Layout 组件

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页面是独立的，不使用 Layout
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('../views/Login.vue'),
    // },
    {
      path: '/',
      component: Layout,
      redirect: '/question-bank', // 重定向到首页
      children: [
        {
          path: '/problem-ledger',
          name: '/problem-ledger',
          component: () => import('../views/ProblemLedger.vue'),
          meta: { title: '关于' }
        },
        {
          path: '/super-agency',
          name: '/super-agency',
          component: () => import('../views/SuperAgency.vue'),
          meta: { title: '关于' }
        },
        {
          path: 'question-bank',
          name: 'question-bank',
          component: () => import('../views/QuestionBank.vue'),
          meta: { title: '问题库' }
        },
      ]
    },
    {
      path: '/problem-entry',
      name: 'problem-entry',
      component: () => import('../views/ProblemEntry.vue'),
    },
    {
      path: '/problem-detail',
      name: 'problem-detail',
      component: () => import('../views/ProblemDetails.vue'),
    },
    // (可选) 404 页面
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('../views/NotFound.vue'),
    // }
  ],
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // const isLoggedIn = stores.getters['user/isLoggedIn'];
  //
  // if (to.meta.requiresAuth && !isLoggedIn) {
  //   next({
  //     path: '/',
  //     query: { redirect: to.fullPath },
  //   });
  // } else if (to.name === 'login' && isLoggedIn) {
  //   next({ name: 'home' });
  // } else {
  //   next();
  // }

  next();
});

export default router;
