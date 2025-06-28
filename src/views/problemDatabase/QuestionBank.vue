<template>
  <div>
    <el-card shadow="never" relative>
      <!--   操作栏   -->
      <div class="action-bar">
        <el-button type="primary"
                   :icon="Plus"
                   @click="handleCreate">
          新建
        </el-button>
        <el-button :icon="Upload" @click="importFile">导入</el-button>
        <el-button :icon="Position" @click="bulkSubmit">批量提交</el-button>
        <el-button link type="primary" @click="toggleFilterArea">
          {{ isFilterExpanded ? '收起筛选' : '展开筛选' }}
          <el-icon class="el-icon--right">
            <ArrowUp v-if="isFilterExpanded" />
            <ArrowDown v-else />
          </el-icon>
        </el-button>
      </div>

      <!--  tab页面   -->
      <el-tabs v-model="activeStatus"
               @tab-change="handleTabChange">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.name"
          :label="`${tab.label} (${tab.count})`"
          :name="tab.name"
        ></el-tab-pane>
      </el-tabs>

      <!--  搜索条件  -->
      <el-collapse-transition>
        <div v-show="isFilterExpanded" mt-5>
          <el-form ref="queryFormRef"
                   :model="queryParams"
                   label-width="80px">

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="关键字" prop="keyword">
                  <el-input v-model="queryParams.keyword"
                            placeholder="请输入问题关键字"
                            clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="问题类型" prop="problemType">
                  <el-select v-model="queryParams.problemType"
                             placeholder="请选择问题类型"
                             clearable
                             w-full>
                    <el-option label="组织监督" value="组织监督" />
                    <el-option label="民主监督" value="民主监督" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="问题来源" prop="problemSource">
                  <el-select v-model="queryParams.problemSource"
                             placeholder="请选择问题来源"
                             clearable w-full>
                    <el-option label="打工人必看" value="打工人必看" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="检查部门" prop="Q^pw.F_INSPECTION_DEPT^SL">
                  <el-input v-model="queryParams['Q^pw.F_INSPECTION_DEPT^SL']"
                            placeholder="请输入检查部门"
                            clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="被查部门" prop="Q^pw.F_DEPT_SUBJECT_INSPECTION^SL">
                  <el-input v-model="queryParams['Q^pw.F_DEPT_SUBJECT_INSPECTION^SL']"
                            placeholder="请输入被检查部门"
                            clearable />
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
                    w-full
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <div flex justify-end mt-2 w-full>
                <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
                <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
              </div>
            </el-row>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <el-card shadow="never" mt-4>
    <!--   展示表格   -->
      <el-table v-loading="loading"
                :data="tableData"
                @selection-change="handleSelectionChange">
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
              <el-button link
                         type="primary"
                         v-if="scope.row.status === 'draft'"
                         @click="handleSubmit(scope.row)">
                提交研判
              </el-button>
              <el-button link
                         type="primary"
                         v-if="scope.row.status !== 'draft'"
                         @click="handleDetail(scope.row)">
                详情
              </el-button>
              <el-dropdown v-if="scope.row.status === 'draft'">
                <el-button link type="primary" ml-2>
                  更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEdit(scope.row)">
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleDelete(scope.row)"
                                      style="color: red;">
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
// vue
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// el-plus
import { ElMessage, type FormInstance } from 'element-plus'
import { Search, Refresh, Plus, Upload, Position, ArrowDown } from '@element-plus/icons-vue';

// api
import { getProblemCount, getProblemList, problemWarehouseRemove } from '@/api/problemDatabase.ts'
import type {ProblemCountData, ProblemCountTab, ProblemListParams, ProblemTableItem } from '@/types/problemDatabase.ts'
import { getSuperviseFieldList } from '@/api/systemConfiguration.ts'

// 路由
const router = useRouter();

