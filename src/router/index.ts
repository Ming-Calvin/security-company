// src/router/problemDatabase.ts

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
      redirect: '/ledger-dashboard', // 重定向到首页
      children: [
        {
          path: '/ledger-dashboard',
          name: 'ledger-dashboard',
          component: () => import('@/views/problemLedger/LedgerDashboard.vue'),
          meta: { title: '台账视图', requiresAuth: true }
        },
        {
          path: '/problem-ledger',
          name: 'problem-ledger',
          component: () => import('../views/problemLedger/ProblemLedger.vue'),
          meta: { title: '监督台账', requiresAuth: true }
        },
        {
          path: '/super-agency',
          name: 'super-agency',
          component: () => import('../views/superAgency/SuperAgency.vue'),
          meta: { title: '监督待办', requiresAuth: true }
        },
        {
          path: '/super-evaluation',
          name: 'super-evaluation',
          component: () => import('../views/superEvaluation/SuperEvaluation.vue'),
          meta: { title: '监督评价', requiresAuth: true }
        },
        {
          path: '/question-bank',
          name: 'question-bank',
          component: () => import('../views/problemDatabase/QuestionBank.vue'),
          meta: { title: '问题库', requiresAuth: true }
        }
      ]
    },
    {
      path: '/problem-entry',
      name: 'problem-entry',
      component: () => import('../views/problemDatabase/ProblemEntry.vue'),
    },
    {
      path: '/problem-detail',
      name: 'problem-detail',
      component: () => import('../views/problemDatabase/ProblemDetails.vue'),
    },
    {
      path: '/ledger-entry',
      name: 'ledger-entry',
      component: () => import('../views/problemLedger/LedgerEntry.vue'),
    },
    {
      path: '/ledger-detail',
      name: 'ledger-detail',
      component: () => import('../views/problemLedger/LedgerDetail.vue'),
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
