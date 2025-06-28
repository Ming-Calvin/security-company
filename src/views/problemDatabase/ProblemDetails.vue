<template>
  <div p-4>
    <el-card class="details-card">
      <template #header>
        <div class="card-header">
          <el-page-header @back="handleGoBack"
                          class="page-header-title">
            <template #content>
              <span class="font-bold">问题详情</span>
            </template>
          </el-page-header>

          <div class="header-actions">
            <el-button v-for="(item, index) in extractedBtnList"
                       type="primary"
                       :key="index"
                       @click="openApprovalModal(item)"
            >
              {{ item.buttonName }}
            </el-button>
            <el-button>流转记录</el-button>
            <el-button @click="showFlowChartModal = true">流程图</el-button>
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
            <div v-for="(file, index) in attachmentList"
                 :key="index"
                 class="attachment-item">

              <el-icon :size="24" color="#ff6b6b"><Document /></el-icon>

              <div class="file-info" @click="handleDownload(file)">
                <span class="file-name">{{ file.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>

  <SubmitComponent ref="SubmitComponentRef"
                   v-if="isApprovalModalVisible"
                   v-model="isApprovalModalVisible"
                   @confirm="handleModalConfirm"
  />

  <FlowChartModal
    v-if="showFlowChartModal"
    v-model="showFlowChartModal"
    :nodes="flowNodes"
    :edges="flowEdges"
  />
</template>

<script setup lang="ts">
// vue
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// el-plus
import { Link, Document } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus'

// api
import type { ProblemDetail, AttachmentFile } from '@/types/problemDatabase.ts'
import { getProblemDetails, problemWarehouseCommit } from '@/api/problemDatabase'
import { getNodeSet } from '@/api/base.ts'
import type { ExtractedBtn, SubmitPayload, Executor } from '@/types/base.ts'
import request from '@/services/request.ts';

// components
import SubmitComponent from '@/components/SubmitComponent.vue'
import FlowChartModal from '@/components/FlowChartModal.vue'
import type { Node, Edge } from '@vue-flow/core';

// until
import { formatDate } from '@/utils/index';
import { rectificationBookCommit } from '@/api/problemLedger.ts'

// 路由
const router = useRouter();
const route = useRoute();

// =========== 头部 ===========
// 返回上一页
const handleGoBack = () => {
  router.back();
};

const extractedBtnList = ref<ExtractedBtn[]>([])

// 获取展示按钮
const getExtractedBtnList = async () => {
  const params = {
    defId: "2490000000310172",
    nodeId: route.query.nodeId,
  }

  try {
    const response = await getNodeSet(params)

    extractedBtnList.value = response.map(item => {
      const [nextNodeId, component = null] = item.alias.split('_')

      return {
        nodeId: nextNodeId,
        componentName: component,
        nodeName: item.beforeScript,
        buttonName: item.name
      }
    })
  } catch (e) {
    console.error(e)
  }
}

// =========== 详情表单 ===========
const loading = ref(true);
const details = ref<ProblemDetail>({
  id: '',
  refId: '',
  fDiscoverTime: 0,
  fEntryTime: '',
  fAdviceTime: 0,
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

// 附件列表
const attachmentList = computed((): AttachmentFile[] => {
  if (!details.value?.fDocuments) return [];
  return JSON.parse(details.value.fDocuments);
});
// 下载
const handleDownload = async (file: AttachmentFile) => {
  try {
    const response = await request({
      url: `/system/file/download?id=${file.id}`,
      method: 'get',
      responseType: 'blob',
    });

    // 创建一个 Blob URL
    const blobUrl = window.URL.createObjectURL(new Blob([response]));

    // 创建一个隐藏的 <a> 标签并模拟点击
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', file.name); // 设置下载文件名
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.error('下载失败:', error);
    ElMessage.error('下载文件失败！');
  }
};

// =========== 提交研判 ===========
const isApprovalModalVisible = ref(false);

// 获取问题详情
const getProblemDetailData = async () => {
  const params = {
    id: route.query.id,
    procInstId: route.query.procInstId,
  }


  try {
    loading.value = true;
    const response = await getProblemDetails(params);

    if (response.success) {
      details.value = response.data;

    } else {
      ElMessage.error('获取详情失败');
    }

  } catch (err) {
    console.error(err)
    ElMessage.error('获取详情失败');
  } finally {
    loading.value = false;
  }
};

// 提交组件
const SubmitComponentRef = ref<InstanceType<typeof SubmitComponent>>()

const currentNodeBtnData = ref('')

// 打开弹窗
const openApprovalModal = async (item: ExtractedBtn) => {
  isApprovalModalVisible.value = true
  await nextTick();
  SubmitComponentRef.value?.init(item);
  currentNodeBtnData.value = item
};

// 提交研判
const handleModalConfirm = async (submitData: SubmitPayload) => {
  // 提交表单
  let submitForm: SubmitPayload;

  const executorsToSubmit: Executor[] = [submitData.executors];

  if (route.query.taskId) {
    // --- 审批流程中的提交 ---
    submitForm = {
      ...details.value,
      DoNextParamExtObject: {
        nodeUsers: JSON.stringify([{ nodeId: currentNodeBtnData.value.nodeId, executors: executorsToSubmit }]),
        account: "admin",
        taskId: route.query.taskId as string,
        actionName: "agree",
        opinion: submitData.opinion,
        formType: "inner",
        jumpType: "select",
        destination: currentNodeBtnData.value.nodeId,
        opinionFiles: [],
        formName: currentNodeBtnData.value.nodeName
      }
    };
  } else {
    // --- 发起新流程的提交 ---
    submitForm = {
      ...details.value,
      startFlowParamObject: {
        account: "admin",
        defId: "2490000000310172",
        nodeUsers: JSON.stringify([{ nodeId: 'UserTask2', executors: executorsToSubmit }]),
        subject: "问题标题",
        destination: 'UserTask2',
        formName: "【提交工单】"
      }
    };
  }

  try {
    loading.value = true;
    const response = await problemWarehouseCommit(submitForm);

    if (response.code === 200) {
      ElMessage.success(response.msg || '提交成功');
      router.push({ name: 'super-agency' });
    } else {
      // 显示后端返回的错误信息，体验更好
      ElMessage.error(response.msg || '提交失败，请稍后重试');
    }
  } catch (e) {
    console.error('提交失败:', e);
    ElMessage.error('请求失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
};

// =========== 流程图组件 ===========
const showFlowChartModal = ref(false);

const flowNodes = ref<Node[]>([
  { id: '1', type: 'input', label: '开始', position: { x: 0, y: 150 } },
  { id: '2', label: '录入问题', position: { x: 250, y: 150 } },
  { id: '3', label: '部门经理审批', position: { x: 500, y: 150 } },
  { id: '4', label: '分管领导审批', position: { x: 750, y: 150 } },
]);

const flowEdges = ref<Edge[]>([
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'left'  },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', label: '发起研判', sourceHandle: 'right', targetHandle: 'left'   },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', label: '通过', sourceHandle: 'right', targetHandle: 'left'   },
  // { id: 'e3-2', source: '3', target: '2', type: 'smoothstep', label: '退回', sourceHandle: 'top', targetHandle: 'top' },
  // { id: 'e4-2', source: '4', target: '2', type: 'smoothstep', label: '退回', sourceHandle: 'top', targetHandle: 'top' },
]);

// =========== 生命周期 ===========
onMounted(() => {
  getProblemDetailData();
  getExtractedBtnList();
});
</script>

<style lang="scss" scoped>
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

  &:hover {
    background-color: #eef2fb;
  }
}
</style>
