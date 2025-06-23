<template>
  <div class="page-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <el-page-header @back="handleGoBack" class="page-header-title">
            <template #content>
              <span class="font-bold">问题录入</span>
            </template>
          </el-page-header>
          <el-button type="primary" @click="handleSubmit" :loading="loading">确认</el-button>
        </div>
      </template>

      <el-form ref="formRef" :model="formData" :rules="rules" label-position="top">
        <h3 class="section-title">基础信息</h3>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="发现问题时间" prop="fDiscoverTime">
              <el-date-picker
                v-model="formData.fDiscoverTime"
                type="date"
                placeholder="年 / 月 / 日"
                value-format="YYYY-MM-DD"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="问题类型" prop="fProblemType">
              <el-select v-model="formData.fProblemType" placeholder="请选择问题类型" style="width: 100%;">
                <el-option label="组织监督" value="组织监督" />
                <el-option label="民主监督" value="民主监督" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="问题来源" prop="fProblemSource">
              <el-select v-model="formData.fProblemSource" placeholder="请选择问题来源" style="width: 100%;">
                <el-option label="集团" value="集团" />
                <el-option label="子公司" value="子公司" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="检查事项" prop="fInspectionItems">
              <el-input v-model="formData.fInspectionItems" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述" prop="fProblemDescription">
              <el-input
                v-model="formData.fProblemDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="检查部门" prop="fInspectionDept">
              <div class="custom-selector">
                <el-tag v-if="formData.fInspectionDept" closable @close="formData.fInspectionDept = ''">
                  {{ formData.fInspectionDept }}
                </el-tag>
                <el-button :icon="Plus" circle @click="openDeptSelector('fInspectionDept')" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被检查部门" prop="fDeptSubjectInspection">
              <div class="custom-selector">
                <el-tag v-if="formData.fDeptSubjectInspection" closable @close="formData.fDeptSubjectInspection = ''">
                  {{ formData.fDeptSubjectInspection }}
                </el-tag>
                <el-button :icon="Plus" circle @click="openDeptSelector('fDeptSubjectInspection')" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="建议整改时限" prop="fAdviceTime">
              <el-date-picker
                v-model="formData.fAdviceTime"
                type="date"
                placeholder="年 / 月 / 日"
                value-format="YYYY-MM-DD"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="研判领导" prop="fLeader">
              <el-input v-model="formData.fLeader" placeholder="张 xxx" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="是否提交研判" prop="fIsCommit">
              <el-radio-group v-model="formData.fIsCommit">
                <el-radio value="1">提交</el-radio>
                <el-radio value="0">不提交</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否涉嫌违纪或职务违法、职务犯罪等问题" prop="fIsIllegal">
              <el-radio-group v-model="formData.fIsIllegal">
                <el-radio value="0">否</el-radio>
                <el-radio value="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否可能造成国有资产流失、资金转移等重大风险" prop="fIsAssetTransfer">
              <el-radio-group v-model="formData.fIsAssetTransfer">
                <el-radio value="0">否</el-radio>
                <el-radio value="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="其他建议" prop="fOtherAdvice">
              <el-input
                v-model="formData.fOtherAdvice"
                type="textarea"
                :rows="3"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <h3 class="section-title">
          <el-icon><Link /></el-icon>
          佐证材料
        </h3>
        <el-form-item prop="fDocuments">
          <FileUpload
            v-model:file-list="fileLIst"
            :limit="10"
            :max-size="20"
            tip="上传文件内容支持图片、文件，大小不超过20M。图片格式支持：jpg、jpeg、png、bmp；文件格式支持：doc、docx、xls、xlsx、pdf、zip、rar"
            @change="handleFilesChange"
          />
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ElMessage } from 'element-plus';
import { Plus, Link } from '@element-plus/icons-vue';

// 接口
import { getTreeList, getUserTable, saveProblem } from '@/api/problemDatabase.ts'
import type { ProblemSavePayload } from '@/types/problemDatabase.ts'

