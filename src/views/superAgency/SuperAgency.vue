<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <div class="side-menu">
        <div
          v-for="item in menuItems"
          :key="item.key"
          class="menu-item"
          :class="{ 'is-active': activeMenu === item.key }"
          @click="handleMenuClick(item.key)"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </el-col>

    <el-col :span="20">
      <el-card shadow="never">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="待办 (0)" name="todo"></el-tab-pane>
          <el-tab-pane label="已办 (0)" name="done"></el-tab-pane>
        </el-tabs>

        <div class="filter-bar">
          <div class="filter-inputs">
            <el-input
              v-model="queryParams.keyword"
              placeholder="问题描述关键字搜索"
              clearable
              style="width: 240px;"
              class="filter-item"
            />
            <el-date-picker
              v-model="queryParams.date"
              type="date"
              placeholder="到达时间"
              clearable
              style="width: 180px;"
              class="filter-item"
            />
            <el-button @click="resetQuery" class="filter-item">重置</el-button>
          </div>
          <div class="config-actions">
            <el-button :icon="Setting" text bg>字段配置</el-button>
          </div>
        </div>

        <div class="table-area">
          <el-table :data="tableData" v-loading="loading" style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="description" label="问题描述" min-width="200" show-overflow-tooltip>
              <template #default="scope">
                <el-button link type="primary" @click="viewDetails(scope.row)">{{ scope.row.description }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="问题类型" width="120" align="center" />
            <el-table-column prop="arrivalTime" label="达到时间" width="180" align="center" />
            <el-table-column prop="assignee" label="当前处理人" width="120" align="center" />
            <el-table-column prop="currentStep" label="当前环节" width="120" align="center">
              <template #default="scope">
                <span :class="getStepClass(scope.row.currentStep)">{{ scope.row.currentStep }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template #default="scope">
                <el-button link type="primary" @click="handleApprove(scope.row)">审批通过</el-button>
                <el-button link type="danger" @click="handleReject(scope.row)">驳回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="pagination-footer">
          <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.size"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="getList"
            @current-change="getList"
          />
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, shallowRef } from 'vue';
import {
  Menu as IconMenu,
  Memo,
  Tickets,
  Setting
} from '@element-plus/icons-vue';
import { getPendingList } from '@/services/api/problemDatabase'

// --- 类型定义 ---
interface JudgmentItem {
  id: number;
  description: string;
  type: string;
  arrivalTime: string;
  assignee: string;
  currentStep: '审批中' | '已通过';
}

// --- 响应式状态 ---

// 左侧菜单
const activeMenu = ref('judgment');
const menuItems = ref([
  { key: 'judgment', label: '研判', icon: shallowRef(IconMenu) },
  { key: 'evaluation', label: '监督评价', icon: shallowRef(Memo) },
  { key: 'department', label: '部门评价', icon: shallowRef(Tickets) },
]);

// 右侧内容区
const activeTab = ref('todo');
const loading = ref(false);
const total = ref(800); // 模拟总数
const queryParams = reactive({
  keyword: '',
  date: null,
  page: 1,
  size: 10,
});

const tableData = ref<[]>([]);

// --- 方法定义 ---

// 获取问题列表
const getList = async () => {
  loading.value = true;

  try {
    const response = await getPendingList(queryParams);

    if(response.code === 200) {
      tableData.value = response.data.rows;
      total.value = response.data.pageResult.totalCount;
    } else {
      console.error('获取列表失败')
    }

  } catch (e) {
    console.error('请求失败', e)
  } finally {
    loading.value = false
  }

}

const handleMenuClick = (key: string) => {
  activeMenu.value = key;
  // 切换主菜单通常会重置所有筛选条件并重新加载数据
  resetQuery();
};

const handleTabChange = (tabName: string | number) => {
  console.log(`切换到 Tab: ${tabName}`);
  getList();
};

const resetQuery = () => {
  queryParams.keyword = '';
  queryParams.date = null;
  queryParams.page = 1;
  getList();
};

const getStepClass = (step: string) => {
  return step === '审批中' ? 'status-in-progress' : 'status-approved';
};

const viewDetails = (row: JudgmentItem) => console.log('查看详情:', row.id);
const handleApprove = (row: JudgmentItem) => console.log('审批通过:', row.id);
const handleReject = (row: JudgmentItem) => console.log('驳回:', row.id);

onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.judgment-page-container {
  padding: 20px;
  background-color: #f0f2f5;
  height: calc(100vh - 90px); // 假设顶部导航栏高度为90px
}

.side-menu {
  background-color: #fff;
  height: 100%;
  border-radius: 4px;
  padding: 10px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  .el-icon {
    margin-right: 10px;
  }

  &:hover {
    background-color: #ecf5ff;
  }

  &.is-active {
    background-color: #409eff;
    color: #fff;
    font-weight: 600;
  }
}

.el-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep(.el-card__body) {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.filter-inputs {
  display: flex;
  align-items: center;
  gap: 15px;
}

.table-area {
  flex-grow: 1;
  overflow: auto; // 让表格内容超出时内部滚动
}

.pagination-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  flex-shrink: 0;
}

.status-in-progress {
  color: #e6a23c;
}

.status-approved {
  color: #67c23a;
}
</style>
