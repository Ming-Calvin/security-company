<template>
  <div class="page-container">
    <el-card class="details-card">
      <template #header>
        <div class="card-header">
          <el-page-header @back="handleGoBack" class="page-header-title">
            <template #content>
              <span class="font-bold">督办详情</span>
            </template>
          </el-page-header>
          <div class="header-actions">
            <el-button v-for="(item, index) in extractedBtnList"
                       type="primary"
                       :key="index"
                       @click="openApprovalModal(item.nodeId)"
            >
              {{ item.nodeName }}
            </el-button>
            <el-button type="primary" v-if="!route.query.taskId" @click="openApprovalModal('UserTask2')">提交研判</el-button>
            <el-button>流转记录</el-button>
            <el-button @click="showFlowChartModal = true">流程图</el-button>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>

  <SubmitComponent
    ref="submitComponent"
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
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Link, Document } from '@element-plus/icons-vue';
import type { ProblemDetail } from '@/types/problemDatabase.ts'
import { getProblemDetails, problemWarehouseCommit } from '@/api/problemDatabase'
import SubmitComponent from '@/views/problemDatabase/SubmitComponent.vue'
import FlowChartModal from '@/components/FlowChartModal.vue'
import type { Node, Edge, Position } from '@vue-flow/core';
import { ElMessage } from 'element-plus'
import { getTaskHandleDetailByTaskId } from '@/api/base.ts'
import PeopeleSelect from '@/components/PeopeleSelect.vue'


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

const isApprovalModalVisible = ref(false);

const attachmentList = computed((): AttachmentFile[] => {
  if (!details.value?.fDocuments) return [];
  return JSON.parse(details.value.fDocuments);
});

// --- 事件处理 ---
const handleGoBack = () => {
  router.back();
};

// --- 工具函数 ---
const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);

  return date.toLocaleDateString('zh-CN');
};

// 获取问题详情
const getProblemDetailData = async () => {
  try {
    loading.value = true;
    const response = await getProblemDetails(
      {
        id: route.query.id,
        procInstId: route.query.procInstId
      }
    );

    if (response.success) {
      details.value = response.data;

    } else {
      ElMessage.error('获取详情失败');
    }

  } catch (err) {
    ElMessage.error('失误：', err);
  } finally {
    loading.value = false;
  }
};

// 提交组件
const submitComponent = ref<InstaneType<typeof SubmitComponent> | null>(null)

const nodeId = ref('')

// 打开弹窗
const openApprovalModal = (id?: string) => {
  isApprovalModalVisible.value = true;
  submitComponent.value?.init(id);
  nodeId.value = id
};

const handleModalConfirm = (submitData: { executors: { id: string, name: string }, opinion: string }) => {
  submit(submitData)
};



// 提交研判
const submit = async (submitData: { executors: { id: string, name: string }, opinion: string }) => {
  // 提交数据
  let submitForm = {}

  if(route.query.taskId) {
    const DoNextParamExtObject =  {
      "nodeUsers": JSON.stringify([{nodeId: nodeId.value, executors: [{...submitData.executors}]}]),
      "account": "admin",
      "taskId": route.query.taskId,
      "actionName": "agree",
      "opinion": submitData.opinion,
      "formType": "inner",
      "jumpType": "select",
      "destination": nodeId.value,
      "opinionFiles": [],
      "formName": ""
    }

    submitForm = { ...details.value , DoNextParamExtObject: DoNextParamExtObject }
  } else {
    const startFlowParamObject =  {
      account: "admin",
      defId: "2490000000310172",
      nodeUsers: JSON.stringify([{nodeId: 'UserTask2', executors: [{...submitData.executors}]}]),
      subject: "问题标题",
      destination: 'UserTask2',
      formName: "【提交工单】"
    }

    submitForm = { ...details.value , startFlowParamObject: startFlowParamObject }
  }

  try {
    loading.value = true
    const response = await problemWarehouseCommit(submitForm)

    if(response.code === 200) {
      ElMessage.success('提交成功');
      router.push({ name: 'super-agency' });
    } else {
      ElMessage.error('保存失败');
    }
  } catch (e) {
    console.error('提交失败', e)
  } finally {
    loading.value = false;
  }
}

/*------流程图组件------*/
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

// 流程按钮类型
interface ExtractedBtn {
  nodeId: string,
  nodeName: string,
}

const extractedBtnList = ref<ExtractedBtn[]>([])

// 根据流程ID获取流程
const getProcessByTaskId = async () => {
  if(!route.query.taskId) return

  const taskId = route.query.taskId

  try {
    const response = await getTaskHandleDetailByTaskId(taskId)

    if (response.outcomeUserMap) {
      const extractedData = Object.keys(response.outcomeUserMap).map(key => {
        return {
          nodeId: key,
          nodeName: response.outcomeUserMap[key].nodeName
        };
      });

      extractedBtnList.value = extractedData
    }

  } catch (e) {
    console.error('获取流程按钮失败', e)
  }
}

// --- 生命周期 ---
onMounted(() => {
  getProblemDetailData();
  getProcessByTaskId();
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
