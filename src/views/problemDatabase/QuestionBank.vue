<template>
  <div class="question-bank-container">
    <el-card shadow="never" class="filter-container">
      <div class="action-bar">
        <el-button type="primary" :icon="Plus" @click="handleCreate">新建</el-button>
        <el-button :icon="Upload">导入</el-button>
        <el-button :icon="Position">批量提交</el-button>
        <el-button link type="primary" @click="toggleFilterArea">
          {{ isFilterExpanded ? '收起筛选' : '展开筛选' }}
          <el-icon class="el-icon--right">
            <ArrowUp v-if="isFilterExpanded" />
            <ArrowDown v-else />
          </el-icon>
        </el-button>
      </div>

      <el-tabs v-model="activeStatus" class="filter-tabs" @tab-change="handleTabChange">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.name"
          :label="`${tab.label} (${tab.count})`"
          :name="tab.name"
        ></el-tab-pane>
      </el-tabs>

      <el-collapse-transition>
        <div v-show="isFilterExpanded" class="filter-form-wrapper">

          <div class="filter-form-area">
            <el-form ref="queryFormRef" :model="queryParams" label-width="80px">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="关键字" prop="keyword">
                    <el-input v-model="queryParams.keyword" placeholder="请输入问题关键字" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="问题类型" prop="problemType">
                    <el-select v-model="queryParams.problemType" placeholder="请选择问题类型" clearable style="width: 100%;">
                      <el-option label="组织监督" value="组织监督" />
                      <el-option label="民主监督" value="民主监督" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="问题来源" prop="problemSource">
                    <el-select v-model="queryParams.problemSource" placeholder="请选择问题来源" clearable style="width: 100%;">
                      <el-option label="打工人必看" value="打工人必看" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="检查部门" prop="Q^pw.F_INSPECTION_DEPT^SL">
                    <el-input v-model="queryParams['Q^pw.F_INSPECTION_DEPT^SL']" placeholder="请输入检查部门" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="被查部门" prop="Q^pw.F_DEPT_SUBJECT_INSPECTION^SL">
                    <el-input v-model="queryParams['Q^pw.F_DEPT_SUBJECT_INSPECTION^SL']" placeholder="请输入被检查部门" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="录入时间" prop="Q^pw.F_ENTRY_TIME^DL">
                    <el-date-picker
                      v-model="queryParams.entryTimeRange"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24" class="form-buttons">
                  <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
                  <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
                  <!--                <el-button :icon="Setting" circle class="ml-2" />-->
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </el-collapse-transition>

    </el-card>

    <el-card shadow="never" class="mt-4">
      <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="检查部门" prop="fInspectionDept" align="center" />
        <el-table-column label="被检查部门" prop="fDeptSubjectInspection" align="center" width="120"/>
        <el-table-column label="检查事项" prop="fInspectionItems" align="center" show-overflow-tooltip />
        <el-table-column label="发现问题时点" prop="fDiscoverTime" align="center" width="120">
          <template #default="scope">
            <span>{{ formatDate(scope.row.fDiscoverTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="问题描述" prop="fProblemDescription" align="center" show-overflow-tooltip/>
        <el-table-column label="问题类型" prop="fProblemType" align="center" />
        <el-table-column label="是否涉嫌违规" prop="fIsIllegal" align="center" >
          <template #default="scope">
            <span>{{ scope.row.fIsIllegal === 1 ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="录入时间" prop="fEntryTime" align="center" width="120">
          <template #default="scope">
            <span>{{ formatDate(scope.row.fEntryTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提出时间" prop="fDiscoverTime" align="center" width="120">
          <template #default="scope">
            <span>{{ formatDate(scope.row.fDiscoverTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="建议整改时点" prop="fAdviceTime" align="center" width="120">
          <template #default="scope">
            <span>{{ formatDate(scope.row.fAdviceTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否提交研判" prop="fIsCommit" align="center" >
          <template #default="scope">
            <span>{{ scope.row.fIsCommit === 1 ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="scope">
            <div style="display: flex">
              <el-button link type="primary" @click="handleSubmit(scope.row)">提交研判</el-button>
              <el-dropdown>
                <el-button link type="primary" class="ml-2">
                  更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEdit(scope.row)">编辑</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.status != ''" @click="handleDelete(scope.row)" style="color: red;">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="mt-4 custom-pagination"
        :total="total"
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="getList"
        @current-change="getList"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { FormInstance } from 'element-plus';
import {
  Search, Refresh, Plus, Upload, Position, ArrowDown, QuestionFilled, Setting
} from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
// 查询问题数量
import { getProblemCount, getProblemList } from '@/services/api/problemDatabase'
import type {ProblemCountData, ProblemListParams } from '@/services/api/problemDatabase/types.ts'

// 获取数量
const counts = ref<ProblemCountData>({
  AllCount: 0,
  runningCount: 0,
  noCommitCount: 0,
  endCount: 0,
});

// Tab数据结构
interface Tab {
  label: string;
  name: string;
  count: number;
  apiKey: keyof ProblemCountData;
}

const activeStatus = ref('all');
const tabs = ref<Tab[]>([
  { label: '全部问题', name: 'all', count: 0, apiKey: 'AllCount' },
  { label: '未提交', name: '1', count: 0, apiKey: 'noCommitCount' },
  { label: '审核中', name: '2', count: 0, apiKey: 'runningCount' },
  { label: '已审慎', name: '3', count: 0, apiKey: 'endCount' },
]);

const isFilterExpanded = ref(false)

const toggleFilterArea = () => {
  isFilterExpanded.value = !isFilterExpanded.value;
};

// 获取问题数量
const getProblemCountFun = async () => {
  try {
    const response = await getProblemCount();

    if(response.code === 200) {
      counts.value = response.data;

      tabs.value.forEach(tab => {
        tab.count = counts.value[tab.apiKey];
      })
    } else {
      console.log('获取失败')
    }
  } catch (e) {
    console.log('请求失败', e)
  }
}

// 列表查询参数
const queryParams: ProblemListParams = reactive({
  page: 1,
  rows: 10,
  sort: 'ID_',
  order: 'desc',
  status: '',
  keyword: '',
  problemType: ''
});

const loading = ref(true);
const total = ref(0);
const tableData = ref<ProblemItem[]>([]);

// 获取问题列表
const getList = async () => {
  loading.value = true;

  try {
    const response = await getProblemList(queryParams);

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

// =========== 路由 ===========
const router = useRouter();

// =========== 类型定义 (保持不变) ===========
interface ProblemItem {
  id: string;
  fInspectionDept: string;
  fDeptSubjectInspection: string;
  fInspectionItems: string;
  fDiscoverTime: number; // 时间戳
  fProblemDescription: string;
  fProblemType: string;
  fIsIllegal: 0 | 1;
  fEntryTime: number;
  fProposerTime?: number;
  fAdviceTime: number;
  fIsCommit: 0 | 1;
}

// =========== 响应式状态 (保持不变) ===========

const queryFormRef = ref<FormInstance>();


// =========== 事件处理 (保持不变) ===========
const handleQuery = () => {
  queryParams.page = 1;
  getList();
};
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};
const handleTabChange = (tabName: string | number) => {
  queryParams.status = tabName === 'all' ? '' : String(tabName);
  handleQuery();
};
const handleSelectionChange = (selection: ProblemItem[]) => {
  console.log('Selected rows:', selection);
};
const handleEdit = (row: ProblemItem) => {
  console.log('编辑:', row);
};
const handleDelete = (row: ProblemItem) => {
  console.log('删除:', row);
};

// =========== 工具函数 (保持不变) ===========
const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// =========== 生命周期钩子 (保持不变) ===========
onMounted(() => {
  getList();
  getProblemCountFun();
});

// --- [新增] 事件处理函数 ---

/**
 * @description: 点击“新建”按钮，跳转到问题录入页面
 */
const handleCreate = () => {
  router.push({ name: 'problem-entry' });
};

// 提交研判
const handleSubmit = (row: ProblemItem) => {
  router.push({
    name: 'problem-detail',
    query: { id: row.id }
  });
};

</script>

<style lang="scss" scoped>
.question-bank-container {
  //padding: 20px;
}

// 顶部布局样式
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;

    .title-text {
      margin-left: 8px;
    }
  }
}

// 筛选区域布局样式
.filter-container {
  position: relative;

  .filter-form-area {
    margin-top: 20px;

    .form-buttons {
      display: flex;
      justify-content: flex-end; // 按钮靠右对齐
      margin-top: 10px;
    }
  }
}

// 通用间距
.mt-4 {
  margin-top: 1.5rem;
}
.ml-2 {
  margin-left: 0.5rem;
}

// 分页
.el-pagination.mt-4.custom-pagination {
  float: right;
  margin: 20px;
}

.el-button.is-link {
  padding: 0px;
}

.action-bar {
  text-align: right;
  padding: 16px 20px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
}
</style>
