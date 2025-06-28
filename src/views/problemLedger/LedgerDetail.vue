<template>
  <div p-4>
    <el-card class="details-card">
      <template #header>
        <div class="card-header">
          <el-page-header @back="handleGoBack"
                          class="page-header-title">
            <template #content>
              <span class="font-bold">督办详情</span>
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
            <el-button @click="isFlowModalVisible = true">流程图</el-button>
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
            <el-descriptions-item label="监督事项" :span="3">
              {{ details.fSuperviseItems }}
            </el-descriptions-item>

            <el-descriptions-item label="事项内容" :span="3">
              {{ details.fProblemDescription }}
            </el-descriptions-item>

            <el-descriptions-item label="关联台账" :span="3">
              <div class="link-list">
                <el-link v-for="book in details.relatedBooks"
                         :key="book.id"
                         type="primary"
                         @click="viewBook(book.id)">
                  {{ book.name }}
                </el-link>
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
              <div v-for="(file, index) in details.attachments"
                   :key="index"
                   class="attachment-item">
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

            <el-table-column prop="fUpdateContent"
                             label="更新进展内容"
                             min-width="250"
                             show-overflow-tooltip />

            <div class="attachment-section">
              <span class="attachment-label">佐证材料:</span>
              <div class="attachment-list">
                <div v-for="(file, index) in details.attachments"
                     :key="index"
                     class="attachment-item">
                  <el-icon><Document /></el-icon>
                  <span class="file-name">{{ file.name }}</span>
                  <span class="file-size">{{ file.size }}</span>

                  <el-button link type="primary" :icon="Download" class="download-btn" />
                </div>
              </div>
            </div>
          </el-table>
        </div>

        <div class="section">
          <div class="section-header">
            <el-icon color="#409eff"><WarningFilled /></el-icon>
            <h3 class="section-title">监督与评价</h3>
          </div>

          <el-table :data="evaluationList" border>

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

            <el-table-column prop="fEvaluateScore"
                             label="整改评分"
                             width="120"
                             align="center" />

            <el-table-column prop="fEvaluateContent"
                             label="整改成效"
                             min-width="300"
                             show-overflow-tooltip />

          </el-table>
        </div>
      </div>
    </el-card>
  </div>

  <UpdateProgressModal v-if="isModalVisible"
                       v-model="isModalVisible"
                       :record-id="currentRecordId"
                       @success="getRectProcessData" />

  <EvaluationModal v-if="isEvaluationModalVisible"
                   v-model="isEvaluationModalVisible"
                   :record-id="currentRecordId"
                   @success="getRectEvaluationData" />

  <SubmitComponent ref="SubmitComponentRef"
                   v-if="isApprovalModalVisible"
                   v-model="isApprovalModalVisible"
                   @confirm="handleModalConfirm" />

  <FlowChartModal v-if="isFlowModalVisible"
                  v-model="isFlowModalVisible"
                  :nodes="complexNodes"
                  :edges="complexEdges"
                  title="监督台账"
  />
</template>

<script setup lang="ts">
// vue
import { ref, onMounted, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router'

// el-plus
import { InfoFilled, SuccessFilled, Document, Download, WarningFilled } from '@element-plus/icons-vue';

// api
import { getRectEvaluationList, getRectificationRecordById, getRectProcessList, rectificationBookCommit } from '@/api/problemLedger.ts'
import { getNodeSet, getTaskHandleDetailByTaskId } from '@/api/base.ts'
import type { Attachment, ProblemDetails } from '@/types/problemLedger.ts'

// 更新进展组件
import UpdateProgressModal from './UpdateProgressModal.vue';
// 评价组件
import EvaluationModal from '../submitComponent/EvaluationModal.vue';
// 流程图组件
import FlowChartModal from '@/components/FlowChartModal.vue';
import type { Node, Edge } from '@vue-flow/core';
// 提交组件
import SubmitComponent from '@/components/SubmitComponent.vue'
import type { ExtractedBtn } from '@/types/base.ts'

// =========== 路由 ===========
const router = useRouter();
const route = useRoute();

// =========== 头部 ===========
// 返回上一页
const handleGoBack = () => {
  router.push({ name: 'super-agency', query: { activeMenu: '监督台账' } });
};

const extractedBtnList = ref<ExtractedBtn[]>([])

// 获取展示按钮
const getExtractedBtnList = async () => {
  const params = {
    defId: "2490000000690023",
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
        buttonName: item.name,
      }
    })

    console.log(extractedBtnList, 'extractedBtnList')
  } catch (e) {
    console.error(e)
  }
}

// =========== 表单 ===========
const loading = ref(true);
const details = ref<ProblemDetails>({} as ProblemDetails);
const currentRecordId = route.query.id || route.query.taskId

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

// 时间转换函数
const formatTimestamp = (timestamp: number) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 关联台账
const viewBook = (id: string) => {
  // 跳转相关台账页
};

// =========== 更新进展 ===========
// 更新进展列表
const progressList = ref([])

// 弹框
const isModalVisible = ref(false);
const openUpdateDialog = () => {
  isModalVisible.value = true;
}

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

// =========== 评价 ===========
// 评价列表
const evaluationList = ref([])

// 弹框
const isEvaluationModalVisible = ref(false);
const openEvaluationModal = () => {
  isEvaluationModalVisible.value = true;
}

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

// =========== 流程图 ===========
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


// =========== 提交 ===========
const isApprovalModalVisible = ref(false);

// 提交组件
const SubmitComponentRef = ref<InstanceType<typeof SubmitComponent> | null>(null)

const currentNodeBtnData = ref('')

// 打开弹窗
const openApprovalModal = async (item: ExtractedBtn) => {
  if(item.buttonName === '更新进展') {
    openUpdateDialog()
    return
  }

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
        defId: "2490000000690023",
        nodeUsers: JSON.stringify([{ nodeId: 'UserTask2', executors: executorsToSubmit }]),
        subject: "问题标题",
        destination: 'UserTask2',
        formName: "【提交工单】"
      }
    };
  }

  try {
    loading.value = true;
    const response = await rectificationBookCommit(submitForm);

    if (response.code === 200) {
      ElMessage.success(response.msg || '提交成功');
      router.push({ name: 'super-agency', query: { activeMenu: '监督台账' } });
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

provide('ledgerDetailData', details);

// --- 生命周期 ---
onMounted(() => {
  getLedgerDetailData();
  getRectProcessData();
  getRectEvaluationData();
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
