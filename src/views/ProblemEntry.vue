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
            <el-form-item label="发现问题时间" prop="discoveryDate">
              <el-date-picker
                v-model="formData.discoveryDate"
                type="date"
                placeholder="年 / 月 / 日"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="问题类型" prop="problemType">
              <el-select v-model="formData.problemType" placeholder="请选择问题类型" style="width: 100%;">
                <el-option label="组织监督" value="组织监督" />
                <el-option label="民主监督" value="民主监督" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="问题来源" prop="problemSource">
              <el-select v-model="formData.problemSource" placeholder="请选择问题来源" style="width: 100%;">
                <el-option label="集团" value="集团" />
                <el-option label="子公司" value="子公司" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="检查事项" prop="inspectionItem">
              <el-input v-model="formData.inspectionItem" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述" prop="problemDescription">
              <el-input
                v-model="formData.problemDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="检查部门" prop="inspectingDept">
              <div class="custom-selector">
                <el-tag v-if="formData.inspectingDept" closable @close="formData.inspectingDept = ''">
                  {{ formData.inspectingDept }}
                </el-tag>
                <el-button :icon="Plus" circle @click="handleSelectDept('inspecting')" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="被检查部门" prop="inspectedDept">
              <div class="custom-selector">
                <el-tag v-if="formData.inspectedDept" closable @close="formData.inspectedDept = ''">
                  {{ formData.inspectedDept }}
                </el-tag>
                <el-button :icon="Plus" circle @click="handleSelectDept('inspected')" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否提交研判" prop="isForJudgement">
              <el-radio-group v-model="formData.isForJudgement">
                <el-radio :label="1">提交</el-radio>
                <el-radio :label="0">不提交</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="研判领导" prop="judgingLeader">
              <el-input v-model="formData.judgingLeader" placeholder="张 xxx" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="建议整改时限" prop="rectificationDeadline">
              <el-date-picker
                v-model="formData.rectificationDeadline"
                type="date"
                placeholder="年 / 月 / 日"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否涉嫌违纪或职务违法、职务犯罪等问题" prop="isDisciplinary">
              <el-radio-group v-model="formData.isDisciplinary">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否可能造成国有资产流失、资金转移等重大风险" prop="isMajorRisk">
              <el-radio-group v-model="formData.isMajorRisk">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="其他建议" prop="otherSuggestions">
              <el-input
                v-model="formData.otherSuggestions"
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
        <el-form-item>
          <el-upload
            action="#"
            :auto-upload="false"
            multiple
          >
            <el-button type="primary" plain :icon="Upload">上传</el-button>
          </el-upload>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Plus, Link, Upload } from '@element-plus/icons-vue';

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

// 表单数据
const formData = reactive({
  discoveryDate: '',
  problemType: '',
  problemSource: '',
  inspectionItem: '',
  problemDescription: '',
  inspectingDept: '',
  inspectedDept: '',
  isForJudgement: 1,
  judgingLeader: '',
  rectificationDeadline: '',
  isDisciplinary: 0,
  isMajorRisk: 0,
  otherSuggestions: '',
});

// 表单验证规则
const rules = reactive<FormRules>({
  discoveryDate: [{ required: true, message: '请选择发现问题时间', trigger: 'change' }],
  problemType: [{ required: true, message: '请选择问题类型', trigger: 'change' }],
  problemSource: [{ required: true, message: '请选择问题来源', trigger: 'change' }],
  inspectionItem: [{ required: true, message: '请输入检查事项', trigger: 'blur' }],
  problemDescription: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
  inspectingDept: [{ required: true, message: '请选择检查部门', trigger: 'change' }],
  inspectedDept: [{ required: true, message: '请选择被检查部门', trigger: 'change' }],
  rectificationDeadline: [{ required: true, message: '请选择建议整改时限', trigger: 'change' }],
});

// --- 事件处理 ---

// 返回上一页
const handleGoBack = () => {
  router.back();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    loading.value = true;
    const valid = await formRef.value.validate();
    if (valid) {
      console.log('Form data:', formData);
      // 在这里添加你的 API 提交逻辑
      ElMessage.success('提交成功！');
      // 可以在提交成功后跳转页面
      // router.push('/path/to/list');
    } else {
      ElMessage.error('表单校验失败，请检查输入项！');
      return false;
    }
  } catch (error) {
    console.error('An error occurred during form submission:', error);
  } finally {
    loading.value = false;
  }
};

// 处理部门选择（占位符逻辑）
const handleSelectDept = (type: 'inspecting' | 'inspected') => {
  // 在真实项目中，这里会弹出一个对话框（ElDialog）让用户选择部门
  console.log(`选择${type === 'inspecting' ? '检查' : '被检查'}部门`);
  const selectedDept = '示例部门'; // 模拟选择结果
  if (type === 'inspecting') {
    formData.inspectingDept = selectedDept;
  } else {
    formData.inspectedDept = selectedDept;
  }
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
