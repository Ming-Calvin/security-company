<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-position="top"
    label-width="80px"
  >
    <el-form-item label="评分" prop="fEvaluateScore">
      <el-rate v-model="formData.fEvaluateScore"
               size="large" />
    </el-form-item>

    <el-form-item label="评价内容" prop="fEvaluateContent">
      <el-input
        v-model="formData.fEvaluateContent"
        type="textarea"
        :rows="6"
        placeholder="请输入评价内容..."
        maxlength="1000"
        show-word-limit
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { submitEvaluation } from '@/api/problemLedger.ts';
import type { EvaluationPayload } from '@/types/problemLedger.ts'
import { useRoute } from 'vue-router'

const route = useRoute();
const recordId = (route.query.id || route.query.taskId) as string

const emit = defineEmits(['success']);

// --- 响应式状态 ---
const formRef = ref<FormInstance>();
const loading = ref(false);
const formData = reactive({
  fEvaluateScore: 0, // el-rate 的 v-model 绑定一个数字
  fEvaluateContent: '',
});

// 自定义评分验证器
const validateRating = (rule: any, value: number, callback: any) => {
  if (value === 0) {
    callback(new Error('请选择评分'));
  } else {
    callback();
  }
};

// 表单验证规则
const rules = reactive<FormRules>({
  fEvaluateScore: [{ required: true, validator: validateRating, trigger: 'change' }],
  // 评价内容可以设为非必填，如果需要必填，取消下面这行注释
  // fEvaluateContent: [{ required: true, message: '请输入评价内容', trigger: 'blur' }],
});

const validate = async () => {
  if (!formRef.value) return

  await formRef.value.validate();

  return { ...formData };
};

// --- 方法 ---
const submit = async () => {
  try {
    loading.value = true; // 开始加载

    const payload: EvaluationPayload = {
      refId: recordId,
      ...formData,
    };

    const response = await submitEvaluation(payload);

    if (response.success) {
      return response.data;
    } else {
      ElMessage.error(response.msg || '提交失败');
      throw new Error(response.msg || 'Submission failed due to server logic.');
    }

  } catch (error) {
    console.error('提交过程中发生错误:', error);
    ElMessage.error('操作失败，请检查');

    throw error;

  } finally {
    loading.value = false;
  }
};

defineExpose({ validate, submit });
</script>

<style scoped>
.el-form-item {
  margin-bottom: 22px;
}
.el-rate {
  height: 32px; /* 给予评分组件默认高度，防止对齐问题 */
}
</style>
