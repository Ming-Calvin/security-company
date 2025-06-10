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
      <el-menu-item index="/problem-ledger">
        <el-icon><Menu /></el-icon>
        <span>问题台账</span>
      </el-menu-item>

      <el-menu-item index="/super-agency">
        <el-icon><Histogram /></el-icon>
        <span>监督代办</span>
      </el-menu-item>

      <el-menu-item index="/question-bank">
        <el-icon><QuestionFilled /></el-icon>
        <span>问题库</span>
      </el-menu-item>

      <div class="header-search">
        <el-input
          v-model="searchQuery"
          placeholder="综合查询"
          class="input-with-select"
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>

      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <el-avatar icon="UserFilled" :size="30" />
            <span class="user-name">{{ userInfo?.name || '管理员' }}</span>
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
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Search } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

const searchQuery = ref('');

// const userInfo = computed(() => store.getters['user/userInfo']);
const userInfo = {}

// 生成面包屑数据
const breadcrumbItems = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title);
});

const goToProfile = () => {
  router.push('/profile');
};

const handleLogout = () => {
  store.dispatch('user/logout');
  router.push('/login');
};
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
    width: 400px;
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
