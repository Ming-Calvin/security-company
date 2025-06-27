<template>
  <div class="navbar">
    <el-menu
      :default-active="activeMenu"
      background-color=""
      mode="horizontal"
      text-color="#131414"
      active-text-color="#3776f0"
      :router="true"
    >
      <el-menu-item
        v-for="item in accessibleMenuItems"
        :key="item.index"
        :index="item.index"
      >
        <el-icon>
<!--          <component :is="item.icon" />-->
          <Histogram/>
        </el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>

<!--      <div class="header-search">-->
<!--        <el-input-->
<!--          v-model="searchQuery"-->
<!--          placeholder="综合查询"-->
<!--          class="input-with-select"-->
<!--        >-->
<!--          <template #append>-->
<!--            <el-button :icon="Search" />-->
<!--          </template>-->
<!--        </el-input>-->
<!--      </div>-->

      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <el-avatar icon="UserFilled" :size="30" />
            <span class="user-name">{{ userInfo?.userName || '管理员' }}</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
// 1. [新增] 导入所有需要的模块
import { ref, computed, shallowRef, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Menu as IconMenu,
  Histogram,
  Comment,
  QuestionFilled,
  Setting,
  Search,
  ArrowDown, // [新增] 导入缺失的图标
} from '@element-plus/icons-vue';

// 2. [修改] 从 store 中解构数据
import { useUserStore } from '@/stores/modules/user'; // 假设你使用了 index.ts 统一导出
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore); // 只解构需要的部分

// 3. [新增] 定义模板中用到的所有状态和方法
const router = useRouter();
const route = useRoute();

const searchQuery = ref('');

// 使用 computed 属性，让激活的菜单根据当前路由路径自动更新
const activeMenu = computed(() => route.path);

const goToProfile = () => {
  router.push('/profile'); // 假设个人中心路由为 /profile
};

const handleLogout = () => {
  // 假设你的 userStore 中有 logout action
  userStore.logout();
  // 登出后跳转到登录页
  router.push('/login');
};


// 4. 定义菜单配置数据 (你的代码，是正确的)
interface MenuItem {
  index: string;
  title: string;
  icon: Component;
  roles: string[];
}

// 角色标识符说明：
// boos: 公司一把手
// jwsj: 纪委书记
// dwsj: 党委书记
// fglm: 分管领导 (我为你创建的缩写)
// znbm: 职能部门
// admin: 系统管理员 (我为你添加的，用于访问“系统设置”)

const menuItems: MenuItem[] = [
  {
    index: '/ledger-dashboard',
    title: '监督台账',
    icon: shallowRef(IconMenu),
    roles: ['admin', 'boos', 'jwsj', 'dwsj', 'fglm', 'znbm'],
  },
  {
    index: '/super-agency',
    title: '监督待办',
    icon: shallowRef(Histogram),
    roles: ['admin', 'boos', 'jwsj', 'dwsj', 'fglm', 'znbm'],
  },
  {
    index: '/super-evaluation',
    title: '监督评价',
    icon: shallowRef(Comment),
    roles: ['admin', 'boos', 'jwsj', 'dwsj', 'fglm'],
  },
  {
    index: '/question-bank',
    title: '问题库',
    icon: shallowRef(QuestionFilled),
    roles: ['admin', 'znbm'],
  },
  {
    index: '/system-setting',
    title: '系统设置',
    icon: shallowRef(Setting),
    roles: ['admin', 'boos'], // 假设系统设置只有'admin'角色可以访问
  },
];

const { roles: userRoles } = storeToRefs(userStore);

const accessibleMenuItems = computed(() => {
  return menuItems.filter(menuItem => {
    // a. 如果菜单项没有定义 roles，则所有人可见
    if (!menuItem.roles || menuItem.roles.length === 0) {
      return true;
    }
    // b. 否则，检查用户的角色中是否至少有一个存在于菜单项的 roles 数组中
    // some() 方法在这里非常适合
    return userRoles.value.some(userRole => menuItem.roles!.includes(userRole));
  });
});
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  padding: 0 20px;
}

.header-oprea {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: calc(100%  - 450px);
}

.header-search {
  display: flex;
  padding: 0 40px;

  .input-with-select {
    width: 200px;
    margin: auto;
    :deep(.el-input-group__prepend) {
      background-color: #fff;
      color: #409EFF;
      border-bottom: 2px solid #409EFF;
    }
  }
}

.right-menu {
  display: flex;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;

  .avatar-container {
    cursor: pointer;

    .avatar-wrapper {
      display: flex;
      align-items: center;

      .user-name {
        margin-left: 10px;
        font-size: 14px;
      }
    }
  }
}
</style>
