<template>
  <div class="field-config-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="角色权限" name="role_permission">
        <div>角色权限配置区域</div>
      </el-tab-pane>
      <el-tab-pane label="字段配置" name="field_config">
        <el-card shadow="never">
          <el-input
            v-model="searchKeyword"
            placeholder="名称搜索"
            :prefix-icon="Search"
            clearable
            style="width: 240px; margin-bottom: 20px"
            @change="handleSearch"
          />

          <el-table :data="filteredTableData" v-loading="loading" border style="width: 100%">
            <el-table-column prop="fieldName" label="字段名称" width="180" />
            <el-table-column prop="fieldValues" label="字段值" min-width="300">
              <template #default="scope">
                <div class="tag-group">
                  <el-tag v-for="val in scope.row.fieldValues" :key="val" type="info" class="value-tag">
                    {{ val }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="functionality" label="所属功能" width="120" />
            <el-table-column prop="modifier" label="修改人" width="120" />
            <el-table-column prop="modifiedTime" label="修改时间" width="180" />
            <el-table-column label="操作" width="100" align="center">
              <template #default="scope">
                <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialogVisible" title="编辑" width="500px" @close="handleDialogClose">
      <el-form ref="editFormRef" :model="editForm" label-position="top">
        <el-form-item label="字段名称:">
          <el-input v-model="editForm.fieldName" disabled />
        </el-form-item>
        <el-form-item label="字段格式:" prop="fieldType">
          <el-select v-model="editForm.fieldType" placeholder="请选择" style="width: 100%">
            <el-option label="单选" value="single-select" />
            <el-option label="多选" value="multi-select" />
            <el-option label="文本" value="text" />
          </el-select>
        </el-form-item>
        <el-form-item label="字段值:">
          <div v-for="(item, index) in editForm.fieldValues" :key="item.key" class="dynamic-item">
            <el-input v-model="item.value" placeholder="请输入字段值" />
            <el-button
              link
              type="danger"
              :icon="Delete"
              @click.prevent="removeFieldValue(item)"
              class="delete-btn"
            />
          </div>
          <el-button @click="addFieldValue" :icon="Plus" style="width: 100%; margin-top: 10px;">
            添加字段值
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogCancel">取消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { Search, Edit, Delete, Plus } from '@element-plus/icons-vue';

// --- 类型定义 ---
interface FieldConfigItem {
  id: number;
  fieldName: string;
  fieldValues: string[];
  functionality: string;
  modifier: string;
  modifiedTime: string;
  fieldType: 'single-select' | 'multi-select' | 'text';
}

interface DynamicFieldValue {
  key: number; // 用于 v-for 的 key
  value: string;
}

// --- 主页面状态 ---
const activeTab = ref('field_config');
const searchKeyword = ref('');
const loading = ref(false);
const allTableData = ref<FieldConfigItem[]>([]); // 原始数据

// --- 编辑弹窗状态 ---
const dialogVisible = ref(false);
const editFormRef = ref<FormInstance>();
const editForm = reactive<{
  id: number | null;
  fieldName: string;
  fieldType: string;
  fieldValues: DynamicFieldValue[];
}>({
  id: null,
  fieldName: '',
  fieldType: '',
  fieldValues: [],
});

// --- 计算属性 ---
const filteredTableData = computed(() => {
  if (!searchKeyword.value) {
    return allTableData.value;
  }
  return allTableData.value.filter(item =>
    item.fieldName.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

// --- 方法 ---
const fetchData = () => {
  loading.value = true;
  setTimeout(() => {
    allTableData.value = [
      { id: 1, fieldName: '问题类型', fieldValues: ['组织监督', '民主监督', '制度监督', '信访举报监督', '纪律审查监督', '巡视巡察监督', '日常监督'], functionality: '问题', modifier: '张三', modifiedTime: '2025-01-17 21:02', fieldType: 'single-select' },
      { id: 2, fieldName: '监督类型', fieldValues: ['组织监督', '民主监督', '制度监督', '信访举报监督', '纪律审查监督', '巡视巡察监督', '日常监督'], functionality: '台账', modifier: '张三', modifiedTime: '2025-11-02 18:12', fieldType: 'multi-select' },
    ];
    loading.value = false;
  }, 500);
};

onMounted(() => {
  fetchData();
});

const handleSearch = () => {
  // 如果需要后端搜索，可以在这里调用 API
  console.log('搜索:', searchKeyword.value);
};

// --- 弹窗相关方法 ---
const handleEdit = (row: FieldConfigItem) => {
  // 深拷贝数据到表单，防止直接修改表格数据
  editForm.id = row.id;
  editForm.fieldName = row.fieldName;
  editForm.fieldType = row.fieldType;
  editForm.fieldValues = row.fieldValues.map((value, index) => ({
    key: Date.now() + index, // 生成唯一的 key
    value: value,
  }));
  dialogVisible.value = true;
};

const removeFieldValue = (item: DynamicFieldValue) => {
  const index = editForm.fieldValues.indexOf(item);
  if (index !== -1) {
    editForm.fieldValues.splice(index, 1);
  }
};

const addFieldValue = () => {
  editForm.fieldValues.push({
    key: Date.now(),
    value: '',
  });
};

const handleDialogCancel = () => {
  dialogVisible.value = false;
};

const handleDialogConfirm = () => {
  editFormRef.value?.validate((valid) => {
    if (valid) {
      // 找到原始数据并更新
      const originalIndex = allTableData.value.findIndex(item => item.id === editForm.id);
      if (originalIndex !== -1) {
        const updatedItem = allTableData.value[originalIndex];
        updatedItem.fieldType = editForm.fieldType as any;
        updatedItem.fieldValues = editForm.fieldValues.map(item => item.value);
        updatedItem.modifiedTime = new Date().toLocaleString(); // 更新修改时间
      }
      ElMessage.success('更新成功');
      dialogVisible.value = false;
    }
  });
};

const handleDialogClose = () => {
  // 清理表单数据
  editFormRef.value?.resetFields();
  editForm.id = null;
  editForm.fieldValues = [];
};
</script>

<style scoped lang="scss">
.field-config-container {
  padding: 20px;
}
.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.value-tag {
  margin: 2px 0;
}
.dynamic-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .delete-btn {
    margin-left: 10px;
    font-size: 16px;
  }
}
</style>
