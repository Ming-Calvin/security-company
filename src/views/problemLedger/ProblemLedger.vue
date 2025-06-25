<template>
  <el-row :gutter="20">
    <el-col :span="3">
      <div class="left-menu-container">
        <div class="menu-title">常用台账</div>
        <ul class="menu-list">
          <li
            v-for="item in accessibleMenuItems"
            :key="item.title"
            class="menu-item"
            :class="{ 'is-active': activeMenu === item.title }"
            @click="handleMenuClick(item.title)"
          >
            <el-icon> <Menu /> </el-icon>
            <span>{{ item.title }}</span>
          </li>
        </ul>
      </div>
    </el-col>

    <el-col :span="21">
      <el-card shadow="never" class="main-content-card">
        <div class="action-bar">
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建台账</el-button>
          <el-button>取消记录监督</el-button>
          <el-button>加入集团台账</el-button>
          <el-button link type="primary" @click="toggleFilterArea">
            {{ isFilterExpanded ? '收起筛选' : '展开筛选' }}
            <el-icon class="el-icon--right">
              <ArrowUp v-if="isFilterExpanded" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
        </div>

        <div class="content-header">
          <el-tabs v-model="activeSubTab" class="sub-tabs" @tab-change="handleSubTabChange">
            <el-tab-pane
              v-for="tab in subTabs"
              :key="tab.name"
              :label="`${tab.label} (${tab.count})`"
              :name="tab.name"
            ></el-tab-pane>
          </el-tabs>
        </div>

        <el-collapse-transition>
          <div v-show="isFilterExpanded" class="filter-form-wrapper">
            <div class="filter-form-area">
              <el-form ref="queryFormRef" :model="queryParams" label-width="80px">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="监督事项" prop="fSuperviseItems">
                      <el-input v-model="queryParams.fSuperviseItems" placeholder="监督事项搜索" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="监督类型" prop="fSuperviseType">
                      <el-select v-model="queryParams.fSuperviseType" placeholder="请选择监督类型" clearable style="width: 100%;">
                        <el-option label="组织监督" value="组织监督" />
                        <el-option label="民主监督" value="民主监督" />
                        <el-option label="制度监督" value="制度监督" />
                        <el-option label="信访举报监督" value="信访举报监督" />
                        <el-option label="纪律审查监督" value="纪律审查监督" />
                        <el-option label="巡视巡察监督" value="巡视巡察监督" />
                        <el-option label="日常监督" value="日常监督" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="监督来源" prop="fSuperviseSource">
                      <el-select v-model="queryParams.fSuperviseSource" placeholder="请选择监督来源" clearable style="width: 100%;">
                        <el-option label="集团党组监督" value="集团党组监督" />
                        <el-option label="集团纪检监察组监督" value="集团纪检监察组监督" />
                        <el-option label="巡视监督" value="巡视监督" />
                        <el-option label="审计监督" value="审计监督" />
                        <el-option label="党员民主监督" value="党员民主监督" />
                        <el-option label="职工群众监督反映" value="职工群众监督反映" />
                        <el-option label="常态化监督" value="常态化监督" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="责任部门" prop="fRectifyDept">
                      <el-input v-model="queryParams.fRectifyDept" placeholder="请输入责任部门" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="监督部门" prop="fSuperviseDept">
                      <el-input v-model="queryParams.fSuperviseDept" placeholder="请输入监督部门" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="录入时间" prop="entryTimeRange">
                      <el-date-picker
                        v-model="queryParams.entryTimeRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="YYYY-MM-DD"
                        style="width: 100%;"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24" class="form-buttons">
                    <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
                    <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
                    <el-button :icon="Setting" circle class="ml-2" />
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </el-collapse-transition>
      </el-card>

      <el-card shadow="never">
        <div class="table-page-container">
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%; height: 500px"
            border
            :row-key="row => row.id"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" fixed="left" />
            <el-table-column type="index" label="序号" width="60" align="center" fixed="left" />

            <el-table-column label="基础信息" align="center">
              <el-table-column prop="fWorkNo" label="监督事项" width="120" align="center" show-overflow-tooltip/>
              <el-table-column prop="fProblemDescription" label="事项内容" width="120" align="center" show-overflow-tooltip />
              <el-table-column prop="fConnectionBook" label="关联事项" width="120" align="center" />
              <el-table-column prop="fSuperviseType" label="监督类型" width="100" align="center" />
              <el-table-column prop="fSuperviseSource" label="监督来源" width="100" align="center" />
              <el-table-column prop="fProposer" label="提出人" width="100" align="center" />
              <el-table-column prop="fRectifyUser" label="整改责任人" width="120" align="center" />
              <el-table-column prop="fRectifyDept" label="整改责任部门" width="120" align="center" />
              <el-table-column prop="fSuperviseDept" label="监督责任部门" width="120" align="center" />
              <el-table-column prop="fSuperviseUser" label="监督责任人" width="120" align="center" />
            </el-table-column>

            <el-table-column label="整改情况" align="center">
              <el-table-column prop="fRectifyPlantime" label="整改时限" width="120" align="center">
                <template #default="scope">{{ formatTimestamp(scope.row.fRectifyPlantime) }}</template>
              </el-table-column>
              <el-table-column prop="fRectifyMeasure" label="整改举措" width="120" align="center" show-overflow-tooltip />
              <el-table-column prop="fRectifyStarttime" label="整改启动时间" width="120" align="center">
                <template #default="scope">{{ formatTimestamp(scope.row.fRectifyStarttime) }}</template>
              </el-table-column>
              <el-table-column prop="fRectifyEndtime" label="整改完成时间" width="120" align="center">
                <template #default="scope">{{ formatTimestamp(scope.row.fRectifyEndtime) }}</template>
              </el-table-column>
              <el-table-column prop="fRectifyStatus" label="整改状态" width="100" align="center">
                <template #default="scope">
                <span :class="getStatusClass(scope.row.fRectifyStatus)">
                  {{ formatRectifyStatus(scope.row.fRectifyStatus) }}
                </span>
                </template>
              </el-table-column>
              <el-table-column prop="fRectifyResult" label="当前整改进展" width="150" align="center" show-overflow-tooltip />
              <el-table-column prop="fRectifyUpdatetime" label="更新时间" width="120" align="center">
                <template #default="scope">{{ formatTimestamp(scope.row.fRectifyUpdatetime) }}</template>
              </el-table-column>
              <el-table-column prop="fRectifyResult" label="整改成效" width="120" align="center" show-overflow-tooltip />
            </el-table-column>

            <el-table-column label="监督评价" align="center">
              <el-table-column prop="fSuperviseEvaluation_placeholder" label="监督评价" width="120" />
              <el-table-column prop="fOverallScore" label="监督评分" width="120" />
              <el-table-column prop="fEvalDate_placeholder" label="评价时间" width="120" />
            </el-table-column>
            <el-table-column label="纪委监督评价" align="center">
              <el-table-column prop="fOverallScore" label="监督评分" width="120" />
              <el-table-column prop="fDisciplineEval_placeholder" label="监督评价" width="120" />
              <el-table-column prop="fDisciplineEvalDate_placeholder" label="评价时间" width="120" />
            </el-table-column>
            <el-table-column label="统计分析" align="center">
              <el-table-column prop="fRectifyTotalDuration" label="整改耗时" width="120" />
              <el-table-column prop="fOverallEvaluation_placeholder" label="总体评价" width="120" />
            </el-table-column>

            <el-table-column label="操作" width="100" align="center" fixed="right">
              <template #default="scope">
                <el-button link type="primary" @click="handleAction(scope.row)">追踪进展</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--  分页    -->
          <el-pagination
            class="pagination"
            :total="total"
            float-right m-4
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.rows"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            @size-change="getList"
            @current-change="getList"
          />
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance } from 'element-plus';
import { Plus, Upload, Position, Menu, Setting, ArrowDown } from '@element-plus/icons-vue'
import { getRectificationList } from '@/api/problemLedger.ts'
import { useRouter } from 'vue-router'

