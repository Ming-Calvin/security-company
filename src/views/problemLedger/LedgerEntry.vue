<template>
  <div class="new-ledger-container">
    <el-card shadow="never" class="form-card">
      <template #header>
        <div class="card-header">
          <el-page-header @back="handleGoBack">
            <template #content><span class="page-title">新建台账</span></template>
          </el-page-header>
          <el-button type="primary" size="large" @click="handlePublish" :loading="loading">发布</el-button>
        </div>
      </template>

      <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="main-form">
        <el-form-item label="监督事项" prop="fSuperviseItems">
          <el-input v-model="formData.fSuperviseItems" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="事项描述" prop="fProblemDescription">
          <el-input v-model="formData.fProblemDescription" type="textarea" :rows="3" placeholder="请输入" />
        </el-form-item>

<!--        <el-form-item label="关联台账" prop="fConnectionBook">-->
<!--          <el-button :icon="Plus" circle @click="openLedgerSelector" />-->
<!--        </el-form-item>-->

        <el-divider />

        <div class="section-header">
          <el-icon><InfoFilled /></el-icon>
          <h3 class="section-title">基础信息</h3>
        </div>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="监督类型" prop="fSuperviseType">
              <el-select v-model="formData.fSuperviseType" placeholder="请选择" style="width: 100%;">
                <el-option label="组织监督" value="组织监督" />
                <el-option label="民主监督" value="民主监督" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监督来源" prop="fSuperviseSource">
              <el-select v-model="formData.fSuperviseSource" placeholder="请选择" style="width: 100%;">
                <el-option label="打工人必看" value="打工人必看" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="整改责任部门" prop="fRectifyDept">
              <div class="custom-selector">
                <el-tag v-if="formData.fRectifyDept" closable @close="clearSelection('fRectifyDept', 'fRectifyDeptId')">
                  {{ formData.fRectifyDept }}
                </el-tag>
                <el-button :icon="Plus" circle @click="openSelector('fRectifyDept', 'fRectifyDeptId')" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="整改责任人" prop="fRectifyUser">
              <div class="custom-selector">
                <el-tag v-if="formData.fRectifyUser" closable @close="clearSelection('fRectifyUser', 'fRectifyUserId')">
                  {{ formData.fRectifyUser }}
                </el-tag>
                <el-button :icon="Plus" circle @click="openSelector('fRectifyUser', 'fRectifyUserId')" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="监督责任人" prop="fSuperviseUser">
              <div class="custom-selector">
                <el-tag v-if="formData.fSuperviseUser" closable @close="clearSelection('fSuperviseUser', 'fSuperviseUserId')">
                  {{ formData.fSuperviseUser }}
                </el-tag>
                <el-button :icon="Plus" circle @click="openSelector('fSuperviseUser', 'fSuperviseUserId')" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="整改时限" prop="fRectifyPlantime">
              <el-date-picker v-model="formData.fRectifyPlantime" type="date" placeholder="年 / 月 / 日" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否涉嫌违纪或职务违法、职务犯罪等问题" prop="fIsIllegal">
              <el-radio-group v-model="formData.fIsIllegal">
                <el-radio :value="1">是</el-radio>
                <el-radio :value="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否可能造成国有资产流失、资金转移等重大风险" prop="fIsAssetTransfer">
              <el-radio-group v-model="formData.fIsAssetTransfer">
                <el-radio :value="1">是</el-radio>
                <el-radio :value="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider />

        <div class="section-header">
          <el-icon><Link /></el-icon>
          <h3 class="section-title">佐证材料</h3>
        </div>
        <el-form-item prop="fDocuments">
          <el-upload action="#" :auto-upload="false" multiple>
            <div class="upload-trigger">
              <el-icon><Plus /></el-icon>
              <span>上传</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

  <PeopeleSelect
    ref="selectPeopleRef"
    title="选择检查部门"
    :select-user="initialSelectedUsers"
    :multiple="false"
    :fetch-tree-api="getTreeData"
    :fetch-user-list-api="getUserListData"
    @select-people="handleDeptSelected"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Plus, Link, InfoFilled } from '@element-plus/icons-vue';
import { saveLedger, type LedgerFormData } from '@/services/api/problemLedger/index.ts';
// 接口
import { getTreeList, getUserTable } from '@/services/api/problemDatabase'

