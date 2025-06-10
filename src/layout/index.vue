<template>
  <el-container class="app-wrapper">
    <el-header>
      <app-header />
    </el-header>

    <el-main>
      <app-main />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.main-container {
  display: flex;
  flex-direction: column;
}

.el-header {
  padding: 0;
  height: 50px; // 根据截图调整高度
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
