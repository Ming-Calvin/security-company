<template>
  <el-form ref="formRef"
           :model="formData"
           :rules="rules"
           label-position="top">

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="启动时间" prop="fRectifyPlantime">
          {{ formatTimestamp(ledgerDetailData.fRectifyPlantime) }}
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
</template>

<script setup lang="ts">
// Vue
import { ref, reactive } from 'vue'

// el-plus
import { type FormInstance, type FormRules } from 'element-plus'
import type { ProblemDetails } from '@/types/problemLedger.ts'


// =========== 表单 ===========
const formRef = ref<FormInstance>();

// 时间转换函数
const formatTimestamp = (timestamp: number) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 表单数据
const formData = reactive<any>({
  fRectifyStarttime: '',
});

// 表单验证规则
const rules = reactive<FormRules>({
  // fRectifyStarttime: [{ required: true, message: '请选择启动时间', trigger: 'change' }]
});

// 提交方法
const submit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate();

  } catch (error) {
    console.error('提交过程中发生错误:', error);

    throw error;
  }
};

const validate = () => {}

// =========== 父子组件通信 ===========
defineExpose({ submit, validate });

const ledgerDetailData = inject<Ref<ProblemDetails | null>>('ledgerDetailData');
</script>
