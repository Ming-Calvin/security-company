// src/services/request.ts

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import store from '@/store'; // 引入 store

const instance: AxiosInstance = axios.create({
  baseURL: 'https://api.example.com', // 你的 API base URL
  timeout: 10000, // 请求超时时间
});

// // 请求拦截器
// instance.interceptors.request.use(
//   (config: AxiosRequestConfig): AxiosRequestConfig => {
//     // 在发送请求之前做些什么，比如加上 token
//     const token = store.getters['user/token'];
//     if (token) {
//       if (!config.headers) {
//         config.headers = {};
//       }
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // 对请求错误做些什么
//     console.error('Request Error:', error);
//     return Promise.reject(error);
//   }
// );
//
// // 响应拦截器
// instance.interceptors.response.use(
//   (response: AxiosResponse) => {
//     // 对响应数据做点什么
//     // 通常我们只需要返回 response.data
//     const res = response.data;
//     // 这里可以根据你后端返回的 code 或 status 做统一处理
//     if (res.code !== 200 && res.status !== 'success') {
//       // 例如：弹窗提示错误
//       alert(`API Error: ${res.message || 'Error'}`);
//       return Promise.reject(new Error(res.message || 'Error'));
//     }
//     return res;
//   },
//   (error) => {
//     // 对响应错误做点什么
//     console.error('Response Error:', error);
//     if (error.response?.status === 401) {
//       // 例如：token 过期，跳转到登录页
//       store.dispatch('user/logout');
//       // router.push('/login'); // 在非组件内使用 router 需要特殊处理
//     }
//     return Promise.reject(error);
//   }
// );

export default instance;
