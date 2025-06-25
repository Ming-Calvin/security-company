// src/stores/user.ts

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
// 导入我们刚刚创建的 API 函数和类型
import { getRole , loginByTgt } from '@/api/base.ts'
import { getToken, setToken } from '@/utils/auth.ts'

export const useUserStore = defineStore('user', () => {
  // 角色信息 和 权限
  const userInfo = ref<UserInfo | null>(null);
  const roles = ref<string[]>([]);

  const token = ref<string | null>(localStorage.getItem('A-token'));

  // =================================================================
  // 2. Getters (计算属性)
  // =================================================================

  // 通过 userInfo 是否有值来判断是否已登录并获取了信息
  const isLoggedIn = computed(() => !!userInfo.value && !!token.value);
  const userName = computed(() => userInfo.value?.userName || '未登录');

  // =================================================================
  // 3. Actions (方法)
  // =================================================================

  /**
   * @description 获取并设置当前用户的核心信息 (user 和 roles)
   */
  async function getUserInfo(): Promise<void> {
    try {
      const token = getToken();

      if(token && token.startsWith('TGT')) {
        const response = await loginByTgt(token)

        if(response.code == 200) {
          setToken(response.token)

          try {
            await fetchUserInfo()
          } catch (e) {
            console.log(e, e)
          }
        }
      } else {
        await fetchUserInfo()
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function fetchUserInfo(): Promise<void> {
    try {
      const response = await getRole();

      if (response.code === 200 && response.user) {
        // [核心] 只提取并存储 user 和 roles 两个字段
        userInfo.value = response.user;
        roles.value = response.roles;
      } else {
        // 如果获取失败，清空用户信息并提示错误
        // clearUserInfo();
        ElMessage.error(response.msg || '获取用户信息失败');
      }
    } catch (error) {
      clearUserInfo();
      console.error('请求用户信息接口失败:', error);
      ElMessage.error('网络错误或认证失败，无法获取用户信息');
    }
  }

  /**
   * @description 清空用户信息和角色
   */
  function clearUserInfo(): void {
    token.value = null;
    userInfo.value = null;
    roles.value = [];
    removeToken()
  }

  // 必须 return 所有需要暴露给组件的状态和方法
  return {
    // State
    userInfo,
    roles,
    token,
    // Getters
    isLoggedIn,
    userName,
    getUserInfo,
    // Actions
    fetchUserInfo,
    clearUserInfo,
    setToken,
  };
});
