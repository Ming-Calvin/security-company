<template>
  <el-dialog
    v-model="dialogVisible"
    title="查看流程图"
    width="80%"
    top="5vh"
    :before-close="handleClose"
    class="flow-chart-dialog"
    @opened="handleDialogOpened"
  >
    <div class="flow-chart-wrapper" v-show="dialogVisible">
      <VueFlow
        :nodes="props.nodes"
        :edges="props.edges"
        class="basic-flow"
      >
        <Background />
        <Controls />
      </VueFlow>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import type { Node, Edge } from '@vue-flow/core';

// --- 3. 定义 Props 和 Emits ---

// 组件通过 props 接收外部数据
const props = defineProps({
  // 使用 modelValue 来配合 v-model 控制弹窗的显示/隐藏
  modelValue: {
    type: Boolean,
    required: true,
  },
  nodes: {
    type: Array as () => Node[],
    required: true,
  },
  edges: {
    type: Array as () => Edge[],
    required: true,
  },
});

// 定义组件可以触发的事件
const emit = defineEmits(['update:modelValue']);

const { fitView } = useVueFlow();

// --- 4. 实现 v-model ---

// 使用 computed 属性来同步 prop 和内部状态，这是 v-model 在组件上的标准用法
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const handleDialogOpened = () => {
  fitView();
};

const handleClose = () => {
  dialogVisible.value = false;
};
</script>

<style lang="scss">
.flow-chart-dialog {
  .el-dialog__body {
    height: calc(80vh - 60px);
    padding: 0;
  }
}
</style>

<style scoped>
.flow-chart-wrapper {
  height: 100%;
  width: 100%;
}

/* 之前定义的节点和连线样式保持不变 */
:deep(.vue-flow__node-input) {
  border-radius: 999px;
  background-color: #e9e7fd;
  border-color: #c2bdfc;
  color: #5b4ffc;
  font-weight: 600;
}

:deep(.vue-flow__edge-text) {
  font-size: 12px;
  fill: #555;
  font-weight: 500;
}
</style>
