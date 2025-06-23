<template>
  <div>
    <el-dialog
      title="审批通过"
      :model-value="modelValue"
      @update:model-value="handleClose"
      width="700px"
      @close="resetForm"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-position="top">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="下一处理人" prop="executors">
              <div class="custom-selector">
                <el-tag v-if="formData.executors" closable @close="clearSelection()">
                  {{ formData.executorName }}
                </el-tag>
                <el-button :icon="Plus" circle @click="openDeptSelector()" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审批意见" prop="opinion">
          <el-input v-model="formData.opinion" type="textarea" :rows="4" placeholder="请输入..." />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
      </template>
    </el-dialog>

    <PeopeleSelect
      ref="selectPeopleRef"
      title="选择检查部门"
      :select-user="initialSelectedUsers"
      :multiple="false"
      :fetch-tree-api="getTreeData"
      :fetch-user-list-api="getUserListData"
      @select-people="handleDeptSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

// 人员选择器组件和相关类型/API
import PeopeleSelect from '@/components/PeopeleSelect.vue';
import type { PeopleSelectUserTable, User } from '@/types/base.ts';
import { getTreeList, getUserTable } from '@/api/problemDatabase.ts';

// --- Props & Emits ---
const props = defineProps({
  modelValue: { type: Boolean, required: true },
});
const emit = defineEmits(['update:modelValue', 'confirm']);

// --- 状态 ---
const formRef = ref<FormInstance>();
const loading = ref(false);

// [修改] 新建一个 formData 对象来管理所有表单字段
const formData = reactive({
  executors: '',
  executorName: '',
  opinion: '',
  nodeId: ''
});

// 表单验证规则
const rules = reactive<FormRules>({
  // [修改] 验证规则现在指向 formData.executors
  executors: [{ required: true, message: '请选择下一处理人', trigger: 'change' }],
});

/*------人员选择器相关------*/
const selectPeopleRef = ref<InstanceType<typeof PeopeleSelect> | null>(null);
const initialSelectedUsers = ref([]);

// 获取树形数据
const getTreeData = async (node: any) => {
  const parentId = node.level === 0 ? '0' : node.data.id;

  try {
    const response = await getTreeList({ ID_: parentId });

    const formattedData = response.map((item: any) => ({
      id: item["ID_"],
      orgname: item["NAME_"],
      deptId: item["ID_"],
      leaf: item.isParent === 'false',
    }));

    return formattedData;
  } catch (e) {
    console.error('获取树形失败', e)

    return []
  }
}

// 获取人员列表数据
const getUserListData = async (params: any) => {
  try {
    const response = await getUserTable(params);

    return response
  } catch (e) {
    console.error('获取人员失败', e)

    const emptyTable: PeopleSelectUserTable = {
      records: 0,
      rows: []
    }

    return emptyTable
  }
};

const openDeptSelector = () => {
  selectPeopleRef.value?.init();
};

/**
 * [修改] 部门选择后的处理函数
 */
const handleDeptSelected = (selected: User[]) => {
  if (selected.length > 0) {
    const selectedUser = selected[0]

    const formDataExecutor = {
      id: selectedUser.ID_,
      name: selectedUser.FULLNAME_
    };

    formData.executorName = selectedUser.FULLNAME_;

    formData.executors = formDataExecutor;
  }
};

/**
 * [修改] 清除选择的处理函数
 */
const clearSelection = () => {
  formData.executors = '';
  formData.executorName = '';
};

// --- 弹窗控制与提交 ---

/**
 * [修改] 提交函数
 */
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      emit('confirm', formData);
      handleClose();
    } else {
      ElMessage.error('请填写必填项');
    }
  });
};

const handleClose = () => {
  emit('update:modelValue', false);
};

const handleCancel = () => handleClose();

/**
 * [修改] 重置表单时，也需要清空 formData
 */
const resetForm = () => {
  formRef.value?.resetFields();
  formData.executors = '';
  formData.executorName = '';
  formData.opinion = '';
};

const init = (nodeId:string) => {
  console.log(nodeId, 'nodeId')
  formData.value.nodeId = nodeId
}

// --- 暴露方法给父组件 ---
defineExpose({ init });
</script>

<style scoped>
.custom-selector { display: flex; align-items: center; gap: 8px; }
</style>
