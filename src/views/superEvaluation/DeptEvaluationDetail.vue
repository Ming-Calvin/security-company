<template>
  <div class="department-evaluation-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <el-page-header @back="handleGoBack">
            <template #content>
              <span class="page-title">部门评价详情</span>
            </template>
          </el-page-header>
<!--          <el-button type="primary" size="large">评价</el-button>-->
        </div>
      </template>

      <div v-loading="loading" class="main-content">
        <div class="info-header">
          <div class="info-item">
            <div class="info-label">部门名称</div>
            <div class="info-value department-name"> {{ route.query.departmentName }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">
              <el-icon color="#67c23a" style="margin-right: 4px;"><CircleCheckFilled /></el-icon>
              评分项目
            </div>
            <div class="info-value">{{ pageData.evaluationProject }}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <el-icon><DataLine /></el-icon>
            <h3 class="section-title">部门专项指标</h3>
          </div>
          <el-descriptions :column="4" border class="metrics-table">
            <el-descriptions-item
              v-for="metric in pageData.specialMetrics"
              :key="metric.label"
              :label="metric.label"
              label-align="center"
              align="center"
            >
              <span class="metric-value">{{ metric.value }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="section">
          <div class="section-header">
            <el-icon><Trophy /></el-icon>
            <h3 class="section-title">评分</h3>
          </div>
          <el-descriptions :column="5" border class="metrics-table">
            <el-descriptions-item
              v-for="score in pageData.scores"
              :key="score.label"
              :label="score.label"
              label-align="center"
              align="center"
            >
              <span class="metric-value" :class="getScoreClass(score.value)">
                {{ score.value }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { CircleCheckFilled, DataLine, Trophy } from '@element-plus/icons-vue';

const route = useRoute()

// --- 1. TypeScript 类型定义 ---
interface Metric {
  label: string;
  value: string | number;
}

interface Score extends Metric {
  // 可以添加额外属性
}

interface PageData {
  departmentName: string;
  evaluationProject: string;
  specialMetrics: Metric[];
  scores: Score[];
}

// --- 2. 响应式状态与模拟数据 ---
const router = useRouter();
const loading = ref(false);
const pageData = ref<PageData>({
  departmentName: 'Xxxxx 部门',
  evaluationProject: '2025 年度部门整体评价',
  specialMetrics: [
    { label: '接受任务数量', value: 122 },
    { label: '完成督办任务数量', value: 122 },
    { label: '接受任务占比', value: '21%' },
    { label: '平均处理时长', value: '22天' },
    { label: '监督问题平均分', value: 87 },
    { label: '完成率', value: '100%' },
    { label: '及时完成率', value: '100%' },
    { label: '提出问题数量', value: 13 },
  ],
  scores: [
    { label: '监督问题综合得分', value: 8.7 },
    { label: '监督问题提出加分', value: 90 },
    { label: '(职能) 全年未发现问题扣分', value: -5 },
    { label: '公司领导评分', value: 10 },
    { label: '综合得分', value: 108.7 },
  ],
});


// --- 3. 方法定义 ---
const handleGoBack = () => {
  router.back();
};

const getScoreClass = (score: number | string) => {
  const numericScore = Number(score);
  if (numericScore < 0) return 'score-negative';
  if (numericScore >= 90) return 'score-high';
  return '';
};

// 模拟从API获取数据
const fetchData = () => {
  loading.value = true;
  setTimeout(() => {
    // 在这里调用你的真实API，然后将返回数据赋值给 pageData.value
    loading.value = false;
  }, 500);
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss">
.department-evaluation-container {
}

:deep(.el-card__header) {
  padding: 16px 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
}

.main-content {
  padding: 16px;
}

.info-header {
  display: flex;
  gap: 48px;
  margin-bottom: 24px;
}

.info-item {
  .info-label {
    font-size: 14px;
    color: #909399;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
  .info-value {
    font-size: 16px;
    color: var(--el-text-color-primary);
  }
  .department-name {
    font-size: 16px;
  }
}

.section {
  margin-top: 32px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }
}

.metrics-table {
  .metric-value {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
  .score-negative {
    color: #f56c6c; // 红色
  }
  .score-high {
    color: #67c23a; // 绿色
  }
}
</style>
