
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
// 导入我们刚刚创建的 API 函数和类型
import { getRole , loginByTgt } from '@/api/base.ts'
import { getPortalToken, getToken, setPortalToken, setToken } from '@/utils/auth.ts'

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
      const portalToken = getPortalToken()

      if(portalToken && token) {
        await fetchUserInfo()
      } else {
        const response = await loginByTgt(token)

        if(response.code == 200) {
          setPortalToken(response.token)

          try {
            await fetchUserInfo()
          } catch (e) {
            console.log(e, e)
          }
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function fetchUserInfo(): Promise<void> {
    try {
      const response = await getRole();

      // const response = {
      //   "msg": "操作成功",
      //   "code": 200,
      //   "permissions": [
      //     "*:*:*"
      //   ],
      //   "roles": [
      //     "admin"
      //   ],
      //   "user": {
      //     "searchValue": null,
      //     "createBy": null,
      //     "createTime": null,
      //     "updateBy": null,
      //     "updateTime": null,
      //     "remark": "管理员",
      //     "params": {},
      //     "hrId": "1",
      //     "deptId": "7798088947",
      //     "bsUserId": "0",
      //     "loginName": "admin",
      //     "userName": "超级管理员001",
      //     "email": "may33@chinatelecom.cn",
      //     "phonenumber": "17720720781",
      //     "hrCode": "71139901@VR",
      //     "telephonenumber": null,
      //     "idType": null,
      //     "idCard": null,
      //     "sex": "1",
      //     "orderNum": "9999",
      //     "birthday": "2021-04-16",
      //     "age": null,
      //     "nation": null,
      //     "marryCategory": null,
      //     "politicalStatus": null,
      //     "joinPartyDate": null,
      //     "registAddress": null,
      //     "extJoinUnionDate": null,
      //     "extKHShenfen": null,
      //     "extGongZuoD": null,
      //     "extManagePlace": null,
      //     "extZPLY": null,
      //     "workDate": null,
      //     "extLJGZSJJZ": null,
      //     "nationality": null,
      //     "employType": "0",
      //     "employeeStatus": "3",
      //     "serviceType": "0",
      //     "oIdJobPost": null,
      //     "pOIdEmpAdmin": "0",
      //     "pOIdEmpReserve2": "0",
      //     "projectId": "1784508127491887105",
      //     "projectId2": "1784508127491887105",
      //     "province": "福建省",
      //     "city": "福州市",
      //     "userDeptName": "综管部门",
      //     "post": "超级管理员",
      //     "companyName": "天翼云公司",
      //     "userType": "1",
      //     "provinceCode": "350000",
      //     "cityCode": "001",
      //     "companyCode": "001",
      //     "lastLoginTime": "2025-06-25 16:47:01",
      //     "lastLoginIp": "192.168.23.251",
      //     "thirdDeptName": "产品设计部",
      //     "avatar": null,
      //     "password": "$2a$10$fSvPZZYS9DSlQBOKrpEWs.W8nDrvBeU2jS2zlJImSsZwTetfvb/Hq",
      //     "salt": null,
      //     "status": "0",
      //     "imId": "0",
      //     "ypId": "ac110003-7acd-1903-817a-f03c7e88105f",
      //     "delFlag": "0",
      //     "passwordModifiedDate": null,
      //     "lastFailedLoginDate": null,
      //     "failedLoginAttempts": 0,
      //     "lockoutDate": null,
      //     "dept": null,
      //     "userExt": null,
      //     "userAttr": null,
      //     "projects": null,
      //     "supportDepts": null,
      //     "deptments": null,
      //     "depts": null,
      //     "deptIds": null,
      //     "roleIds": null,
      //     "admin": false
      //   }
      // }

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
