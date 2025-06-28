<template>
  <el-form ref="formRef"
           :model="formData"
           :rules="rules"
           label-position="top">

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="监督类型" prop="fSuperviseType">
          <el-select v-model="formData.fSuperviseType" placeholder="请选择监督类型" clearable style="width: 100%;">
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

      <el-col :span="12">
        <el-form-item label="监督来源" prop="fSuperviseSource">
          <el-select v-model="formData.fSuperviseSource" placeholder="请选择" style="width: 100%;">
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

  </el-form>
</template>

<script setup lang="ts">
// Vue
import { ref, reactive } from 'vue'

// el-plus
import { type FormInstance, type FormRules } from 'element-plus'

// =========== 表单 ===========
const formRef = ref<FormInstance>();

// 表单数据
const formData = reactive<any>({
  fSuperviseType: '',
  fSuperviseSource: ''
});

// 表单验证规则
const rules = reactive<FormRules>({
  fSuperviseType: [{ required: true, message: '请选择监督类型', trigger: 'change' }],
  fSuperviseSource: [{ required: true, message: '请选择监督来源', trigger: 'change' }],
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

// =========== 父子组件通信 ===========
defineExpose({ submit, validate });
</script>
