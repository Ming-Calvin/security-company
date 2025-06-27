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
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="字段配置" name="field_config">
          <el-card shadow="never">
            <el-input
              v-model="searchKeyword"
              placeholder="字段搜索"
              :prefix-icon="Search"
              clearable
              class="!w-150 mb-4"
            />

            <el-table :data="tableData"
                      v-loading="loading"
                      border
                      style="width: 100%">
              <el-table-column prop="fieldName" label="字段名称" width="180" />
              <el-table-column prop="fieldAlias" label="字段别名" width="120" />
              <el-table-column prop="fieldValue" label="字段值" min-width="300">
                <template #default="scope">
                  <div class="tag-group">
                    <el-tag v-for="(val, index) in parseFieldValue(scope.row.fieldValue)"
                            :key="index"
                            type="info">
                      {{ val.value }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="fieldRange" label="所属功能" width="120" />
              <el-table-column prop="updateTime" label="修改时间" width="180">
                <template #default="scope">
                  {{ formatTimestamp(scope.row.updateTime) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template #default="scope">
                  <el-button link
                             type="primary"
                             @click="handleEdit(scope.row)">
                    编辑
                  </el-button>

                  <el-button link
                             type="primary"
                             disabled
                             @click="handleDelect(scope.row)"
                             style="color: red">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.rows"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getList"
        @current-change="getList"
        class="pagination-footer"
      />
    </el-card>

    <!--   字段弹框   -->
    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="600px"
               @close="handleDialogClose">
      <el-form ref="editFormRef"
               :model="editForm"
               class="editForm"
               :rules="rules"
               label-position="top">

        <el-form-item label="字段名称:" prop="fieldName">
          <el-input v-model="editForm.fieldName"
                    :disabled="editForm.id !== ''"
                    placeholder="请输入字段名称"/>
        </el-form-item>

        <el-form-item label="字段别名" prop="fieldAlias">
          <el-input v-model="editForm.fieldAlias"
                    :disabled="editForm.id !== ''"
                    placeholder="请输入字段别名" />
        </el-form-item>

        <el-form-item label="所属功能" prop="fieldRange">
          <el-input v-model="editForm.fieldRange"
                    placeholder="请输入所属功能"/>
        </el-form-item>

        <el-form-item label="字段格式:" prop="fieldType">
          <el-select v-model="editForm.fieldType"
                     placeholder="请选择字段格式">
            <el-option label="单选" value="单选" />
            <el-option label="多选" value="多选" />
          </el-select>
        </el-form-item>

        <el-form-item label="字段值:" prop="fieldValue">

          <div class="fieldValue-list">
            <div v-for="(item, index) in fieldValueList"
                 :key="index"
                 class="fieldItem">
              <el-input v-model="item.value"
                        placeholder="请输入字段值"
                        maxlength="50"
              />

              <el-button link
                         type="danger"
                         :icon="Delete"
                         :disabled="!item.allowEdit"
                         @click.prevent="removeFieldValue(item)"
                         class="delete-btn" />
            </div>
          </div>

          <el-button @click="addFieldValue" :icon="Plus" style="width: 100%; margin-top: 10px;">
            添加字段值
          </el-button>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// vue
import { ref, reactive, onMounted, watch } from 'vue'

// el-plus
import { ElMessage, type FormRules } from 'element-plus'
import type { FormInstance } from 'element-plus';
import { Search, Delete, Plus } from '@element-plus/icons-vue'

// api
import type { FieldQueryParameters, FieldValueItem, SuperviseField } from '@/types/systemSetting.ts'
import {
  saveSuperviseField,
  superviseFieldList,
  superviseFieldRemove
} from '@/api/systemSetting.ts'

// utils
import { deepClone } from '@/utils'

// =========== 操作栏 ===========
const handleCreate = () => {
  dialogVisible.value = true
  dialogTitle.value = '新建字段'

  Object.assign(editForm, getInitialFormState());
  fieldValueList.value = []

  // 清除校验数据
  nextTick(() => {
    editFormRef.value?.clearValidate();
  });
}

// =========== 弹窗 ===========
const dialogVisible = ref(false);
const dialogTitle = ref('')
const editFormRef = ref<FormInstance>();
// 初始化数据
const getInitialFormState = (): SuperviseField => ({
  id: '',
  fieldAlias: '',
  fieldName: '',
  fieldRange: '',
  fieldType: '',
  fieldValue: '',
});
const editForm = reactive<SuperviseField>(getInitialFormState())
const rules = reactive<FormRules>({
  fieldAlias: [
    { required: true, message: '请输入字段别名', trigger: 'blur' }
  ],
  fieldName: [
    { required: true, message: '请输入字段名称', trigger: 'blur' }
  ],
  fieldRange: [
    { required: true, message: '请选择所属功能', trigger: 'blur' }
  ],
  fieldType: [
    { required: true, message: '请选择字段格式', trigger: 'blur' }
  ],
  fieldValue: [
    { required: true, message: '请输入字段值', trigger: 'blur' }
  ]
})

const fieldValueList = ref<FieldValueItem[]>([])

// 弹窗关闭
const handleDialogClose = () => {
  // 清理表单数据
  editFormRef.value?.resetFields();
  dialogVisible.value = false;
  fieldValueList.value = []
};
// 编辑
const handleEdit = (row: FieldValueItem) => {
  dialogVisible.value = true;
  dialogTitle.value = '更新字段'

  Object.assign(editForm, deepClone(row))
  fieldValueList.value = parseFieldValue(row.fieldValue)
};
const handleDelect = async (row: SuperviseField) => {
  try {
    await ElMessageBox.confirm(
      `是否删除字段名称为${row.fieldName}的问题`,
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消删除',
        type: 'warning',
      }
    )

    const response = await superviseFieldRemove(row.id)

    if(response.code === 200) {
      ElMessage.success('删除成功');
      getList()
    } else {
      ElMessage.error('删除失败');
    }
  } catch (e) {
    ElMessage.warning('取消删除');
    console.error(e)
  }
}

// 添加字段值
const addFieldValue = () => {
  fieldValueList.value.push({
    value: '',
    allowEdit: true,
  })
};
// 删除字段值
const removeFieldValue = (removeItem: SuperviseField) => {
  const indexToDelete = fieldValueList.value.findIndex(currentItem => currentItem === removeItem);

  if (indexToDelete !== -1) {
    fieldValueList.value.splice(indexToDelete, 1);
  }
};

// 监听字段值列表
watch(fieldValueList, () => updateFieldValue(), { deep: true });
const updateFieldValue = () => {
  const fieldValue:FieldValueItem[] = fieldValueList.value.filter(item => item.value).map(item => ({...item, allowEdit: false}))
  editForm.fieldValue = fieldValue.length > 0 ? JSON.stringify(fieldValue) : ''
}

// 弹框确认提交
const handleDialogConfirm = () => {
  editFormRef.value?.validate(async (valid) => {
    if (valid) {
      // 弹框提示
      await ElMessageBox.confirm(
        `您确定要${dialogTitle.value}字段吗？`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      );

      try {
        const response = await saveSuperviseField(editForm);

        if (response.success) {
          ElMessage.success(`${dialogTitle.value}成功`);
          handleDialogClose()
          getList()
        } else {
          ElMessage.error(`${dialogTitle.value}失败`);
        }
      } catch (error) {
        ElMessage.error('请求失败，请检查网络');
        console.error(error);
      } finally {
        loading.value = false;
      }
    }
  });
};

// =========== 列表 ===========
const activeTab = ref('field_config');
const searchKeyword = ref('');
const loading = ref(false);
const tableData = ref<SuperviseField[]>([]);
const total = ref(0)

// 时间转换函数
const formatTimestamp = (timestamp: number) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 字段值转换函数
const parseFieldValue = (filedValueJson: string) => {
  if(!filedValueJson) return []

  try {
    const parsed = JSON.parse(filedValueJson)

    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error(e)
    return []
  }
}

// 搜索
// const handleSearch = () => {
//   console.log('搜索:', searchKeyword.value);
// };

const queryParams = ref<FieldQueryParameters>({
  page: 1,
  rows: 10
})

// 获取问题列表
const getList = async () => {
  loading.value = true;

  try {
    const response = await superviseFieldList(queryParams.value);

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

onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.action-bar {
  text-align: right;
  padding: 16px 20px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.editForm {
  height: 350px;
  overflow: auto;
}

.fieldValue-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .fieldItem {
    width: 50%;
    margin-bottom: 10px;
    display: flex;

    .delete-btn {
      margin: 0 10px;
      font-size: 18px;
    }
  }
}

.pagination-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  flex-shrink: 0;
}
</style>
