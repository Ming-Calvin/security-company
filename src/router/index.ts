// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
// import store from '@/store';
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
    // 所有需要展示在主布局下的页面，都作为 Layout 的子路由
    {
      path: '/',
      component: Layout,
      redirect: '/question-bank', // 重定向到首页
      children: [
        // {
        //   path: 'home',
        //   name: 'home',
        //   component: () => import('../views/HomeView.vue'),
        //   meta: { title: '首页', icon: 'HomeFilled' } // meta 用于面包屑和菜单
        // },
        // {
        //   path: 'profile',
        //   name: 'profile',
        //   component: () => import('../views/Profile.vue'),
        //   meta: { title: '个人中心', icon: 'User', requiresAuth: true }
        // },
        // {
        //   path: 'about',
        //   name: 'about',
        //   component: () => import('../views/AboutView.vue'),
        //   meta: { title: '关于', icon: 'InfoFilled' }
        // },
        {
          path: 'question-bank',
          name: 'question-bank',
          component: () => import('../views/QuestionBank.vue'),
          meta: { title: '问题库', icon: 'InfoFilled' }
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

// 全局前置守卫 (和之前一样，但注意路径判断)
router.beforeEach((to, from, next) => {
  // const isLoggedIn = store.getters['user/isLoggedIn'];
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


  console.log(to, 'to')
  next();
});

export default router;
