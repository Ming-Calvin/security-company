<template>
  <el-dialog
    title="更新进展"
    :model-value="modelValue"
    @update:model-value="handleClose"
    width="600px"
    @close="resetForm"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="进展说明" prop="fUpdateContent">
        <el-input
          v-model="formData.fUpdateContent"
          type="textarea"
          :rows="5"
          placeholder="请输入详细进展说明..."
        />
      </el-form-item>
      <el-form-item label="附件" prop="fDocuments">
        <el-upload
          action="#"
          :auto-upload="false"
          multiple
        >
          <el-button :icon="Upload">上传文件</el-button>
        </el-upload>
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
import { Upload } from '@element-plus/icons-vue';
import { updateRectProcess } from '@/services/api/problemLedger/index.ts';
import type { ProgressUpdatePayload } from '@/services/api/problemLedger/types.ts';

// --- Props & Emits ---
const props = defineProps({
  modelValue: { type: Boolean, required: true }, // 用于 v-model 控制显示
  recordId: { type: String, required: true },    // 接收父组件传来的记录 ID
});

const emit = defineEmits(['update:modelValue', 'success']);

// --- 响应式状态 ---
const formRef = ref<FormInstance>();
const loading = ref(false);
const formData = reactive({
  fUpdateContent: '',
  fDocuments: '',
});

// 表单验证规则
const rules = reactive<FormRules>({
  fUpdateContent: [{ required: true, message: '请输入进展说明', trigger: 'blur' }],
});


// --- 方法 ---
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const payload: ProgressUpdatePayload = {
          refId: props.recordId,
          ...formData,
        };
        const response = await updateRectProcess(payload);
        if (response.success) {
          ElMessage.success('更新进展成功！');
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
};
</script>
