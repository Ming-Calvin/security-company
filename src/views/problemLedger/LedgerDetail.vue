<template>
  <div class="progress-details-container">
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
            <el-button type="primary" v-if="!route.query.taskId" @click="openApprovalModal('UserTask2')">提交</el-button>
            <el-button type="primary" @click="openUpdateDialog()">更新进展</el-button>
            <el-button type="primary" @click="openEvaluationModal()">纪委评价</el-button>
<!--            <el-button>流转记录</el-button>-->
            <el-button @click="isFlowModalVisible = true">流程图</el-button>
            <el-button>编辑</el-button>
            <el-button>删除</el-button>
          </div>
        </div>
      </template>

      <div v-loading="loading">
        <div class="summary-section">
          <div class="summary-item">
            <div class="summary-label">整改状态</div>
            <div class="summary-value status-overdue">{{ details.rectifyStatusText }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">监督状态</div>
            <div class="summary-value">{{ details.superviseStatusText }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">整改耗时</div>
            <div class="summary-value">{{ details.rectifyDuration }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">总体评分</div>
            <div class="summary-value">{{ details.overallScore }}</div>
          </div>
        </div>
        <el-divider />

        <div class="section">
          <div class="section-header">
            <el-icon color="#409eff"><InfoFilled /></el-icon>
            <h3 class="section-title">基础信息</h3>
          </div>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="监督事项" :span="3">{{ details.fSuperviseItems }}</el-descriptions-item>
            <el-descriptions-item label="事项内容" :span="3">{{ details.fProblemDescription }}</el-descriptions-item>
            <el-descriptions-item label="关联台账" :span="3">
              <div class="link-list">
                <el-link v-for="book in details.relatedBooks" :key="book.id" type="primary" @click="viewBook(book.id)">{{ book.name }}</el-link>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="编号">{{ details.id }}</el-descriptions-item>
            <el-descriptions-item label="监督类型">{{ details.fSuperviseType }}</el-descriptions-item>
            <el-descriptions-item label="监督来源">{{ details.fSuperviseSource }}</el-descriptions-item>
            <el-descriptions-item label="整改责任部门">{{ details.fRectifyDept }}</el-descriptions-item>
            <el-descriptions-item label="整改责任人">{{ details.fRectifyUser }}</el-descriptions-item>
            <el-descriptions-item label="是否涉嫌违纪或职务违法等问题">{{ details.fIsIllegal ? '是' : '否' }}</el-descriptions-item>
            <el-descriptions-item label="监督责任部门">{{ details.fSuperviseDept }}</el-descriptions-item>
            <el-descriptions-item label="监督责任人">{{ details.fSuperviseUser }}</el-descriptions-item>
            <el-descriptions-item label="是否可能造成国有资产流失、资金转移等重大风险">{{ details.fIsAssetTransfer ? '是' : '否' }}</el-descriptions-item>
          </el-descriptions>
          <div class="attachment-section">
            <span class="attachment-label">佐证材料:</span>
            <div class="attachment-list">
              <div v-for="(file, index) in details.attachments" :key="index" class="attachment-item">
                <el-icon><Document /></el-icon>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ file.size }}</span>
                <el-button link type="primary" :icon="Download" class="download-btn" />
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <el-icon color="#67c23a"><SuccessFilled /></el-icon>
            <h3 class="section-title">整改情况</h3>
          </div>
          <el-descriptions :column="3">
            <el-descriptions-item label="整改举措" :span="3">{{ details.fRectifyMeasure }}</el-descriptions-item>
            <el-descriptions-item label="整改时限">{{ formatTimestamp(details.fRectifyPlantime) }}</el-descriptions-item>
            <el-descriptions-item label="整改启动时间">{{ formatTimestamp(details.fRectifyStarttime) }}</el-descriptions-item>
            <el-descriptions-item label="整改完成时间">{{ formatTimestamp(details.fRectifyEndtime) }}</el-descriptions-item>
          </el-descriptions>

          <el-table :data="progressList" style="width: 100%" border>
            <el-table-column label="更新人" width="180">
              <template #default="scope">
                <span>{{ scope.row.fUpdater }}</span>
              </template>
            </el-table-column>

            <el-table-column label="更新时间" width="180">
              <template #default="scope">
                <span>{{ formatTimestamp(scope.row.fUpdateTime, 'datetime') }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="fUpdateContent" label="更新进展内容" min-width="250" show-overflow-tooltip />

            <el-table-column label="佐证材料" min-width="300">
              <template #default="scope">
                <div class="attachment-list">
                  <el-link
                    v-for="(file, index) in scope.row.attachments"
                    :key="index"
                    :href="file.url"
                    target="_blank"
                    type="primary"
                    :icon="Document"
                  >
                    {{ file.name }}
                  </el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="section">
          <div class="section-header">
            <el-icon color="#409eff"><WarningFilled /></el-icon>
            <h3 class="section-title">监督与评价</h3>
          </div>

          <el-table :data="evaluationList" style="width: 100%" border>

            <el-table-column label="评价人" width="220">
              <template #default="scope">
                <span>{{ scope.row.fEvaluater }}</span>
              </template>
            </el-table-column>

            <el-table-column label="时间" width="180">
              <template #default="scope">
                <span>{{ formatTimestamp(scope.row.fEvaluateTime) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="fEvaluateScore" label="整改评分" width="120" align="center" />

            <el-table-column prop="fEvaluateContent" label="整改成效" min-width="300" show-overflow-tooltip />

          </el-table>
      </div>
      </div>
    </el-card>
  </div>

  <UpdateProgressModal
    v-if="isModalVisible"
    v-model="isModalVisible"
    :record-id="currentRecordId"
    @success="handleProgressSuccess"
  />

  <EvaluationModal
    v-if="isEvaluationModalVisible"
    v-model="isEvaluationModalVisible"
    :record-id="currentRecordId"
    @success="handleEvaluationSuccess"
  />

  <SubmitComponent
    ref="submitComponent"
    v-if="isApprovalModalVisible"
    v-model="isApprovalModalVisible"
    @confirm="handleModalConfirm"
  />

  <FlowChartModal
    v-if="isFlowModalVisible"
    v-model="isFlowModalVisible"
    :nodes="complexNodes"
    :edges="complexEdges"
    title="完整业务流程"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { InfoFilled, SuccessFilled, Document, Download, WarningFilled } from '@element-plus/icons-vue';
import {
  getRectEvaluationList,
  getRectificationRecordById,
  getRectProcessList,
  rectificationBookCommit
} from '@/api/problemLedger.ts'
import { getTaskHandleDetailByTaskId } from '@/api/base.ts'

// 更新进展组件
import UpdateProgressModal from './UpdateProgressModal.vue';
// 评价组件
import EvaluationModal from './EvaluationModal.vue';
// import type { RectProcessListParams } from '@/services/api/problemLedger/problemDatabase.ts'

import FlowChartModal from '@/components/FlowChartModal.vue';
import type { Node, Edge } from '@vue-flow/core';
import SubmitComponent from '@/components/SubmitComponent.vue'

// 更新进展列表
const progressList = ref([])
// 评价列表
const evaluationList = ref([])


// --- 类型定义 ---
interface Attachment {
  name: string;
  size: string;
  url: string;
}

interface FullProblemDetails {
  // 顶部摘要
  rectifyStatusText: string;
  superviseStatusText: string;
  rectifyDuration: string;
  overallScore: string | number;

  // 基础信息
  fSuperviseItems: string;
  fProblemDescription: string;
  relatedBooks: { id: string, name: string }[];
  id: string;
  fSuperviseType: string;
  fSuperviseSource: string;
  fRectifyDept: string;
  fRectifyUser: string;
  fIsIllegal: 0 | 1;
  fSuperviseDept: string;
  fSuperviseUser: string;
  fIsAssetTransfer: 0 | 1;
  attachments: Attachment[];

  // 整改情况
  fRectifyMeasure: string;
  fRectifyPlantime: number;
  fRectifyStarttime: number;
  fRectifyEndtime: number;
}


// --- 响应式状态 ---
const router = useRouter();
const route = useRoute();
const loading = ref(true);
const details = ref<FullProblemDetails>({} as FullProblemDetails);


// 获取问题详情
const getLedgerDetailData = async () => {

  try {
    loading.value = true;
    const response = await getRectificationRecordById({
      id: route.query.id,
      procInstId: route.query.procInstId
    });

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

// 获取更新进展详情
const getRectProcessData = async () => {
  const queryParams: RectProcessListParams = {
    page: 1,
    rows: 10,
    order: 'asc',
    "Q^REF_ID_^SL": route.query.id || route.query.taskId
  }

  try {
    loading.value = true;
    const response = await getRectProcessList(queryParams);

    if (response.success) {
      progressList.value = response.data.rows

    } else {
      ElMessage.error('获取更新进展详情失败');
    }
  } catch (err) {
    ElMessage.error('失误：', err);
  } finally {
    loading.value = false;
  }
};

// 获取监督评价详情
const getRectEvaluationData = async () => {
  const queryParams: RectProcessListParams = {
    page: 1,
    rows: 10,
    order: 'asc',
    "Q^REF_ID_^SL": route.query.id || route.query.taskId
  }

  try {
    loading.value = true;
    const response = await getRectEvaluationList(queryParams);

    if (response.success) {
      evaluationList.value = response.data.rows

    } else {
      ElMessage.error('获取监督评价详情失败');
    }
  } catch (err) {
    ElMessage.error('失误：', err);
  } finally {
    loading.value = false;
  }
};

// --- 工具函数 ---
const formatTimestamp = (timestamp: number) => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleDateString('zh-CN');
};

// --- 事件处理 ---
const handleGoBack = () => router.back();
const viewBook = (id: string) => alert(`跳转到台账详情: ${id}`);

// --- 更新进展 ---
// 当前记录ID
const currentRecordId = route.query.id || route.query.taskId
const isModalVisible = ref(false);

const openUpdateDialog = () => {
  isModalVisible.value = true;
}

// --评价--
const isEvaluationModalVisible = ref(false);
const openEvaluationModal = () => {
  isEvaluationModalVisible.value = true;
}

// 整改更新
const handleProgressSuccess = () => {
  getRectProcessData();
};

// 评价更新
const handleEvaluationSuccess = () => {
  getRectEvaluationData();
}

/*------流程图------*/
const isFlowModalVisible = ref(false);

const complexNodes = ref<Node[]>([
  // 第一排
  { id: 'start', type: 'input', label: '系统生成台账', position: { x: 950, y: 0 } },
  // 第二排 (主流程)
  { id: 'confirm', label: '监督责任部门经理确认监督来源和监督类型', position: { x: 600, y: 150 } },
  { id: 'pending_start', label: '待启动', position: { x: 350, y: 150 } },
  { id: 'rectifying', label: '整改中 (整改责任人)', position: { x: 0, y: 150 } },
  // 第三排 (评价流程)
  { id: 'rectify_dept_eval', label: '整改部门经理评价', position: { x: 0, y: 450 } },
  { id: 'rectify_leader_eval', label: '整改责任部门分管领导评分', position: { x: 250, y: 450 } },
  { id: 'supervise_dept_eval', label: '监督部门经理评价', position: { x: 500, y: 450 } },
  { id: 'supervise_leader_eval', label: '分管领导评价', position: { x: 750, y: 450 } },
  { id: 'end', type: 'output', label: '结束', position: { x: 1000, y: 450 } },
]);

const complexEdges = ref<Edge[]>([
  // 主流程
  { id: 'e-start-confirm', source: 'start', target: 'confirm', type: 'smoothstep' },
  { id: 'e-confirm-pending', source: 'confirm', target: 'pending_start', type: 'smoothstep', label: '确认提交' },
  { id: 'e-pending-rectifying', source: 'pending_start', target: 'rectifying', type: 'smoothstep', label: '启动整改' },
  // 评价流程
  { id: 'e-rectifying-eval', source: 'rectifying', target: 'rectify_dept_eval', type: 'smoothstep', label: '整改完成' },
  { id: 'e-rectify-dept-leader', source: 'rectify_dept_eval', target: 'rectify_leader_eval', type: 'smoothstep' },
  { id: 'e-rectify-leader-supervise', source: 'rectify_leader_eval', target: 'supervise_dept_eval', type: 'smoothstep' },
  { id: 'e-supervise-dept-leader', source: 'supervise_dept_eval', target: 'supervise_leader_eval', type: 'smoothstep', label: '评价通过' },
  { id: 'e-supervise-leader-end', source: 'supervise_leader_eval', target: 'end', type: 'smoothstep', label: '评分通过' },
  // // 退回连线
  // { id: 'e-rectifying-pending', source: 'rectifying', target: 'pending_start', type: 'smoothstep', label: '退回责任人, 重新整改', sourceHandle: 'top', targetHandle: 'top' },
  // { id: 'e-supervise-leader-confirm', source: 'supervise_leader_eval', target: 'confirm', type: 'smoothstep', label: '退回责任人, 重新整改', sourceHandle: 'top', targetHandle: 'top' },
  // // 退回上一步
  // { id: 'e-rectify-leader-back', source: 'rectify_leader_eval', target: 'rectify_dept_eval', type: 'smoothstep', label: '退回上一步', sourceHandle: 'bottom', targetHandle: 'bottom' },
  // { id: 'e-supervise-leader-back', source: 'supervise_leader_eval', target: 'supervise_dept_eval', type: 'smoothstep', label: '退回上一步', sourceHandle: 'bottom', targetHandle: 'bottom' },
]);


/*------提交------*/

const isApprovalModalVisible = ref(false);
// 提交组件
const submitComponent = ref<InstanceType<typeof SubmitComponent> | null>(null)

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
      defId: "2490000000690023",
      nodeUsers: JSON.stringify([{nodeId: 'UserTask2', executors: [{...submitData.executors}]}]),
      subject: "问题标题",
      destination: 'UserTask2',
      formName: "【提交工单】"
    }

    submitForm = { ...details.value , startFlowParamObject: startFlowParamObject }
  }

  try {
    loading.value = true
    const response = await rectificationBookCommit(submitForm)

    if(response.code === 200) {
      ElMessage.success('提交成功');
      router.push({ name: 'super-agency', query: { activeMenu: '监督台账' } });
    } else {
      ElMessage.error('保存失败');
    }
  } catch (e) {
    console.error('提交失败', e)
  } finally {
    loading.value = false;
  }
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
  getLedgerDetailData();
  getRectProcessData();
  getRectEvaluationData();
  getProcessByTaskId();
});
</script>

<style scoped lang="scss">
.progress-details-container {
  padding: 24px;
}

:deep(.el-card__header) {
  padding: 16px 24px;
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
.page-title {
  font-size: 18px;
  font-weight: 600;
}

.summary-section {
  display: flex;
  gap: 48px;
  padding: 16px 8px;
  .summary-item {
    .summary-label {
      color: #909399;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .summary-value {
      font-size: 16px;
      font-weight: 500;
    }
    .status-overdue {
      color: #f56c6c;
    }
  }
}

.section {
  margin-top: 24px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-section {
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding-left: 10px;
  gap: 16px;
}
.attachment-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
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
  padding: 4px 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  .file-name {
    font-size: 14px;
  }
  .file-size {
    font-size: 12px;
    color: #909399;
  }
  .download-btn {
    margin-left: 8px;
  }
}

:deep(.el-descriptions__label) {
  color: #909399;
}
</style>
