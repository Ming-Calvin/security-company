<template>
  <el-form ref="formRef"
           :model="formData"
           :rules="rules"
           label-position="top">

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="整改责任部门" prop="fRectifyDept">
          <el-tag v-if="formData.fRectifyDept"
                  closable
                  mr-2
                  @close="formData.fRectifyDept = ''">
            {{ formData.fRectifyDept }}
          </el-tag>
          <el-button :icon="Plus"
                     circle
                     v-if="!formData.fRectifyDept"
                     @click="openDeptSelector('fRectifyDept', 'fRectifyDeptId')" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="监督责任部门" prop="fDeptSubjectInspection">
          <el-tag v-if="formData.fDeptSubjectInspection"
                  closable
                  mr-2
                  @close="formData.fDeptSubjectInspection = ''">
            {{ formData.fDeptSubjectInspection }}
          </el-tag>
          <el-button :icon="Plus"
                     circle
                     v-if="!formData.fDeptSubjectInspection"
                     @click="openDeptSelector('fDeptSubjectInspection', 'fDeptSubjectInspectionId')" />
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>

  <PeopleSelect
    ref="selectDeptRef"
    title="选择检查部门"
    :select-user="initialSelectedUsers"
    :multiple="false"
    :tableName="tableName"
    :fetch-tree-api="getTreeData"
    :fetch-user-list-api="getUserListData"
    @select-people="handleDeptSelected"
  />
</template>

<script setup lang="ts">
// Vue
import { ref, reactive } from 'vue'

// el-plus
import { type FormInstance, type FormRules } from 'element-plus'
import type { TreeNode } from 'element-plus/es/components/tree/src/tree.type';
import { Plus } from '@element-plus/icons-vue';

// 人员选择器
import PeopleSelect from '@/components/PeopleSelect.vue';
import type {
  PeopleSelectDeptParams,
  PeopleSelectTreeResult,
  PeopleSelectUserTable,
} from '@/types/base.ts'

// api
import { getTreeList, getOrgTable } from '@/api/problemDatabase.ts'

// =========== 表单 ===========
const formRef = ref<FormInstance>();

// 表单数据
const formData = reactive<any>({
  fRectifyDept: '',
  fDeptSubjectInspection: ''
});

// 表单验证规则
const rules = reactive<FormRules>({
  fRectifyDept: [{ required: true, message: '请选择整改责任部门', trigger: 'change' }],
  fDeptSubjectInspection: [{ required: true, message: '请选择监督责任部门', trigger: 'change' }],
});

// 提交方法
const validate = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate();

  } catch (error) {
    console.error('提交过程中发生错误:', error);

    throw error;
  }
};

const submit = () => {}

// =========== 人员选择器 ===========
// InstanceType -- 获取 defineExpose 暴露的方法
const selectDeptRef = ref<InstanceType<typeof PeopleSelect> | null>(null);

// 表格展示参数
const tableName = ref({
  name: "NAME_",
  dept: "PATH_NAME_"
})

type FormFieldMapping = {
  nameField: keyof typeof formData;
  idField: keyof typeof formData;
};

// 存储当前打开人员选择器的字段
const currentTargetProp = ref<FormFieldMapping | null>(null)
// 已选人员
const initialSelectedUsers = ref([])

// 获取树形数据
const getTreeData = async (node: TreeNode) => {
  const parentId = node.level === 0 ? '0' : node.data.id;

  try {
    const response = await getTreeList({ ID_: parentId });

    const formattedData = response.map((item: PeopleSelectTreeResult) => ({
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
const getUserListData = async (params: PeopleSelectDeptParams) => {
  try {
    const response = await getOrgTable(params);

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

// 打开部门选择器
const openDeptSelector = (nameField: keyof typeof formData, idField: keyof typeof formData) => {
  selectDeptRef.value?.init();

  // 记录下当前的目标字段
  currentTargetProp.value = { nameField, idField }
};
// 部门选择
const handleDeptSelected = (selected: { NAME_: string, ID_: string }[]) => {
  const selectedUser = selected[0];

  if(currentTargetProp.value) {
    // 确认当前选中的
    const { nameField, idField } = currentTargetProp.value

    formData[nameField] = selectedUser.NAME_
    formData[idField] = selectedUser.ID_
  }
};

// =========== 父子组件通信 ===========
defineExpose({ submit, validate });
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
