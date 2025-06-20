<template>
  <el-upload
    ref="uploadRef"
    v-model:file-list="fileList"
    :action="uploadUrl"
    :headers="uploadHeaders"
    :accept="props.accept"
    :multiple="props.multiple"
    :limit="props.limit"
    :on-exceed="handleExceed"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    class="upload-component"
  >
    <el-button type="primary">
      <el-icon class="el-icon--left"><Upload /></el-icon>
      上传附件
    </el-button>
    <template #tip>
      <div v-if="tip" class="el-upload__tip">
        {{ tip }}
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Upload } from '@element-plus/icons-vue';
import type { UploadProps, UploadUserFile, UploadRawFile, UploadInstance } from 'element-plus';

// --- 1. 定义 Props 和 Emits (组件的对外接口) ---

const props = defineProps({
  // 通过 v-model:fileList 传入的文件列表
  fileList: {
    type: Array as () => UploadUserFile[],
    default: () => [],
  },
  // 允许的文件类型
  accept: {
    type: String,
    default: ".jpg,.jpeg,.png,.bmp,.doc,.docx,.xls,.xlsx,.pdf,.zip,.rar",
  },
  // 最大上传数量
  limit: {
    type: Number,
    default: 5,
  },
  // 文件大小限制 (单位: MB)
  maxSize: {
    type: Number,
    default: 20,
  },
  // 是否支持多选
  multiple: {
    type: Boolean,
    default: true,
  },
  // 上传提示文本
  tip: {
    type: String,
    default: ""
  },
});

const emit = defineEmits([
  'update:fileList', // v-model:fileList 需要的事件
  'change',          // 当文件列表（后端需要的格式）发生变化时触发
]);

// --- 2. 内部状态和配置 ---
const uploadRef = ref<UploadInstance>();

// [关键] 使用 computed 属性来同步 prop 和内部状态，这是 v-model 在组件上的标准用法
const fileList = computed({
  get() {
    return props.fileList;
  },
  set(newFileList) {
    emit('update:fileList', newFileList);
  }
});

// 上传地址和请求头
const uploadUrl = ref(`${import.meta.env.VITE_API_BASE_URL}/quora/order/file/fileUploadHb`);
const uploadHeaders = ref({
  // Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// --- 3. 事件处理函数 ---

const beforeUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {
  // 检查文件类型
  const fileExtension = rawFile.name.substring(rawFile.name.lastIndexOf('.')).toLowerCase();
  const isAllowedType = props.accept.toLowerCase().includes(fileExtension);

  if (!isAllowedType) {
    ElMessage.error(`不支持上传 ${fileExtension} 格式的文件！`);
    return false;
  }

  // 检查文件大小
  const isSizeOk = rawFile.size / 1024 / 1024 < props.maxSize;
  if (!isSizeOk) {
    ElMessage.error(`上传文件大小不能超过 ${props.maxSize}MB!`);
    return false;
  }
  return true;
};

const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
  ElMessage.success(`${uploadFile.name} 上传成功！`);
  // 上传成功后，将最新的文件列表（后端需要的格式）通过 change 事件发出去
  emitChange(uploadFiles);
};

const handleError: UploadProps['onError'] = (error, uploadFile, uploadFiles) => {
  ElMessage.error(`${uploadFile.name} 上传失败。`);
  // 上传失败后，也更新一次列表状态
  emitChange(uploadFiles);
};

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  ElMessage.info(`移除了文件: ${uploadFile.name}`);
  // 移除文件后，也更新一次列表状态
  emitChange(uploadFiles);
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(`上传超出数量限制，最多允许上传 ${props.limit} 个文件。`);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  if (uploadFile.url) window.open(uploadFile.url, '_blank');
};

/**
 * 提取所有已成功上传的文件，并将其转换为后端需要的格式，然后通过 change 事件发出去
 * @param {UploadUserFile[]} uploadFiles - el-upload 内部的完整文件列表
 */
const emitChange = (uploadFiles: UploadUserFile[]) => {
  const successfullyUploaded = uploadFiles
    .filter(file => file.status === 'success')
    .map(file => (file.response as any)?.data[0] || file.response); // 提取后端返回的核心数据

  emit('change', successfullyUploaded);
};

// 暴露 submit 方法，以便父组件可以手动触发上传
const submit = () => {
  uploadRef.value?.submit();
};
defineExpose({ submit });
</script>

<style scoped>
.el-upload__tip {
  color: #909399;
  font-size: 12px;
  margin-top: 7px;
}
</style>