// 人员选择器
import PeopeleSelect from '@/components/PeopeleSelect.vue';

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

// [修改] 表单数据对象只包含表单上存在的字段
const formData = reactive<Partial<LedgerFormData>>({
  fSuperviseItems: '',
  fProblemDescription: '',
  fConnectionBook: '',
  fSuperviseType: '',
  fSuperviseSource: '',
  fRectifyDept: '',
  fRectifyDeptId: '',
  fRectifyUser: '',
  fRectifyUserId: '',
  fSuperviseUser: '',
  fSuperviseUserId: '',
  fRectifyPlantime: '',
  fIsIllegal: 0,
  fIsAssetTransfer: 0,
  fDocuments: '',
});

// [修改] 表单验证规则也对应更新
const rules = reactive<FormRules>({
  fSuperviseItems: [{ required: true, message: '请输入监督事项', trigger: 'blur' }],
  fSuperviseType: [{ required: true, message: '请选择监督类型', trigger: 'change' }],
  fSuperviseSource: [{ required: true, message: '请选择监督来源', trigger: 'change' }],
  fRectifyDept: [{ required: true, message: '请选择整改责任部门', trigger: 'change' }],
  fRectifyUser: [{ required: true, message: '请输入或选择整改责任人', trigger: 'blur' }],
  fSuperviseUser: [{ required: true, message: '请输入或选择监督责任人', trigger: 'blur' }],
});

// --- 事件处理函数 ---

const handleGoBack = () => router.back();

const handlePublish = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {

      // 弹框提示
      await ElMessageBox.confirm(
        '您确定要发布当前内容吗？',
        {
          confirmButtonText: '确定发布',
          cancelButtonText: '取消',
          type: 'warning',
        }
      );

      loading.value = true;
      try {
        // 使用新的 saveLedger 函数提交数据
        const response = await saveLedger(formData);
        if (response.success) {
          ElMessage.success('发布成功！');
          router.back();
        } else {
          ElMessage.error(response.msg || '发布失败');
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

const openLedgerSelector = () => { ElMessage.info('打开关联台账选择器'); };

// 人员选择器
// InstanceType -- 获取 defineExpose 暴露的方法
const selectPeopleRef = ref<InstanceType<typeof PeopeleSelect> | null>(null);

// 存储当前打开人员选择器的字段
const currentTargetProp = ref({ nameField: '', idField: '' });

// 已选人员
const initialSelectedUsers = ref([])

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

// 打开人员选择器
const openSelector = (nameField: keyof typeof formData, idField: keyof typeof formData) => {
  selectPeopleRef.value?.init();

  // 记录下当前的目标字段
  currentTargetProp.value = { nameField, idField }
};

const handleDeptSelected = (selected: any[]) => {
  const selectedUser = selected[0];
  const { nameField, idField } = currentTargetProp.value

  formData[nameField] = selectedUser.FULLNAME_
  formData[idField] = selectedUser.ID_
};

const clearSelection = (nameField: keyof typeof formData, idField: keyof typeof formData) => {
  formData[nameField] = '';
  formData[idField] = '';
};
</script>

<style scoped lang="scss">
.new-ledger-container { padding: 24px; background-color: #f0f2f5; }
.form-card {
  :deep(.el-card__header) { padding: 16px 24px; border-bottom: 1px solid var(--el-border-color-lighter); }
}
.card-header { display: flex; justify-content: space-between; align-items: center; }
.page-title { font-size: 18px; font-weight: 600; color: var(--el-text-color-primary); }
.main-form { padding: 16px; }
.el-form--label-top .el-form-item { margin-bottom: 22px; }
.section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
.section-title { font-size: 16px; font-weight: 600; margin: 0; }
.custom-selector { display: flex; align-items: center; gap: 8px; width: 100%; }
.upload-trigger { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px dashed var(--el-border-color); border-radius: 6px; width: 104px; height: 104px; cursor: pointer; transition: border-color .3s;
  &:hover { border-color: var(--el-color-primary); }
  .el-icon { font-size: 28px; color: var(--el-text-color-secondary); }
  span { font-size: 14px; color: var(--el-text-color-secondary); margin-top: 4px; }
}
</style>
