// 通用api类型
import type { PageResult } from '../types.ts'

// 台账搜索参数
export interface LedgerListParams {
  // --- 表单上的字段 ---
  fSuperviseItems: string;
  fSuperviseType: string;
  fSuperviseSource: string;
  fRectifyDept: string;
  fSuperviseDept: string;
  fEntryTime: number;

  // --- 其他字段 ---
  id?: string;
  refId?: string;
  fWorkNo?: string;
  fProblemDescription?: string;
  fConnectionBook?: string;
  fDocuments?: string;
  fRectifyMeasure?: string;
  fRectifyResult?: string;
  fOtherAdvice?: string;
  fIsAssetTransfer?: 0 | 1;
  fIsCommit?: 0 | 1;
  fIsIllegal?: 0 | 1;
  fSuperviseStatus?: number;
  fRectifyStatus?: number;
  fOverallScore?: number;
  fRectifyEndtime?: number;
  fRectifyPlantime?: number;
  fRectifyStarttime?: number;
  fRectifyTotalDuration?: number;
  fRectifyUpdatetime?: number;
  fSuperviseUser?: string;
  fSuperviseUserId?: string;
  fSuperviseDeptId?: string;
  fRectifyUser?: string;
  fRectifyUserId?: string;
  fRectifyDeptId?: string;
  fProcInstId?: string;
}

// 台账搜索返回
export interface LedgerListItem {
  id: string;
  refId: string;
  fWorkNo: string;
  fSuperviseItems: string;
  fProblemDescription: string;
  fSuperviseType: string;
  fSuperviseSource: string;
  fSuperviseUser: string;
  fSuperviseUserId: string;
  fSuperviseDept: string;
  fSuperviseDeptId: string;
  fRectifyUser: string;
  fRectifyUserId: string;
  fRectifyDept: string;
  fRectifyDeptId: string;
  fConnectionBook: string;
  fDocuments: string;
  fRectifyMeasure: string;
  fRectifyResult: string;
  fOtherAdvice?: string;
  fIsAssetTransfer: 0 | 1;
  fIsCommit: 0 | 1;
  fIsIllegal: 0 | 1;
  fSuperviseStatus: number;
  fRectifyStatus: number;
  fOverallScore: number;
  fRectifyEndtime: number;
  fRectifyPlantime: number;
  fRectifyStarttime: number;
  fRectifyTotalDuration: number;
  fRectifyUpdatetime: number;
  fProcInstId: string;
}

// 台账列表返回值
export interface ProblemListResponse {
  pageResult: PageResult;
  rows: LedgerListItem[];
  total: number;
}

// 台账表单参数
export interface LedgerFormData {
  // --- 表单中存在的字段 (必填) ---
  fSuperviseItems: string;
  fProblemDescription: string;
  fConnectionBook: string;
  fSuperviseType: string;
  fSuperviseSource: string;
  fRectifyDept: string;
  fRectifyDeptId: string;
  fRectifyUser: string;
  fRectifyUserId: string;
  fSuperviseUser: string;
  fSuperviseUserId: string;
  fRectifyPlantime: number | string; // 计划整改时间 (时间选择器可能绑定字符串或时间戳)
  fIsIllegal: 0 | 1;
  fIsAssetTransfer: 0 | 1;
  fDocuments: string; // 佐证材料

  // --- 表单中不存在的字段 (可选) ---
  id?: string;
  refId?: string;
  fWorkNo?: string;
  fIsCommit?: 0 | 1;
  fOverallScore?: number;
  fProcInstId?: string;
  fRectifyEndtime?: number;
  fRectifyMeasure?: string;
  fRectifyResult?: string;
  fRectifyStarttime?: number;
  fRectifyStatus?: number;
  fRectifyTotalDuration?: number;
  fRectifyUpdatetime?: number;
  fSuperviseDept?: string;
  fSuperviseDeptId?: string;
  fSuperviseStatus?: number;
  fRemarkA?: string;
  fRemarkB?: string;
  fRemarkC?: string;
}

// 台账详情参数
export interface RectificationRecord {
  id: string;
  refId: string;
  fDocuments: string;
  fUpdateContent: string;
  fUpdateTime: number;
  fUpdater: string;
  fUpdaterDept: string;
  fUpdaterDeptId: string;
  fUpdaterId: string;
}

// 更新进展
export interface ProgressUpdatePayload {
  refId: string;
  fUpdateContent: string;
  fDocuments: string;
}

// 更新进展列表查询参数
export interface RectProcessListParams {
  page: number;
  rows: number;
  sort: string;
  order: 'asc' | 'desc';

  'Q^REF_ID_^SL'?: string;
  'Q^F_UPDATE_TIME^DG'?: string;
  'Q^F_UPDATE_CONTENT^SL'?: string;
  'Q^F_DOCUMENTS^SL'?: string;
  'Q^F_UPDATER_DEPT^SL'?: string;
  'Q^F_UPDATER_DEPT_ID^SL'?: string;
  'Q^F_REMARK_A^SL'?: string;
  'Q^F_REMARK_B^SL'?: string;
  'Q^F_REMARK_C^SL'?: string;
}

// 更新进展接口返回项
export interface RectProcessItem {
  id: string;
  refId: string;
  fDocuments: string;
  fUpdateContent: string;
  fUpdateTime: number;
  fUpdater: string;
  fUpdaterDept: string;
  fUpdaterDeptId: string;
  fUpdaterId: string;
  fRemarkA: string;
  fRemarkB: string;
  fRemarkC: string;
}

// 更新进展返回
export interface RectProcessListResult {
  pageResult: PageResult;
  rows: RectProcessItem[];
  total: number;
}

// 监督评价
export interface EvaluationPayload {
  refId: string;
  fEvaluateScore: number;
  fEvaluateContent: string;
}

// 下一环节类型
export interface DoNextParam {
  nodeUsers: string;
  account: string;
  taskId: string;
  actionName: string;
  opinion: string;
  formType: string;
  jumpType: string;
  destination: string;
  opinionFiles: string[];
  formName: string;
}

// 人员数组类型
export interface NodeUser {
  nodeId: string;
  executors: Executor[];
}

// 执行者类型
export interface Executor {
  id: string;
  type: 'user';
  name: string;
}

// 起始环节类型
export interface startFlowParamObject {
  account: string;
  nodeUsers: string;
  defId: string;
  subject: string,
  destination: string;
  formName: string;
}

// 流程开始类型
export interface ProblemDetailWithStartFlow extends LedgerFormData {
  startFlowParamObject: startFlowParamObject;
}
