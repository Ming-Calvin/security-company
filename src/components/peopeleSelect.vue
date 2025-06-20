<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    append-to-body
    width="1200px"
    top="50px"
    @close="cencal"
  >
    <div v-loading="loading" class="selectBox">
      <div class="treeListBox">
        <div class="tabBox">
          <div class="tagName">本单位</div>
        </div>
        <div class="treebox">
          <el-tree
            ref="treeRef"
            :props="treeName"
            :load="loadTreeNode"
            node-key="id"
            lazy
            highlight-current
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          />
        </div>
      </div>
      <div class="tableListBox">
        <div class="searchbox">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入姓名"
            clearable
            style="width: 300px"
            @keyup.enter="doSearch"
          />
          <el-button
            type="primary"
            :icon="Search"
            @click="doSearch"
            class="search-button"
          >查询</el-button
          >
        </div>
        <div class="table-container">
          <div class="peopleTable">
            <el-table
              ref="userTableRef"
              :data="tableData"
              height="340px"
              highlight-current-row
              @selection-change="handleSelectionChange"
              @row-click="handleRowClick"
            >
              <el-table-column width="55" align="center">
                <template #default="scope">
                  <el-radio
                    :value="scope.row.ID_"
                    v-model="selectedId"
                    @change="handleRadioChange(scope.row)"
                  >&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column v-if="multiple" type="selection" width="55" />
              <el-table-column :prop="tableName.name" label="姓名" align="center" />
              <el-table-column
                :prop="tableName.dept"
                label="部门/中心"
                align="center"
                show-overflow-tooltip
              />
            </el-table>
          </div>
          <div class="selectPeopleTable">
            <el-table :data="selectedPeople" height="340px">
              <el-table-column :prop="tableName.name" label="已选" align="center" />
              <el-table-column width="50" align="center">
                <template #header>
                  <el-button link type="danger" :icon="Delete" @click="clearAllSelected" />
                </template>
                <template #default="scope">
                  <el-button link type="danger" :icon="Delete" @click="removeSelected(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.size"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getList"
          @current-change="getList"
          class="pagination-footer"
        />
      </div>
    </div>
    <template #footer>
      <el-button size="small" @click="cencal">取消</el-button>
      <el-button size="small" type="primary" @click="doOk">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue';
import { Search, Delete } from '@element-plus/icons-vue';
import type { ElTree, ElTable } from 'element-plus';
import { ElMessage } from 'element-plus';

// --- 类型定义 ---
interface User {
  hrId: string;
  ID_: string;
  fullname: string;
  orgname: string;
  [key: string]: any; // 允许其他属性
}

interface TreeNode {
  id: string;
  deptId: string;
  orgname: string;
  children?: TreeNode[];
}

// --- Props & Emits ---
const props = defineProps({
  title: { type: String, default: "人员选择器" },
  treeName: { type: Object, default: () => ({ children: "children", label: "orgname" }) },
  tableName: { type: Object, default: () => ({ name: "FULLNAME_", dept: "PARENT_CODE_NAME" }) },
  selectUser: { type: Array as () => User[], default: () => [] },
  multiple: { type: Boolean, default: false },
  fetchTreeApi: { type: Function, required: true },
  fetchUserListApi: { type: Function, required: true },
});

const emit = defineEmits(['select-people', 'cencal']);

// --- 响应式状态 ---
const dialogVisible = ref(false);
const loading = ref(false);
const tableData = ref<User[]>([]);
const total = ref(0);
const selectedPeople = ref<User[]>([]);
const singleSelectionId = ref(''); // 用于单选模式

// 选中ID
const selectedId = ref('')

const queryParams = reactive({
  page: 1,
  size: 10,
  name: "",
  deptId: "",
});

const userTableRef = ref<InstanceType<typeof ElTable>>();

