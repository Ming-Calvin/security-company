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
            <el-button type="primary">提交研判</el-button>
            <el-button type="danger">撤回</el-button>
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
import { useRouter } from 'vue-router';
import { Link, Document } from '@element-plus/icons-vue';

// --- [修改] 类型定义已更新以匹配API ---
interface ProblemDetails {
  id: string;
  fAdviceTime: number;
  fCharger: string;
  fChargerId: string;
  fDeptSubjectInspection: string;
  fDeptSubjectInspectionId: string;
  fDiscoverTime: number;
  fDocuments: string; // 注意：这是一个字符串，需要解析
  fEntryTime: number;
  fInspectionDept: string;
  fInspectionItems: string;
  fIsAssetTransfer: 0 | 1;
  fIsCommit: 0 | 1;
  fIsIllegal: 0 | 1;
  fJcbmidinspectionDeptId: string;
  fLeader: string;
  fLeaderId: string;
  fOtherAdvice: string;
  fProblemDescription: string;
  fProblemSource: string;
  fProblemType: string;
  fProposer: string;
  fProposerId: string;
  fWorkNo: string;
}

interface AttachmentFile {
  name: string;
  size: string;
  url: string;
}

// --- 响应式状态 ---
const router = useRouter();
const loading = ref(true);
const details = ref<ProblemDetails | null>(null);

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

// --- API (模拟) ---
const fetchDetails = () => {
  loading.value = true;
  setTimeout(() => {
    // [修改] 使用你提供的真实接口数据作为模拟数据
    details.value = {
      "fAdviceTime":1749139200000,
      "fCharger":"整改责任人",
      "fChargerId":"整改责任人ID",
      "fDeptSubjectInspection":"被检查部门, 综合部",
      "fDeptSubjectInspectionId":"被检查部门ID",
      "fDiscoverTime":1717516800000, // 修改为接近当前的时间以便观察
      "fDocuments":"会议纪要.pptx",
      "fEntryTime":1717516800000,
      "fInspectionDept":"检查部门",
      "fInspectionItems":"关于XX问题的专项检查",
      "fIsAssetTransfer":1,
      "fIsCommit":0,
      "fIsIllegal":1,
      "fJcbmidinspectionDeptId":"检查部门ID",
      "fLeader":"研判领导A, 研判领导B",
      "fLeaderId":"研判领导ID",
      "fOtherAdvice":"建议加强内部培训，完善相关流程，并定期进行复盘，确保问题不再发生。建议加强内部培训，完善相关流程，并定期进行复盘。",
      "fProblemDescription":"在对2025年第一季度财务报表进行审计时，发现存在多笔账目记录不清晰、凭证不全的情况，可能违反公司财务管理规定。",
      "fProblemSource":"季度审计",
      "fProblemType":"财务合规",
      "fProposer":"张美美",
      "fProposerId":"提出人ID",
      "fWorkNo":"Q-2025-0017",
      "id":"2490000000320017"
    };
    loading.value = false;
  }, 500);
};

// --- 工具函数 ---
const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  // 使用 toLocaleDateString 可以更方便地格式化，且包含年月日
  return date.toLocaleDateString('zh-CN');
};

// --- 生命周期 ---
onMounted(() => {
  fetchDetails();
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
