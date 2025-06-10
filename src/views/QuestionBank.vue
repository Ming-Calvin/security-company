<template>
  <div class="question-bank-container">
    <el-card shadow="never">
      <div class="page-header">
        <div class="header-title">
          <el-icon :size="20" color="#409eff"><QuestionFilled /></el-icon>
          <span class="title-text">问题库</span>
        </div>
        <div class="header-actions">
          <el-button type="primary" :icon="Plus">新建</el-button>
          <el-button :icon="Upload">导入</el-button>
          <el-button :icon="Position">批量提交</el-button>
        </div>
      </div>

      <el-divider />

      <div class="filter-container">
        <el-tabs v-model="activeStatus" class="filter-tabs" @tab-change="handleTabChange">
          <el-tab-pane label="全部问题" name="all"></el-tab-pane>
          <el-tab-pane label="未提交" name="1"></el-tab-pane>
          <el-tab-pane label="审核中" name="2"></el-tab-pane>
          <el-tab-pane label="已审慎" name="3"></el-tab-pane>
        </el-tabs>

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
                <el-form-item label="检查部门" prop="inspectionDept">
                  <el-input v-model="queryParams.inspectionDept" placeholder="请输入检查部门" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="被查部门" prop="inspectedDept">
                  <el-input v-model="queryParams.inspectedDept" placeholder="请输入被检查部门" clearable />
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

    </el-card>

    <el-card shadow="never" class="mt-4">
      <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="检查部门" prop="fInspectionDept" align="center" />
        <el-table-column label="被检查部门" prop="fDeptSubjectInspection" align="center" />
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
        <el-table-column label="提出时间" prop="fProposerTime" align="center" width="120">
          <template #default="scope">
            <span>{{ formatDate(scope.row.fProposerTime) }}</span>
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
        <el-table-column label="操作" align="center" width="200" fixed="right">
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
                    <el-dropdown-item @click="handleDelete(scope.row)" style="color: red;">删除</el-dropdown-item>
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
const loading = ref(true);
const total = ref(0);
const tableData = ref<ProblemItem[]>([]);
const activeStatus = ref('all');
const queryFormRef = ref<FormInstance>();
const queryParams = reactive({
  page: 1,
  rows: 10,
  sort: 'ID_',
  order: 'desc',
  status: '',
  keyword: '',
  problemType: '',
  problemSource: '',
  inspectionDept: '',
  inspectedDept: '',
  entryTimeRange: [],
});

// =========== API 调用 (模拟) - 已更新返回结构 ===========
const mockApiRequest = (params: any) => {
  console.log('Fetching data with params:', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端返回的、包含 pageResult 的完整数据结构
      const mockResponse = {
        pageResult: {
          endRow: 10,
          firstPage: true,
          hasNextPage: true,
          hasPrePage: false,
          lastPage: false,
          limit: 10,
          nextPage: 2,
          offset: 0,
          page: 1,
          prePage: 1,
          slider: [1, 2, 3, 4, 5],
          startRow: 1,
          totalCount: 2,
          totalPages: 0
        },
        rows: [ // 这里是你的数据列表
          { fWorkNo: "1", fInspectionDept: "数运部", fDeptSubjectInspection: "数运部", fInspectionItems: 'xxxx', fDiscoverTime: 1749832800000, fProblemDescription: '打工人必看', fProblemType: '组织监督', fIsIllegal: 1, fEntryTime: 1749832800000, fAdviceTime: 1749832800000, fIsCommit: 1, id: "2490000000320023" },
          { fWorkNo: "2", fInspectionDept: "综合部", fDeptSubjectInspection: "综合部", fInspectionItems: 'xxxx', fDiscoverTime: 1749139200000, fProblemDescription: '制度监督', fProblemType: '民主监督', fIsIllegal: 0, fEntryTime: 1749139200000, fAdviceTime: 1749139200000, fIsCommit: 0, id: "2490000000320017" },
          // ... 更多数据
        ],
        // 注意：根级别的 total 字段可能不存在了，我们不再需要它
      };
      resolve(mockResponse);
    }, 500);
  });
};


// =========== getList 函数 - 核心修改点 ===========
/**
 * 获取列表数据
 */
const getList = async () => {
  loading.value = true;
  // 在这里替换成你真实的 axios 请求
  // const response = await yourApi.getList(queryParams);
  const response: any = await mockApiRequest(queryParams);

  // 从 response 中正确地提取数据和总数
  tableData.value = response.rows;
  total.value = response.pageResult.totalCount; // <--- 核心修改在这里

  loading.value = false;
};


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
const handleSubmit = (row: ProblemItem) => {
  console.log('提交研判:', row);
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
});
</script>

<style lang="scss" scoped>
.question-bank-container {
  padding: 20px;
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
  .filter-tabs {
    flex-shrink: 0;
    // 调整 tabs 下方边框，使其与右侧表单区域视觉上更协调
    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
    }
  }

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

</style>
