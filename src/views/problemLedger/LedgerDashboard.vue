<template>
  <div class="ledger-dashboard-container">
    <div class="section">
      <div class="section-header">
        <el-icon class="header-icon"><DataBoard /></el-icon>
        <h2 class="section-title">系统台账</h2>
      </div>
      <el-row :gutter="24">
        <el-col
          v-for="ledger in systemLedgers"
          :key="ledger.title"
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
          v-for="ledger in commonLedgers"
          :key="ledger.title"
          :xs="24" :sm="12" :md="8" :lg="6"
        >
          <el-card shadow="hover" class="common-ledger-card">
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

// 系统台账数据
const systemLedgers = ref<SystemLedger[]>([
  { title: '纪委再监督台账', total: 40, completed: 10, pending: 23, overdue: 12 },
  { title: '台账总览', total: 150, completed: 10, pending: 23, overdue: 15 },
]);

// 常用台账数据
const commonLedgers = ref<CommonLedger[]>([
  { title: '第一责任监督台账', description: 'xxxxxxxxxxxxxxxxxxxx', lastUpdated: '2025-04-02' },
  { title: '一岗双责监督台账', description: 'xxxxxxxxxxxxxxxxxxxx', lastUpdated: '2025-04-02' },
  { title: '纪委书记专项监督台账', description: 'xxxxxxxxxxxxxxxxxxxx', lastUpdated: '2025-04-02' },
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