const router = useRouter();

// 总数
const total = ref(0);

// --- 左侧菜单状态 ---
interface SystemLedger {
  key: string; // 添加一个唯一的key，用于v-for和查找
  title: string;
  total?: number; // 统计数据设为可选，因为它们是动态获取的
  completed?: number;
  pending?: number;
  overdue?: number;
  roles: string[]; // [核心] 定义可以访问此台账的角色
}

const allMenuItems: SystemLedger[] = [
  {
    key: 'first-responsibility',
    title: '第一责任监督台账',
    roles: ['boos'], // 只有“一把手”能看
  },
  {
    key: 'dual-responsibility',
    title: '一岗双责监督台账',
    roles: ['dwsj'], // 只有“党委书记”能看
  },
  {
    key: 'discipline-secretary',
    title: '纪委书记专责监督台账',
    roles: ['jwsj'], // 只有“纪委书记”能看
  },
  {
    key: 'discipline-rereview',
    title: '纪委办再监督台账',
    roles: ['jwb'], // 只有“纪委办”能看
  },
  {
    key: 'functional-dept',
    title: '职能部门监督台账',
    roles: ['znbm'], // 只有“职能部门”能看
  },
  {
    key: 'business-dept',
    title: '业务部门监督台账',
    roles: ['znbm', 'ywb'], // “职能部门”和“业务部门”都能看
  },
  {
    key: 'overview',
    title: '台账总览',
    // “一把手”, “党委书记”, “纪委书记”, “纪委办” 能看
    roles: ['boos', 'dwsj', 'jwsj', 'jwb'],
  },
];

import { useUserStore } from '@/stores/modules/user.ts';

const userStore = useUserStore();
const { roles: userRoles } = storeToRefs(userStore);

// --- 状态 ---
const activeMenu = ref(''); // 默认选中的菜单项 key

