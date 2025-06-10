<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<style scoped>
.app-main {
  min-height: calc(100vh - 90px); /* 视口高度 - header高度 - main的padding */
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}

/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from,
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
