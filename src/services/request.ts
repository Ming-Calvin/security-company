// 导入 InternalAxiosRequestConfig
import axios, { type InternalAxiosRequestConfig } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { getToken } from '@/utils/auth.ts'

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true
});

// 请求拦截器
instance.interceptors.request.use(
  // 使用正确的类型
  (config: InternalAxiosRequestConfig) => {
    // 获取token
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    // if (res.code !== 200 && res.status !== 'success') {
    //   return Promise.reject(new Error(res.message || 'Error'));
    // }
    return res;
  },
  (error) => {
    console.error('Response Error:', error);
    if (error.response?.status === 401) {
      // store.dispatch('user/logout');
    }
    return Promise.reject(error);
  }
);

export default instance;