// --- 3. [核心] 创建一个新的计算属性来动态过滤【左侧菜单】 ---
const accessibleMenuItems = computed(() => {
  const currentUserRoles = userRoles.value;

  return allMenuItems.filter(menuItem => {
    // 特殊规则：如果用户的角色数组中包含 'jwsj' 或 'jwb'
    if (currentUserRoles.includes('jwsj') || currentUserRoles.includes('jwb')) {
      return true;
    }

    // 常规规则：检查用户的角色和菜单所需的角色是否有交集
    // some() 方法需要在一个真实的数组上调用
    return currentUserRoles.some(userRole => menuItem.roles.includes(userRole));
  });
});


// --- 右侧内容状态 ---
const activeSubTab = ref('all');
const subTabs = ref([
  { label: '台账总数', name: 'all', count: 40 },
  { label: '未完结', name: 'pending', count: 12 },
  { label: '已完结', name: 'completed', count: 28 },
  { label: '整改超时', name: 'overdue', count: 0 },
]);

const queryFormRef = ref<FormInstance>();
const queryParams = reactive({
  page: 1,
  rows: 10,
  sort: 'ID_',
  order: 'desc',
  status: '',

  fSuperviseItems: '', // "监督事项"
  fSuperviseType: '', // "监督类型"
  fSuperviseSource: '', // "监督来源"
  fRectifyDept: '', // "责任部门"
  fSuperviseDept: '', // "监督部门"
  entryTimeRange: [], // 开始时间，结束时间
});

const isFilterExpanded = ref(false)

const toggleFilterArea = () => {
  isFilterExpanded.value = !isFilterExpanded.value;
};

// --- 事件处理函数 (目前为占位符) ---
const handleMenuClick = (menuKey: string) => {
  activeMenu.value = menuKey;
  getList();
};

const handleSubTabChange = (tabName: string | number) => {
  console.log(`切换到内部 Tab: ${tabName}`);
  // 在这里触发右侧内容的重新加载
  // e.g., queryParams.status = tabName; getList();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
};

const loading = ref(false);
const tableData = ref<ProblemItem[]>([]);

// 获取问题列表
const getList = async () => {
  loading.value = true;

  try {
    const response = await getRectificationList(queryParams);

    if(response.code === 200) {
      tableData.value = response.data.rows;
      total.value = response.data.total;
    } else {
      console.error('获取列表失败')
    }

  } catch (e) {
    console.error('请求失败', e)
  } finally {
    loading.value = false
  }

}

/**
 * 将时间戳格式化为 YYYY-MM-DD
 * @param timestamp - 时间戳数字
 */
const formatTimestamp = (timestamp: number) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 将整改状态码格式化为文本
 * @param status - 状态码数字
 */
const formatRectifyStatus = (status: number) => {
  // 这个映射关系你需要根据你的业务来定义
  const statusMap: { [key: number]: string } = {
    1: '整改中',
    2: '已完结',
    3: '已超期',
  };
  return statusMap[status] || '未知状态';
};

/**
 * 根据状态返回不同的 CSS 类名
 * @param status - 状态码数字
 */
const getStatusClass = (status: number) => {
  const classMap: { [key: number]: string } = {
    1: 'status-inprogress',
    2: 'status-completed',
    3: 'status-overdue',
  };
  return classMap[status] || '';
};

const handleSelectionChange = (selection: ProblemItem[]) => { console.log(selection); };
const viewDetails = (row: ProblemItem) => { console.log('查看:', row.id); };

// 追踪进展
const handleAction = (row: ProblemItem) => {
  router.push({ name: 'ledger-detail', query: { id: row.id } });
};

const handleCreate = () => {
  router.push({ name: 'ledger-entry' });
};

const route = useRoute()

onMounted(() => {
  getList();

  activeMenu.value = route.query.ledger || 'overview'
});
</script>

<style scoped lang="scss">
.ledger-page-container {
  padding: 20px;
  background-color: #f0f2f5; // 页面背景色
}

.left-menu-container {
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 0;
  height: calc(100vh - 120px); // 估算高度

  .menu-title {
    font-size: 16px;
    font-weight: 600;
    padding: 10px 20px;
    margin-bottom: 10px;
  }

  .menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f5f7fa;
    }

    &.is-active {
      background-color: #409eff;
      color: #fff;
      font-weight: 600;
    }
  }
}

.main-content-card {
  height: auto;
  margin-bottom: 20px;
}

.action-bar {
  text-align: right;
  padding: 16px 20px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
}

.content-header {
  padding: 0 20px;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-top: 10px;
}

.el-form--inline .el-form-item {
  margin-right: 15px;
}

.table-placeholder {
  padding: 20px;
  text-align: center;
  color: #909399;
}

.filter-form-area {
  border-radius: 4px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end; /* 让按钮靠右对齐 */
  margin-top: 20px; /* 与上面的筛选条件拉开一些间距 */
}

.ml-2 {
  margin-left: 8px;
}

.table-page-container {
  padding: 0px;
}
.el-table {
  --el-table-header-bg-color: #f5f7fa;
  --el-table-header-text-color: #606266;
}

// 定义不同状态的颜色
.status-normal {
  color: #67c23a; // 绿色
}
.status-problem {
  color: #f56c6c; // 红色
}
.status-stalled {
  color: #e6a23c; // 橙色
}
</style>
