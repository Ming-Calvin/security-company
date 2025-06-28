<template>
  <el-dialog :title="dialogTitle"
             :model-value="modelValue"
             width="700px"
             @close="resetForm"
             :close-on-click-modal="false"
  >

    <div v-if="submitComponents[currentComponent]">
      <component :is="submitComponents[currentComponent]"
                 ref="SubmitRef"
      />
    </div>

    <el-form ref="formRef"
             :model="formData"
             :rules="rules"
             label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="下一环节">
            <el-tag> {{ nextNodeName }} </el-tag>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="下一处理人" prop="executors">
            <div class="custom-selector">
              <el-tag v-if="formData.executors"
                      closable
                      @close="clearSelection()">
                {{ formData.executorName }}
              </el-tag>
              <el-button :icon="Plus"
                         circle
                         @click="openDeptSelector()" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="审批意见" prop="opinion">
        <el-input v-model="formData.opinion"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入审批意见" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
    </template>
  </el-dialog>

  <PeopleSelect ref="selectPeopleRef"
                title="选择检查部门"
                :select-user="initialSelectedUsers"
                :multiple="false"
                :fetch-tree-api="getTreeData"
                :fetch-user-list-api="getUserListData"
                @select-people="handleDeptSelected"
  />
</template>

<script setup lang="ts">
// vue
import { ref, reactive } from 'vue';

// el-plus
import type { FormInstance, FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { ExtractedBtn } from '@/types/base.ts'

// component
import PeopleSelect from '@/components/PeopleSelect.vue';
import FGLDSP from '@/views/submitComponent/FGLDSP.vue';

// api
import type { PeopleSelectUserTable, User } from '@/types/base.ts';
import { getTreeList, getUserTable } from '@/api/problemDatabase.ts';

// =========== 弹窗 ===========
const dialogTitle = ref('')
// 下一节点名称
const nextNodeName = ref('')

const submitComponents = {
  fgldsp: FGLDSP
}
const currentComponent = ref<keyof typeof submitComponents | string>('')

const init = (item: ExtractedBtn) => {
  currentComponent.value = item.componentName
  dialogTitle.value = item.nodeName

  formData.nodeId = item.nodeId
  nextNodeName.value = item.nodeName
}

// 关闭弹窗
const handleClose = () => {
  emit('update:modelValue', false);
};

const handleCancel = () => handleClose();

// --- 状态 ---
const formRef = ref<FormInstance>();
const loading = ref(false);

const formData = reactive({
  executors: '',
  executorName: '',
  opinion: '',
  nodeId: ''
});

// 表单验证规则
const rules = reactive<FormRules>({
  executors: [{ required: true, message: '请选择下一处理人', trigger: 'change' }],
});

/*------人员选择器相关------*/
const selectPeopleRef = ref<InstanceType<typeof PeopleSelect> | null>(null);
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

// 打开部门选择器
const openDeptSelector = () => {
  selectPeopleRef.value?.init();
};

// 选中部门
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

// 清空选择
const clearSelection = () => {
  formData.executors = '';
  formData.executorName = '';
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await SubmitRef.value?.submit()

    await formRef.value.validate(async (valid) => {
      if (valid) {
        emit('confirm', formData);
        handleClose();
      } else {
        ElMessage.error('请填写必填项');
      }
    });
  } catch (e) {
    console.error(e)
  }
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
  formData.executors = '';
  formData.executorName = '';
  formData.opinion = '';
};

// =========== 父子组件交互 ===========
const props = defineProps<{
  modelValue: boolean; // 接收来自 v-model 的值
}>();
const emit = defineEmits(['update:modelValue']);

defineExpose({ init });

// 子组件相关
const SubmitRef = ref<InstanceType<typeof SubmitRef>>()

</script>

<style scoped>
.custom-selector { display: flex; align-items: center; gap: 8px; }
</style>