// --- 核心方法 ---
const getList = async () => {
  loading.value = true;
  try {
    const response = await props.fetchUserListApi(queryParams);
    tableData.value = response.rows || [];

    total.value = response.records || 0;
    updateTableSelection();
  } catch (error) {
    ElMessage.error("加载人员列表失败");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const loadTreeNode = async (node: any, resolve: (data: TreeNode[]) => void) => {
  try {
    const response = await props.fetchTreeApi(node);
    resolve(response);
  } catch (error) {
    ElMessage.error("加载组织树失败");
    console.error(error);
    resolve([]);
  }
};

// --- 事件处理 ---
const handleNodeClick = (data: TreeNode) => {
  queryParams.deptId = data.deptId;
  queryParams.page = 1;
  getList();
};

const doSearch = () => {
  queryParams.page = 1;
  getList();
};

const handleRowClick = (row: User) => {
  // if (props.multiple) {
  //   userTableRef.value?.toggleRowSelection(row, undefined);
  // } else {
  //   singleSelectionId.value = row.hrId;
  //   selectedPeople.value = [row];
  // }
};

const handleRadioChange = (row: User) => {
  selectedPeople.value = [row];
}

const handleSelectionChange = (selection: User[]) => {
  const currentTableIds = new Set(props.tableData.map((u: User) => u.hrId));
  const newSelectionIds = new Set(selection.map(u => u.hrId));

  // 移除在当前页但未被勾选的人员
  const newSelectedPeople = selectedPeople.value.filter(sp =>
    !currentTableIds.has(sp.hrId) || newSelectionIds.has(sp.hrId)
  );

  // 添加新勾选的人员
  selection.forEach(user => {
    if (!newSelectedPeople.some(sp => sp.hrId === user.hrId)) {
      newSelectedPeople.push(user);
    }
  });

  selectedPeople.value = newSelectedPeople;
};

const removeSelected = (userToRemove: User) => {
  const index = selectedPeople.value.findIndex(p => p.hrId === userToRemove.hrId);
  if (index !== -1) {
    selectedPeople.value.splice(index, 1);
  }
};

const clearAllSelected = () => {
  selectedPeople.value = [];
};

watch(selectedPeople, () => updateTableSelection(), { deep: true });

const updateTableSelection = () => {
  nextTick(() => {
    if(props.multiple) {
      const selectedIds = new Set(selectedPeople.value.map(p => p.hrId));
      tableData.value.forEach(row => {
        userTableRef.value?.toggleRowSelection(row, selectedIds.has(row.hrId));
      });
    } else {
      singleSelectionId.value = selectedPeople.value[0]?.hrId || '';
    }
  });
};

const doOk = () => {
  emit("select-people", [...selectedPeople.value]);

  dialogVisible.value = false;
};

const cencal = () => {
  dialogVisible.value = false;
  emit("cencal");
};

const init = () => {
  // 从 props 初始化已选人员
  selectedPeople.value = [...props.selectUser];
  // 重置查询条件并获取第一页数据
  Object.assign(queryParams, { page: 1, size: 10, name: "", deptId: "" });
  getList();
  selectedId.value = ''
  dialogVisible.value = true;
};

// --- 暴露方法给父组件 ---
defineExpose({ init });
</script>

<style scoped lang="scss">
.selectBox {
  height: 450px; display: flex; flex-direction: row; justify-content: space-between; padding: 0 40px;
}
.treeListBox {
  height: 425px; width: 300px; border: 1px solid #dcdfe6; border-radius: 4px;
}
.treebox {
  height: calc(100% - 45px); overflow: auto; padding: 5px;
}
.tabBox .tagName {
  padding: 10px; font-weight: 600;
}
.tableListBox {
  width: calc(100% - 320px); height: 450px;
}
.searchbox {
  display: flex; align-items: center; padding-bottom: 10px;
}
.search-button { margin-left: 10px; }
.table-container { display: flex; gap: 10px; }
.peopleTable { flex: 1; }
.selectPeopleTable { width: 250px; }
.pagination-footer { margin-top: 15px; }
</style>
