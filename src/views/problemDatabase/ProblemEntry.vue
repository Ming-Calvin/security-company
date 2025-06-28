<template>
  <div p-5>
    <el-card>
      <template #header>
        <div class="card-header">
          <el-page-header @back="handleGoBack">
            <template #content>
              <span font-600 text-4>问题录入</span>
            </template>
          </el-page-header>

          <el-button type="primary"
                     @click="handleSubmit"
                     :loading="loading">
            问题保存
          </el-button>
        </div>
      </template>

      <el-form ref="formRef"
               :model="formData"
               :rules="rules"
               label-position="top">

        <h3 class="section-title">基础信息</h3>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="发现问题时间" prop="fDiscoverTime">
              <el-date-picker
                v-model="formData.fDiscoverTime"
                type="date"
                placeholder="请选择发现问题时间"
                value-format="x"
                class="!w-full"
                :disabled-date="afterToday"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="问题类型" prop="fProblemType">
              <el-select v-model="formData.fProblemType"
                         placeholder="请选择监督类型">
                <el-option label="组织监督" value="组织监督" />
                <el-option label="民主监督" value="民主监督" />
                <el-option label="制度监督" value="制度监督" />
                <el-option label="信访举报监督" value="信访举报监督" />
                <el-option label="纪律审查监督" value="纪律审查监督" />
                <el-option label="巡视巡察监督" value="巡视巡察监督" />
                <el-option label="日常监督" value="日常监督" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="问题来源" prop="fProblemSource">
              <el-select v-model="formData.fProblemSource"
                         placeholder="请选择问题来源">
                <el-option label="集团党组监督" value="集团党组监督" />
                <el-option label="集团纪检监察组监督" value="集团纪检监察组监督" />
                <el-option label="巡视监督" value="巡视监督" />
                <el-option label="审计监督" value="审计监督" />
                <el-option label="党员民主监督" value="党员民主监督" />
                <el-option label="职工群众监督反映" value="职工群众监督反映" />
                <el-option label="常态化监督" value="常态化监督" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="检查事项" prop="fInspectionItems">
              <el-input v-model="formData.fInspectionItems"
                        placeholder="请输入检查事项"
                        show-word-limit
                        maxlength="200"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述" prop="fProblemDescription">
              <el-input v-model="formData.fProblemDescription"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入问题描述"
                        show-word-limit
                        maxlength="500"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="检查部门" prop="fInspectionDept">
              <el-tag v-if="formData.fInspectionDept"
                      closable
                      mr-2
                      @close="formData.fInspectionDept = ''">
                {{ formData.fInspectionDept }}
              </el-tag>
              <el-button :icon="Plus"
                         circle
                         v-if="!formData.fInspectionDept"
                         @click="openDeptSelector('fInspectionDept', 'fInspectionDeptId')" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="被检查部门" prop="fDeptSubjectInspection">
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

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="建议整改时限" prop="fAdviceTime">
              <el-date-picker
                v-model="formData.fAdviceTime"
                type="date"
                placeholder="请选择建议整改时限"
                value-format="x"
                class="!w-full"
                :disabled-date="beforeToday"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="研判领导" prop="fLeader">
              <el-input v-model="formData.fLeader"
                        disabled
                        placeholder="选中部门后自动带入研判领导" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否涉嫌违纪或职务违法、职务犯罪等问题" prop="fIsIllegal">
              <el-radio-group v-model="formData.fIsIllegal">
                <el-radio :value="0">否</el-radio>
                <el-radio :value="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否可能造成国有资产流失、资金转移等重大风险" prop="fIsAssetTransfer">
              <el-radio-group v-model="formData.fIsAssetTransfer">
                <el-radio :value="0">否</el-radio>
                <el-radio :value="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="其他建议" prop="fOtherAdvice">
              <el-input v-model="formData.fOtherAdvice"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入"
                        maxlength="500"
                        show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <h3 class="section-title">
          <el-icon><Link /></el-icon>
          佐证材料
        </h3>

        <el-form-item prop="fDocuments">
          <FileUpload v-model:file-list="fileList"
                      :limit="10"
                      :max-size="20"
                      tip="上传文件内容支持图片、文件，大小不超过20M。图片格式支持：jpg、jpeg、png、bmp；文件格式支持：doc、docx、xls、xlsx、pdf、zip、rar"
                      @change="onFileListChange"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>

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
import { useRouter, useRoute } from 'vue-router';

// el-plus
import { ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { ElMessage } from 'element-plus';
import { Plus, Link } from '@element-plus/icons-vue';
import type { TreeNode } from 'element-plus/es/components/tree/src/tree.type';
import type { UploadFile, UploadFiles, UploadUserFile } from 'element-plus'

// api
import { getTreeList, getOrgTable, saveProblem, getProblemDetails } from '@/api/problemDatabase.ts'
import type { ProblemSavePayload } from '@/types/problemDatabase.ts'

// 人员选择器
import PeopleSelect from '@/components/PeopleSelect.vue';
import type {
  PeopleSelectDeptParams,
  PeopleSelectTreeResult,
  PeopleSelectUserTable,
  ServerFileResponse
} from '@/types/base.ts'

// utils
import { deepClone } from '@/utils'

// 路由
const router = useRouter();
const route = useRoute()

// =========== 头部 ===========
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
      } catch (e) {
        console.error(e)
        ElMessage.error('取消保存');
      }

      try {
        // 调用 saveProblem 函数，传入表单数据
        const response = await saveProblem(formData);

        // 保存成功
        if(response.code === 200) {
          ElMessage.success(response.msg);
          router.push({ name: 'question-bank' });
        } else {
          ElMessage.error(response.msg);
        }
      } catch (e) {
        console.error(e)
        ElMessage.error('保存失败');
      } finally {
        loading.value = false
      }
    }
  })
};

// =========== 表单 ===========
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
  fIsCommit: 0,
  fLeader: '',
  fLeaderId: '',
  fAdviceTime: '',
  fIsIllegal: 0,
  fIsAssetTransfer: 0,
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

// 今天及之前
const beforeToday = (time: Date) => {
  return time.getTime() <= Date.now();
};

// 今天及之后
const afterToday = (time: Date) => {
  return time.getTime() >= Date.now();
};

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

// =========== 文件上传 ===========
const fileList = ref<UploadUserFile[]>([]);

const onFileListChange = (uploadFiles: any[]) => {
  const uploadList = uploadFiles.map(item => {
    return {
      name: item.fileName,
      id: item.id
    }
  })

  formData.fDocuments = JSON.stringify(uploadList)
}

// =========== 问题详情 ===========
// 获取问题详情
const getProblemDetailData = async () => {
  try {
    loading.value = true;

    if(route.query.id && route.query.opera === 'edit') {
      const response = await getProblemDetails({ id: route.query.id, });

      if (response.success) {
        const deepCloneResponse = deepClone(response.data)

        Object.assign(formData, deepCloneResponse)
      } else {
        ElMessage.error('获取详情失败');
      }
    }

  } catch (err) {
    ElMessage.error('失误：', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getProblemDetailData();
})
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
