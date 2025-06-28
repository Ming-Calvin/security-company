import type { PageResult } from './base.ts'

// 问题的数量统计
export interface ProblemCountData {
  AllCount: number;
  runningCount: number;
  noCommitCount: number;
  endCount: number;
}

// Tab数据结构
export interface ProblemCountTab {
  label: string;
  name: string;
  count: number;
  apiKey: keyof ProblemCountData;
}

// 展示表格项
export interface ProblemTableItem {
  id: string; // 问题ID
  fInspectionDept: string; // 检查部门
  fDeptSubjectInspection: string; // 被检查部门
  fInspectionItems: string; // 检查事项
  fDiscoverTime: number; // 发现问题时点
  fProblemDescription: string; // 问题描述
  fProblemType: string; // 问题类型
  fIsIllegal: 0 | 1; // 是否涉嫌违规 (1: 是, 0: 否)
  fEntryTime: number; // 录入时间
  fProposerTime?: number; // 提出时间
  fAdviceTime: number; // 建议整改时点
  fIsCommit: 0 | 1; // 是否提交研判 (1: 是, 0: 否)
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
  status?: string;
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
  fDiscoverTime: string;            // 发现问题时间
  fProblemType: string;             // 问题类型
  fProblemSource: string;           // 问题来源
  fInspectionItems: string;         // 检查事项
  fProblemDescription: string;      // 问题描述
  fInspectionDept: string;          // 检查部门
  fDeptSubjectInspection: string;   // 被检查部门
  fIsCommit: 0 | 1 | string;    // 是否提交 (0:否, 1:是)
  fLeader: string;                  // 研判领导
  fLeaderId: string;                // 研判领导ID
  fAdviceTime: string | Date;              // 整改建议时间
  fIsIllegal: 0 | 1 | string;   // 是否违规 (0:否, 1:是)
  fIsAssetTransfer: 0 | 1 | string;      // 是否涉及资产移交 (0:否, 1:是)
  fOtherAdvice: string;             // 其他建议
  fDocuments: string;               // 佐证材料
  fInspectionDeptId?: string;       // 检查部门ID
  fDeptSubjectInspectionId?: string; // 被检查部门ID

  // --- 表单中不存在的字段 ---
  id?: string;                        // 主键ID
  fWorkNo?: string;                   // 工单号 (自动生成)
  fEntryTime?: string;                // 录入时间
  fProposer?: string;                 // 提出人
  fProposerId?: string;               // 提出人ID
  fCharger?: string;                  // 整改责任人
  fChargerId?: string;                // 整改责任人ID
}

// 接口返回类型
export interface ProblemDetail {
  id: string;
  refId: string;
  fDiscoverTime: number | undefined;
  fEntryTime: string;
  fAdviceTime: number | undefined;
  fInspectionDept: string;
  fInspectionDeptId: string;
  fDeptSubjectInspection: string;
  fDeptSubjectInspectionId: string;
  fInspectionItems: string;
  fProblemDescription: string;
  fProblemSource: string;
  fProblemType: string;
  fDocuments: string;
  fIsIllegal: 0 | 1 | string;
  fIsAssetTransfer: 0 | 1 | string;
  fIsCommit: 0 | 1 | string;
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

// 问题详情参数
export interface ProblemDetailsParams {
  id?: string;
  procInstId?: string;
}

// 保存问题库返回
export interface ProblemDatabaseSaveResponse {
  code: number;
  msg: string;
  data: string;
}

// 附件类型
export interface AttachmentFile {
  name: string;
  size: string;
  url: string;
}
