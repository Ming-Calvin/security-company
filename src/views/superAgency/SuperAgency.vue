<template>
  <el-row :gutter="20">
    <el-col :span="3">
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

    <el-col :span="21">
      <el-card shadow="never">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane :label="'待办 (' + pendingTotal + ')'" name="todo"></el-tab-pane>
          <el-tab-pane :label="'已办 (' + handledTotal + ')'" name="done"></el-tab-pane>
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
          <el-table :data="tableData" v-loading="loading" style="width: 100%; height: 500px">
            <el-table-column type="index" label="序号" width="60" align="center" />

            <el-table-column prop="subject" label="问题描述" min-width="250" show-overflow-tooltip/>

            <el-table-column prop="procDefName" label="问题类型" width="150" align="center" />

            <el-table-column prop="createTime" label="达到时间" width="180" align="center">
              <template #default="scope">
                <span>{{ formatTimestamp(scope.row.createTime) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="assigneeName" label="当前处理人" width="120" align="center" />

            <el-table-column prop="name" label="当前环节" width="120" align="center">
              <template #default="scope">
                <span :class="getStepClass(scope.row.status)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template #default="scope">
                <el-button link type="primary" @click="handleApprove(scope.row)">办理</el-button>
                <el-button link type="danger" @click="handleReject(scope.row)">驳回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="pagination-footer">
          <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.rows"
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
import { getPendingList, getHandledList } from '@/services/api/problemDatabase'
import { useRoute, useRouter } from 'vue-router'

// --- 类型定义 ---
interface JudgmentItem {
  id: number;
  description: string;
  type: string;
  arrivalTime: string;
  assignee: string;
  currentStep: '审批中' | '已通过';
}

// 路由
const router = useRouter();

// 左侧菜单
const activeMenu = ref('问题研判');
const menuItems = ref([
  { key: '问题研判', label: '问题研判', icon: shallowRef(IconMenu) },
  { key: '监督台账', label: '监督台账', icon: shallowRef(Memo) },
]);

// 右侧内容区
const activeTab = ref('todo');
const loading = ref(false);
const queryParams = reactive({
  keyword: '',
  date: null,
  page: 1,
  rows: 10,
  'Q^PROC_DEF_NAME_^SL': activeMenu.value
});

// --- 方法定义 ---

const pendingList = ref([])
const handledList = ref([])
const pendingTotal = ref(0)
const handledTotal = ref(0)
const route = useRoute();

const tableData = computed(() => {
  if(activeTab.value == 'todo') {
    return pendingList.value
  } else if (activeTab.value == 'done') {
    return handledList.value
  }
})

const total = computed(() => {
  if(activeTab.value == 'todo') {
    return pendingTotal.value
  } else if (activeTab.value == 'done') {
    return handledTotal.value
  }
})

// 获取问题列表
const getList = async () => {
  loading.value = true;

  try {
    const response = await getPendingList(queryParams);

    if(response.code === 200) {
      pendingList.value = response.data.rows;
      pendingTotal.value = response.data.pageResult.totalCount;
    } else {
      console.error('获取待办列表失败')
    }

  } catch (e) {
    console.error('请求失败', e)
  } finally {
    loading.value = false
  }


  try {
    const response = await getHandledList(queryParams);

    if(response.code === 200) {
      handledList.value = response.data.rows;
      handledTotal.value = response.data.pageResult.totalCount;
    } else {
      console.error('获取已办列表失败')
    }

  } catch (e) {
    console.error('请求失败', e)
  } finally {
    loading.value = false
  }
}

const handleMenuClick = (key: string) => {
  activeMenu.value = key;
  queryParams['Q^PROC_DEF_NAME_^SL'] = key

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

// 办理
const handleApprove = (row: JudgmentItem) => {
  let routeName = ''

  if(activeMenu.value === '问题研判') {
    routeName = 'problem-detail';
  } else if(activeMenu.value === '监督台账') {
    routeName = 'ledger-detail';
  }

  router.push({
    name: routeName,
    query: { procInstId: row.procInstId, taskId: row.id, nodeId: row.nodeId }
  });
}

const handleReject = (row: JudgmentItem) => console.log('驳回:', row.id);

/**
 * 将时间戳格式化为 YYYY-MM-DD HH:mm:ss
 * @param timestamp
 */
const formatTimestamp = (timestamp: number) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  const Y = date.getFullYear();
  const M = (date.getMonth() + 1).toString().padStart(2, '0');
  const D = date.getDate().toString().padStart(2, '0');
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
};

/**
 * 根据环节状态返回不同的 CSS 类名
 * @param status
 */
const getStepClass = (status: string) => {
  if (status === 'NORMAL') {
    return 'status-in-progress';
  }
  // 可以根据需要添加其他状态的样式
  return 'status-default';
};


onMounted(() => {
  if(route.query.activeMenu) {
    handleMenuClick(route.query.activeMenu)
  } else {
    getList();
  }
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
  padding: 10px 0;
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
