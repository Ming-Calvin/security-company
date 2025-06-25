<template>
  <div class="ledger-dashboard-container">
    <div class="section">
      <div class="section-header">
        <el-icon class="header-icon"><DataBoard /></el-icon>
        <h2 class="section-title">系统台账</h2>
      </div>
      <el-row :gutter="24">
        <el-col
          v-for="ledger in accessibleSystemLedgers"
          :key="ledger.key"
          :span="12"
        >
          <el-card shadow="hover" class="system-ledger-card">
            <div class="card-top">
              <span class="card-title">{{ ledger.title }}</span>
              <el-button link type="primary" @click="viewLedger(ledger)">立即查看</el-button>
            </div>
            <div class="card-stats">
              <div class="stat-item">
                <div class="stat-label">台账总数</div>
                <div class="stat-value text-purple">{{ ledger.total }}</div>
              </div>

              <div class="stat-item">
                <div class="stat-label">已完结</div>
                <div class="stat-value">{{ ledger.completed }}</div>
              </div>

              <div class="stat-item">
                <div class="stat-label">未完结</div>
                <div class="stat-value">{{ ledger.pending }}</div>
              </div>

              <div class="stat-item">
                <div class="stat-label">整改超时</div>
                <div class="stat-value text-red">{{ ledger.overdue }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="section">
      <div class="section-header">
        <el-icon class="header-icon"><Star /></el-icon>
        <h2 class="section-title">常用台账</h2>
        <el-button link type="primary" :icon="Edit" @click="editCommonLedgers">编辑</el-button>
      </div>
      <el-row :gutter="24">
        <el-col
          v-for="ledger in accessibleSystemLedgers"
          :key="ledger.title"
          :xs="24" :sm="12" :md="8" :lg="6"
        >
          <el-card shadow="hover" class="common-ledger-card" @click="viewLedger(ledger)">
            <div class="card-top">
              <span class="card-title">{{ ledger.title }}</span>
              <el-button link type="primary" :icon="EditPen" @click="editSingleLedger(ledger)" />
            </div>
            <div class="card-body">
              <p class="description">台账描述：{{ ledger.description }}</p>
              <p class="update-time">更新时间：{{ ledger.lastUpdated }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DataBoard, Star, Edit, EditPen } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router'

const router = useRouter();

// --- 1. 定义数据结构 (Interface) ---
interface SystemLedger {
  title: string;
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

interface CommonLedger {
  title: string;
  description: string;
  lastUpdated: string;
}

// --- 2. 创建响应式数据对象 ---

interface SystemLedger {
  key: string; // 添加一个唯一的key
  title: string;
  total?: number; // 统计数据设为可选，因为它们是动态获取的
  completed?: number;
  pending?: number;
  overdue?: number;
  roles: string[]; // [核心] 定义可以访问此台账的角色
}

const allSystemLedgers: SystemLedger[] = [
  {
    key: 'discipline-rereview',
    title: '纪委再监督台账',
    total: 40, completed: 10, pending: 23, overdue: 12,
    description: '更新了台账数据', lastUpdated: '2025-06-24',
    roles: ['admin', 'jwb'], // 纪委办
  },
  {
    key: 'overview',
    title: '台账总览',
    total: 40, completed: 10, pending: 23, overdue: 12,
    description: '更新了台账数据', lastUpdated: '2025-06-24',
    roles: ['admin','boos', 'jwsj', 'dwsj', 'fglm', 'jwb'],
  },
  {
    key: 'first-responsibility',
    title: '第一责任监督台账',
    total: 40, completed: 10, pending: 23, overdue: 12,
    description: '更新了台账数据', lastUpdated: '2025-06-24',
    roles: ['admin','boos'],
  },
  {
    key: 'dual-responsibility',
    title: '一岗双责监督台账',
    total: 40, completed: 10, pending: 23, overdue: 12,
    description: '更新了台账数据', lastUpdated: '2025-06-24',
    roles: ['admin','dwsj'],
  },
  {
    key: 'discipline-secretary',
    title: '纪委书记专责监督台账',
    total: 40, completed: 10, pending: 23, overdue: 12,
    description: '更新了台账数据', lastUpdated: '2025-06-24',
    roles: ['admin','jwsj'],
  },
  {
    key: 'functional-dept',
    title: '职能部门监督台账',
    total: 40, completed: 10, pending: 23, overdue: 12,
    description: '更新了台账数据', lastUpdated: '2025-06-24',
    roles: ['admin','znbm'],
  },
  {
    key: 'business-dept',
    title: '业务部门监督台账',
    total: 40, completed: 10, pending: 23, overdue: 12,
    description: '更新了台账数据', lastUpdated: '2025-06-24',
    roles: ['admin','znbm', 'ywb'],
  }
];

import { useUserStore } from '@/stores/modules/user.ts';

const userStore = useUserStore();
// 2. 从 store 中获取当前用户的角色列表
const { roles: userRoles } = storeToRefs(userStore);

// 3. [核心] 创建计算属性，用于根据权限动态筛选台账
const accessibleSystemLedgers = computed(() => {
  const permittedLedgers = allSystemLedgers.filter(ledger => {
    return userRoles.value.some(userRole => ledger.roles.includes(userRole));
  });

  return permittedLedgers
});

// 常用台账数据
const commonLedgers = ref<CommonLedger[]>([
  { title: '第一责任监督台账', description: 'xxxxxxxxxxxxxxxxxxxx', lastUpdated: '2025-04-02' },
  { title: '一岗双责监督台账', description: 'xxxxxxxxxxxxxxxxxxxx', lastUpdated: '2025-04-02' },
  { title: '纪委书记专责监督台账', description: 'xxxxxxxxxxxxxxxxxxxx', lastUpdated: '2025-04-02' },
  { title: '职能监督台账', description: 'xxxxxxxxxxxxxxxxxxxx', lastUpdated: '2025-04-02' },
  { title: '业务监督台账', description: 'xxxxxxxxxxxxxxxxxxxx', lastUpdated: '2025-04-02' },
  { title: '集团监督台账', description: 'xxxxxxxxxxxxxxxxxxxx', lastUpdated: '2025-04-02' },
]);

// --- 3. 方法定义 (占位符) ---

const viewLedger = (ledger: SystemLedger) => {
  router.push({ name: 'problem-ledger', query: { ledger: ledger.title }})
};

const editCommonLedgers = () => {
  console.log('编辑常用台账');
};

const editSingleLedger = (ledger: CommonLedger) => {
  console.log(`编辑 '${ledger.title}'`);
};
</script>

<style scoped lang="scss">
.ledger-dashboard-container {
  padding: 24px;
  background-color: #ffffff;
}

.section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .header-icon {
    font-size: 20px;
    color: #409eff;
    margin-right: 12px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0;
    flex-grow: 1;
  }
}

.system-ledger-card {
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
  }

  .card-stats {
    display: flex;
    justify-content: space-around;
    text-align: center;
  }

  .stat-label {
    font-size: 14px;
    color: #909399;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
  }

  .text-purple {
    color: #7367f0;
  }
  .text-red {
    color: #ea5455;
  }
}

.common-ledger-card {
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    cursor: pointer;
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
  }

  .card-body p {
    margin: 0;
    font-size: 13px;
    color: #909399;
    line-height: 1.6;

    &.description {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 8px;
    }
  }
}

// 常用台账的列间距
.el-row {
  .el-col {
    margin-bottom: 24px;
  }
}
</style>