// =========== 操作栏 ===========
// 新建
const handleCreate = () => {
  router.push({ name: 'problem-entry' });
};
// 导入
const importFile = () => {
  ElMessage.warning('暂不支持导入');

}
// 批量提交
const bulkSubmit = async () => {
  if(selectedProblemItem.value.length === 0) return ElMessage.warning('请选择需要批量体提交的问题')

  try {
    const selectedItemName = selectedProblemItem.value.map(item => {
      return item.fInspectionItems
    }).join()

    await ElMessageBox.confirm(
      `是否批量提交注意事项为“${selectedItemName}”的问题`,
      {
        confirmButtonText: '确定提交',
        cancelButtonText: '取消提交',
        type: 'warning',
      }
    )

    ElMessage.warning('暂不支持批量提交');
  } catch (e) {
    ElMessage.warning('取消批量提交');
    console.error('取消批量提交', e)
  }
}

// =========== Tab栏 ===========
// 数量
const counts = ref<ProblemCountData>({
  AllCount: 0,
  runningCount: 0,
  noCommitCount: 0,
  endCount: 0,
})
const activeStatus = ref('all');
const tabs = ref<ProblemCountTab[]>([
  { label: '全部问题', name: 'all', count: 0, apiKey: 'AllCount' },
  { label: '未提交', name: '1', count: 0, apiKey: 'noCommitCount' },
  { label: '审核中', name: '2', count: 0, apiKey: 'runningCount' },
  { label: '已审慎', name: '3', count: 0, apiKey: 'endCount' },
]);

// tab状态改变
const handleTabChange = (tabName: string | number) => {
  queryParams.status = String(tabName)
  handleQuery();
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

// =========== 搜索条件 ===========
const isFilterExpanded = ref(false)
const toggleFilterArea = () => {
  isFilterExpanded.value = !isFilterExpanded.value;
};

// 获取表单ref
const queryFormRef = ref<FormInstance>();
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

// 搜索
const handleQuery = () => {
  queryParams.page = 1;
  getList();
};
// 重置
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

// 配置字段获取
const getSuperviseField = async (name: string) => {
  try {
    const response = await getSuperviseFieldList({ 'Q^FIELD_NAME^SL': name })

    if(response.code === 200) {
      console.log(response, 'response')
    }
  } catch (e) {
    console.error(`${name}字段获取失败`)
  }
}

// =========== 展示表格 ===========
const loading = ref(true);
const total = ref(0);
const tableData = ref<ProblemTableItem[]>([]);

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

// 时间切换函数
const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 选中行
const selectedProblemItem = ref<ProblemTableItem[]>([])
const handleSelectionChange = (selection: ProblemTableItem[]) => {
  selectedProblemItem.value = selection;
};
// 提交研判
const handleSubmit = (row: ProblemTableItem) => {
  router.push({ name: 'problem-detail', query: { id: row.id, nodeId: 'UserTask1' } });
};
// 详情
const handleDetail = (row: ProblemTableItem) => {
  router.push({ name: 'problem-detail', query: { id: row.id, opera: 'detail' } });
};
// 编辑
const handleEdit = (row: ProblemTableItem) => {
  router.push({ name: 'problem-entry', query: { id: row.id, opera: 'edit' } });
};
// 删除
const handleDelete = async (row: ProblemTableItem) => {
  try {
    await ElMessageBox.confirm(
      `是否删除注意事项为${row.fInspectionItems}的问题`,
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消删除',
        type: 'warning',
      }
    )

    const response = await problemWarehouseRemove(row.id)

    if(response.code === 200) {
      ElMessage.success('删除成功');
      handleQuery()
    } else {
      ElMessage.error('删除失败');
    }
  } catch (e) {
    ElMessage.warning('取消删除');
    console.error(e)
  }
};

// =========== 生命周期钩===========
onMounted(() => {
  getList();
  getProblemCountFun();
  getSuperviseField('字段');
});

</script>

<style lang="scss" scoped>
// 操作栏
.action-bar {
  text-align: right;
  padding: 16px 20px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
}
</style>
