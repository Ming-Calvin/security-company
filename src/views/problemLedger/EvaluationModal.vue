<template>
  <el-dialog
    title="整改完成"
    :model-value="modelValue"
    @update:model-value="handleClose"
    width="600px"
    @close="resetForm"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      label-width="80px"
    >
      <el-form-item label="评分" prop="fEvaluateScore">
        <el-rate v-model="formData.fEvaluateScore" size="large" />
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

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        提交
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { submitEvaluation } from '@/services/api/problemLedger/index.ts';
import type { EvaluationPayload } from '@/services/api/problemLedger/types.ts';

// --- Props & Emits ---
const props = defineProps({
  modelValue: { type: Boolean, required: true }, // 用于 v-model
  recordId: { type: String, required: true },    // 接收被评价记录的 ID
});

const emit = defineEmits(['update:modelValue', 'success']);

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

// --- 方法 ---
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const payload: EvaluationPayload = {
          refId: props.recordId,
          ...formData,
        };
        const response = await submitEvaluation(payload);
        if (response.success) {
          ElMessage.success('评价提交成功！');
          emit('success'); // 通知父组件成功
          handleClose();     // 关闭弹窗
        } else {
          ElMessage.error(response.msg || '提交失败');
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

const handleCancel = () => {
  handleClose();
};

const handleClose = () => {
  emit('update:modelValue', false);
};

const resetForm = () => {
  formRef.value?.resetFields();
  formData.fEvaluateScore = 0; // el-rate 需要手动重置
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 22px;
}
.el-rate {
  height: 32px; /* 给予评分组件默认高度，防止对齐问题 */
}
</style>