// 人员选择器
import PeopeleSelect from '@/components/PeopeleSelect.vue';
import type { PeopleSelectUserTable } from '@/types/base.ts'

// 上传组件
import type { UploadUserFile } from 'element-plus';

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

// 表单数据
const formData = reactive<ProblemSavePayload>({
  fDiscoverTime: '',
  fProblemType: '',
  fProblemSource: '',
  fInspectionItems: '',
  fProblemDescription: '',
  fInspectionDept: '',
  fInspectionDeptId: '',
  fDeptSubjectInspection: '',
  fDeptSubjectInspectionId: '',
  fIsCommit: '0',
  fLeader: '',
  fAdviceTime: '',
  fIsIllegal: '0',
  fIsAssetTransfer: '0',
  fOtherAdvice: '',
  fDocuments: ''
});

// 表单验证规则
const rules = reactive<FormRules>({
  fDiscoverTime: [{ required: true, message: '请选择发现问题时间', trigger: 'change' }],
  fProblemType: [{ required: true, message: '请选择问题类型', trigger: 'change' }],
  fProblemSource: [{ required: true, message: '请选择问题来源', trigger: 'change' }],
  fInspectionItems: [{ required: true, message: '请输入检查事项', trigger: 'blur' }],
  fProblemDescription: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
  fInspectionDept: [{ required: true, message: '请选择检查部门', trigger: 'change' }],
  fDeptSubjectInspection: [{ required: true, message: '请选择被检查部门', trigger: 'change' }],
  fAdviceTime: [{ required: true, message: '请选择建议整改时限', trigger: 'change' }],
});

// 返回上一页
const handleGoBack = () => {
  router.push({ name: 'question-bank' });
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if(valid) {
      loading.value = true

      try {
        // 弹框提示
        await ElMessageBox.confirm(
          '您确定要保存当前内容吗？',
          {
            confirmButtonText: '确定保存',
            cancelButtonText: '取消',
            type: 'warning',
          }
        );

        // 调用 saveProblem 函数，传入表单数据
        const response = await saveProblem(formData);

        // 保存成功
        if(response.code === 200) {
          ElMessage.success('保存成功');
          router.push({ name: 'question-bank' });
        } else {
          ElMessage.error('保存失败');
        }
      } catch (e) {
        ElMessage.error('保存失败：', e);
      } finally {
         loading.value = false
      }
    }
  })
};


/*------人员选择器------*/
// InstanceType -- 获取 defineExpose 暴露的方法
const selectPeopleRef = ref<InstanceType<typeof PeopeleSelect> | null>(null);

// 存储当前打开人员选择器的字段
const currentTargetProp = ref('');

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
const openDeptSelector = (targetProp: string) => {
  selectPeopleRef.value?.init();

  // 记录下当前的目标字段
  currentTargetProp.value = targetProp;
};

const handleDeptSelected = (selected: any[]) => {
  const selectedUser = selected[0];
  const target = currentTargetProp.value;

  if (target === 'fInspectionDept') {
    formData.fInspectionDept = selectedUser.FULLNAME_;
    formData.fInspectionDeptId = selectedUser.CODE_;
  } else if (target === 'fDeptSubjectInspection') {
    formData.fDeptSubjectInspection = selectedUser.FULLNAME_;
    formData.fDeptSubjectInspectionId = selectedUser.CODE_;
  }
};

/*------文件上传------*/
const fileLIst = ref<UploadUserFile[]>([]);

const handleFilesChange = (fileList: any[]) => {
  const uploadList = fileList.map(item => {
    return {
      name: item.fileName,
      id: item.id
    }
  })

  formData.fDocuments = JSON.stringify(uploadList)
};

</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header-title .font-bold {
  font-weight: 600;
  font-size: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

// 部门选择器样式
.custom-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
