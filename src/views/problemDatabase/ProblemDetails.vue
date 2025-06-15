<template>
  <div class="page-container">
    <el-card class="details-card">
      <template #header>
        <div class="card-header">
          <el-page-header @back="handleGoBack" class="page-header-title">
            <template #content>
              <span class="font-bold">问题详情</span>
            </template>
          </el-page-header>
          <div class="header-actions">
            <el-button type="primary" @click="submit">提交研判</el-button>
<!--            <el-button type="danger">撤回</el-button>-->
            <el-button>流转记录</el-button>
            <el-button>流程图</el-button>
            <el-button>编辑</el-button>
            <el-button>删除</el-button>
          </div>
        </div>
      </template>

      <div v-loading="loading" v-if="details && details.id">
        <div class="section">
          <h3 class="section-title">
            <span class="icon-circle bg-blue"></span>
            检查事项内容
          </h3>
          <p class="section-content">{{ details.fInspectionItems }}</p>
        </div>

        <div class="section">
          <h3 class="section-title">
            <span class="icon-circle bg-green"></span>
            问题描述
          </h3>
          <p class="section-content">{{ details.fProblemDescription }}</p>
        </div>

        <div class="section">
          <h3 class="section-title">
            <span class="icon-circle bg-orange"></span>
            基础信息
          </h3>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="编号">{{ details.id }}</el-descriptions-item>
            <el-descriptions-item label="发现问题时间">{{ formatDate(details.fDiscoverTime) }}</el-descriptions-item>
            <el-descriptions-item label="问题来源">{{ details.fProblemSource }}</el-descriptions-item>

            <el-descriptions-item label="提出人">{{ details.fProposer }}</el-descriptions-item>
            <el-descriptions-item label="检查部门">{{ details.fInspectionDept }}</el-descriptions-item>
            <el-descriptions-item label="被检查部门">{{ details.fDeptSubjectInspection }}</el-descriptions-item>

            <el-descriptions-item label="建议整改时限">{{ formatDate(details.fAdviceTime) }}</el-descriptions-item>
            <el-descriptions-item label="是否提交研判">{{ details.fIsCommit === 1 ? '是' : '否' }}</el-descriptions-item>
            <el-descriptions-item label="研判领导">{{ details.fLeader }}</el-descriptions-item>

            <el-descriptions-item label="是否涉嫌违纪或职务违法等问题">{{ details.fIsIllegal === 1 ? '是' : '否' }}</el-descriptions-item>
            <el-descriptions-item label="是否可能造成国有资产流失等重大风险" :span="2">{{ details.fIsAssetTransfer === 1 ? '是' : '否' }}</el-descriptions-item>

            <el-descriptions-item label="其他建议" :span="3">{{ details.fOtherAdvice }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="section">
          <h3 class="section-title">
            <el-icon><Link /></el-icon>
            佐证材料
          </h3>
          <div class="attachment-list">
            <div v-for="(file, index) in attachmentList" :key="index" class="attachment-item">
              <el-icon :size="24" color="#ff6b6b"><Document /></el-icon>
              <div class="file-info">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ file.size }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Link, Document } from '@element-plus/icons-vue';
import type { ProblemDetail } from '@/services/api/problemDatabase/types.ts'
import { getProblemDetails, problemWarehouseCommit } from '@/services/api/problemDatabase'
import { getQuestionOrderTaskId } from '@/services/api'

interface AttachmentFile {
  name: string;
  size: string;
  url: string;
}

// --- 响应式状态 ---
const router = useRouter();
const route = useRoute();
const loading = ref(true);
const details = ref<ProblemDetail>({
  id: '',
  refId: '',
  fDiscoverTime: '',
  fEntryTime: '',
  fAdviceTime: '',
  fInspectionDept: '',
  fInspectionDeptId: '',
  fDeptSubjectInspection: '',
  fDeptSubjectInspectionId: '',
  fInspectionItems: '',
  fProblemDescription: '',
  fProblemSource: '',
  fProblemType: '',
  fDocuments: '',
  fIsIllegal: '',
  fIsAssetTransfer: '',
  fIsCommit: '',
  fOtherAdvice: '',
  fProposer: '',
  fProposerId: '',
  fLeader: '',
  fLeaderId: '',
  fCharger: '',
  fChargerId: '',
});

// --- [修改] 基于 details.fDocuments 计算附件列表 ---
const attachmentList = computed((): AttachmentFile[] => {
  if (!details.value?.fDocuments) return [];
  // **注意**: 这里的解析逻辑是模拟的。
  // 你需要根据 fDocuments 字段的真实格式（比如是逗号分隔的ID或URL）来编写解析逻辑。
  // 此处我们仅为演示，将其视为一个简单的文件名。
  return [
    { name: details.value.fDocuments, size: '299kb', url: '#' },
    { name: '补充材料.pdf', size: '1.2MB', url: '#' },
  ];
});

const imageList = computed((): AttachmentFile[] => {
  // 同理，图片列表也应基于解析 fDocuments 得来
  return [
    { url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', name: '', size: '' },
    { url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg', name: '', size: '' },
    { url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg', name: '', size: '' },
  ];
});

// --- 事件处理 ---
const handleGoBack = () => {
  router.back();
};

// --- 工具函数 ---
const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  // 使用 toLocaleDate'' 可以更方便地格式化，且包含年月日
  return date.toLocaleDateString('zh-CN');
};

// 获取问题详情
const getProblemDetailData = async () => {
  const problemId : string = route.query.id;

  try {
    loading.value = true;
    const response = await getProblemDetails(problemId);

    if (response.success) {
      details.value = response.data;

      try {
        const taskIdResponse = await getQuestionOrderTaskId({ processInstId: details.value.id})

        if(taskIdResponse.data.length > 0) {
          details.value.taskId = taskIdResponse.data[0].taskId;
        } else {
          details.value.taskId = null;
        }
      } catch (e) {
        console.error('获取taskId失败', e)
      }
    } else {
      ElMessage.error('获取详情失败');
    }
  } catch (err) {
    ElMessage.error('失误：', err);
  } finally {
    loading.value = false;
  }
};

// 提交研判
const submit = async () => {
  const startFlowParamObject =  {
    account: "chenlijun1",
    defId: "2490000000310172",
    nodeUsers: "[{\"nodeId\":\"UserTask2\",\"executors\":[{\"id\":1003,\"name\":\"陈浩\"}]}]",
    subject: "问题标题",
    destination: "UserTask2",
    formName: "【提交工单】"
  }

  const submitForm = { ...details.value , startFlowParamObject: startFlowParamObject }

  try {
    console.log(submitForm, 'submitForm')

    const response = await problemWarehouseCommit(submitForm)

    // console.log(response, 'response')

  } catch (e) {
    console.error('提交失败', e)
  }
}


// --- 生命周期 ---
onMounted(() => {
  getProblemDetailData();
});
</script>

<style lang="scss" scoped>
/* 样式与上一版相同，无需修改 */
.page-container {
  padding: 20px;
}
.details-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page-header-title .font-bold {
    font-weight: 600;
  }
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.icon-circle {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  &.bg-blue { background-color: #409eff; }
  &.bg-green { background-color: #67c23a; }
  &.bg-orange { background-color: #e6a23c; }
}

.attachment-list {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;

  .file-info {
    display: flex;
    flex-direction: column;
  }
  .file-name {
    font-size: 14px;
    color: #303133;
  }
  .file-size {
    font-size: 12px;
    color: #909399;
  }

  &:hover {
    background-color: #eef2fb;
  }
}

.attachment-previews {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.preview-image {
  width: 150px;
  height: 100px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
}
</style>
