import type { PageResult } from '../types.ts'

// 问题的数量统计
export interface ProblemCountData {
  AllCount: number;
  runningCount: number;
  noCommitCount: number;
  endCount: number;
}

// 单个问题的数据项类型
export interface ProblemItem {
  id: string;
  fWorkNo: string;
  fAdviceTime: number;
  fCharger: string;
  fProblemDescription: string;
}

// 问题列表返回值
export interface ProblemListResponse {
  pageResult: PageResult;
  rows: ProblemItem[];
  total: number;
}

// 列表接口的查询参数类型
export interface ProblemListParams {
  page: number;
  rows: number;
  sort: string;
  order: 'asc' | 'desc';
  status?: '' | '1' | '2' | '3';
  keyword?: string;
  problemType?: string;
  // 日期范围参数
  'Q^pw.F_DISCOVER_TIME^DL'?: string;
  'Q^pw.F_DISCOVER_TIME^DG'?: string;
  'Q^pw.F_ENTRY_TIME^DL'?: string;
  'Q^pw.F_ENTRY_TIME^DG'?: string;
  // 部门参数
  'Q^pw.F_INSPECTION_DEPT^SL'?: string;
  'Q^pw.F_INSPECTION_DEPT_ID^SL'?: string;
  'Q^pw.F_DEPT_SUBJECT_INSPECTION^SL'?: string;
  'Q^pw.F_DEPT_SUBJECT_INSPECTION_ID^SL'?: string;
}

// 新增问题库
export interface ProblemSavePayload {
  // --- 表单中存在的字段 ---
  fDiscoverTime: string;
  fProblemType: string;
  fProblemSource: string;
  fInspectionItems: string;
  fProblemDescription: string;
  fInspectionDept: string;
  fDeptSubjectInspection: string;
  fIsCommit: '0' | '1';
  fLeader: string;
  fAdviceTime: string;
  fIsIllegal: '0' | '1';
  fIsAssetTransfer: '0' | '1';
  fOtherAdvice: string;
  fDocuments: string;
  // 检查部门ID
  fInspectionDeptId?: string;
  // 被检查部门ID
  fDeptSubjectInspectionId?: string;

  // --- 表单中不存在的字段 ---
  id?: string;
  fWorkNo?: string;
  fEntryTime?: string;
  fProposer?: string;
  fProposerId?: string;
  fLeaderId?: string;
  fCharger?: string;
  fChargerId?: string;
}

// 接口返回类型
export interface ProblemDetail {
  id: string;
  refId: string;
  fDiscoverTime: string;
  fEntryTime: string;
  fAdviceTime: string;
  fInspectionDept: string;
  fInspectionDeptId: string;
  fDeptSubjectInspection: string;
  fDeptSubjectInspectionId: string;
  fInspectionItems: string;
  fProblemDescription: string;
  fProblemSource: string;
  fProblemType: string;
  fDocuments: string;
  fIsIllegal: string;
  fIsAssetTransfer: string;
  fIsCommit: string;
  fOtherAdvice: string;
  fProposer: string;
  fProposerId: string;
  fLeader: string;
  fLeaderId: string;
  fCharger: string;
  fChargerId: string;
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
export interface ProblemDetailWithStartFlow extends ProblemDetail {
  startFlowParamObject: startFlowParamObject;
}

// 待办列表
export interface PendingListParams {
  page: number;
  rows: number;
  sort: string;
  order: 'asc' | 'desc';

  'Q^subject_^SL'?: string;
  'Q^PROC_DEF_NAME_^SL': string;
}

// 待办单个数据类型
export interface PendingListItem {
  id: string;
  subject: string;
  procDefName: string;
  arrivalTime: string;
  assignee: string;
  currentStep: string;
}

// 待办列表返回
export interface PendingListResponse {
  pageResult: PageResult;
  rows: PendingListItem[];
  total: number;
}
