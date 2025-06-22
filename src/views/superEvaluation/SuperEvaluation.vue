<template>
  <div class="statistics-container">
    <el-card shadow="never">
      <div class="top-bar">
        <div class="filter-left">
          <span class="filter-label">时间：</span>
          <el-date-picker
            v-model="filters.year"
            type="year"
            placeholder="选择年份"
            style="width: 120px"
          />
        </div>
        <div class="filter-right">
          <el-input
            v-model="filters.department"
            placeholder="部门搜索"
            :prefix-icon="Search"
            clearable
            style="width: 200px"
          />
          <el-button :icon="Upload" class="export-btn">导出</el-button>
        </div>
      </div>

      <div class="kpi-section">
        <div v-for="kpi in kpiData" :key="kpi.label" class="kpi-item">
          <div class="kpi-value" :class="kpi.colorClass">{{ kpi.value }}</div>
          <div class="kpi-label">{{ kpi.label }}</div>
        </div>
      </div>

      <div class="table-area">
        <el-table :data="tableData" v-loading="loading" border style="width: 100%">
          <el-table-column prop="departmentName" label="部门名称" width="150" fixed="left">
            <template #default="scope">
              <el-button link type="primary" @click="viewDepartmentDetails(scope.row)">
                {{ scope.row.departmentName }}
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="各项指标" align="center">
            <el-table-column prop="tasksReceived" label="接受任务数量" width="140" align="center" sortable />
            <el-table-column prop="tasksCompleted" label="完成督办任务数量" width="160" align="center" sortable />
            <el-table-column prop="tasksReceivedRatio" label="接受任务占比" width="140" align="center" sortable />
            <el-table-column prop="avgRectificationTime" label="平均整改耗时" width="140" align="center" sortable />
            <el-table-column prop="completionRate" label="完成率" width="120" align="center" sortable />
            <el-table-column prop="timelyCompletionRate" label="及时完成率" width="120" align="center" sortable />
            <el-table-column prop="problemsRaised" label="提出问题数量" width="140" align="center" sortable />
          </el-table-column>

          <el-table-column label="评分" align="center">
            <el-table-column prop="rectificationScore" label="整改问题点得分" width="150" align="center" sortable />
            <el-table-column prop="undiscoveredProblemDeduction" label="当年未发现问题扣分" width="180" align="center" sortable />
            <el-table-column prop="leaderScore" label="公司领导评分" width="140" align="center" sortable />
            <el-table-column prop="comprehensiveScore" label="综合得分" width="120" align="center" sortable />
          </el-table-column>
        </el-table>
      </div>

    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Search, Upload } from '@element-plus/icons-vue';

// --- 1. TypeScript 类型定义 ---
interface Kpi {
  value: string | number;
  label: string;
  colorClass: 'text-blue' | 'text-orange' | 'text-green' | 'text-default';
}

interface DepartmentStat {
  id: string;
  departmentName: string;
  tasksReceived: number;
  tasksCompleted: number;
  tasksReceivedRatio: string;
  avgRectificationTime: string;
  completionRate: string;
  timelyCompletionRate: string;
  problemsRaised: number;
  rectificationScore: number;
  undiscoveredProblemDeduction: number;
  leaderScore: number;
  comprehensiveScore: number;
}

// --- 2. 响应式状态定义 ---
const loading = ref(false);

// 顶部筛选条件
const filters = reactive({
  year: new Date(), // 默认为当前年份
  department: '',
});

// 关键指标 (KPI) 数据
const kpiData = ref<Kpi[]>([
  { value: 28, label: '任务总数', colorClass: 'text-default' },
  { value: 22, label: '未完结', colorClass: 'text-blue' },
  { value: 6, label: '已完结', colorClass: 'text-green' },
  { value: '87%', label: '完成率', colorClass: 'text-default' },
  { value: '15天', label: '平均整改耗时', colorClass: 'text-orange' },
]);

// 表格数据
const tableData = ref<DepartmentStat[]>([]);

// --- 3. 方法定义 ---

// 模拟获取数据
const fetchData = () => {
  loading.value = true;
  console.log('根据筛选条件获取数据:', filters);
  // 模拟 API延时
  setTimeout(() => {
    // 在这里调用你的真实 API
    tableData.value = [
      { id: '1', departmentName: '数字化运营部', tasksReceived: 700, tasksCompleted: 823, tasksReceivedRatio: '7天', avgRectificationTime: '23%', completionRate: '80%', timelyCompletionRate: '80%', problemsRaised: 20, rectificationScore: 30, undiscoveredProblemDeduction: -6, leaderScore: 10, comprehensiveScore: 90 },
      { id: '2', departmentName: '技术中台部', tasksReceived: 269, tasksCompleted: 994, tasksReceivedRatio: '7天', avgRectificationTime: '23%', completionRate: '80%', timelyCompletionRate: '80%', problemsRaised: 20, rectificationScore: 30, undiscoveredProblemDeduction: -6, leaderScore: 10, comprehensiveScore: 90 },
      { id: '3', departmentName: '科技创新部', tasksReceived: 254, tasksCompleted: 414, tasksReceivedRatio: '7天', avgRectificationTime: '23%', completionRate: '80%', timelyCompletionRate: '80%', problemsRaised: 10, rectificationScore: 30, undiscoveredProblemDeduction: -6, leaderScore: 10, comprehensiveScore: 90 },
      { id: '4', departmentName: '人力部', tasksReceived: 158, tasksCompleted: 143, tasksReceivedRatio: '7天', avgRectificationTime: '23%', completionRate: '80%', timelyCompletionRate: '80%', problemsRaised: 20, rectificationScore: 30, undiscoveredProblemDeduction: -6, leaderScore: 10, comprehensiveScore: 90 },
      { id: '5', departmentName: '财务部', tasksReceived: 685, tasksCompleted: 906, tasksReceivedRatio: '7天', avgRectificationTime: '23%', completionRate: '80%', timelyCompletionRate: '80%', problemsRaised: 10, rectificationScore: 30, undiscoveredProblemDeduction: -6, leaderScore: 10, comprehensiveScore: 90 },
    ];
    loading.value = false;
  }, 500);
};

const viewDepartmentDetails = (row: DepartmentStat) => {
  console.log('查看部门详情:', row.departmentName);
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss">
.statistics-container {
  background-color: #f5f7fa;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filter-left, .filter-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-label {
  font-size: 14px;
  color: #606266;
}

.export-btn {
  margin-left: 10px;
}

.kpi-section {
  display: flex;
  justify-content: space-around;
  text-align: center;
  padding: 24px 0;
  margin-bottom: 24px;
  background-color: #fff;
  border-radius: 4px;
}

.kpi-item {
  .kpi-value {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .kpi-label {
    font-size: 14px;
    color: #909399;
  }
}

.text-blue { color: #409eff; }
.text-orange { color: #e6a23c; }
.text-green { color: #67c23a; }
.text-default { color: #303133; }

.table-area {
  margin-top: 20px;
}

.el-table {
  --el-table-header-bg-color: #f5f7fa;
}
</style>
