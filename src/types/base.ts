// 通用api类型

// API标准返回
export interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
  success: boolean;
}

// 分页结果类型
export interface PageResult {
  endRow: number;
  firstPage: boolean;
  hasNextPage: boolean;
  hasPrePage: boolean;
  lastPage: boolean;
  limit: number;
  nextPage: number;
  offset: number;
  page: number;
  prePage: number;
  slider: number[];
  startRow: number;
  totalCount: number;
  totalPages: number;
}

/*------人员选择器------*/
// 树形传参
export interface PeopleSelectTreeParams {
  ID_: string | null;
}

// 树形返回
export interface PeopleSelectTreeResult {
  ID_: string;
  NAME_: string;
  PARENT_ID_: string;
  isParent: 'true' | 'false';
}

// 部门选择器传参
export interface PeopleSelectDeptParams {
  page: number;
  size: number;
  deptId?: string | number;
  name?: string
}

// 人员传参
export interface PeopleSelectUserParams {
  page: number;
  size: number;
  fullname_?: string;
  ORG_PATH_?: string;
  QO_?: string;
}

// 人员返回
export interface PeopleSelectUserResult {
  ID_: string;
  fullname_: string;
  ORG_ID_: string;
  ORG_NAME_: string;
}

// 人员选择器表格返回类型
export interface PeopleSelectUserTable {
  records: number;
  rows: PeopleSelectUserResult[];
}

// 获取TaskId参数
export interface QuestionOrderTaskIdParams {
  processInstId: string;
}

// 获取TaskId返回
export interface QuestionOrderTaskIdResult {
  taskId: string;
}

// 人员字段
export interface UserInfo {
  hrId: string;
  deptId: string;
  loginName: string;
  userName: string;
  email: string;
  phonenumber: string;
  userDeptName: string;
  companyName: string;
}

// 人员参数返回
export interface GetRoleApiResponse {
  msg: string;
  code: number;
  permissions: string[];
  roles: string[];
  user: UserInfo;
}

// 附件上传返回
export interface ServerFileResponse {
  id: string;
  fileName: string;
}

// 获取当前环节按钮参数
export interface getNodeSetParams {
  defId: string;
  nodeId: string;
}

// 流程按钮类型
export interface ExtractedBtn {
  nodeId: string,
  componentName: string,
  nodeName: string,
  buttonName: string,
  type: string,
}

// 获取当前环节按钮返回
export interface getNodeSetResult {
  alias: string,
  beforeScript: string,
  name: string,
}

// 流程定义参数
interface Executor {
  id: string;
  name: string;
}
interface NodeUser {
  nodeId: string;
  executors: Executor[];
}
interface DoNextParams {
  nodeUsers: string;
  account: string;
  taskId: string;
  actionName: string;
  opinion: string;
  formType: 'inner';
  jumpType: 'select';
  destination: string;
  opinionFiles: any[];
  formName: string;
}
interface StartFlowParams {
  account: string;
  defId: string;
  nodeUsers: string; // 将是 NodeUser[] 的 JSON 字符串
  subject: string;
  destination: string;
  formName: string;
}

export type SubmitPayload = BaseDetails & ({
  DoNextParamExtObject: DoNextParams;
  startFlowParamObject?: never; // 确保两种参数对象不同时存在
} | {
  startFlowParamObject: StartFlowParams;
  DoNextParamExtObject?: never; // 确保两种参数对象不同时存在
});
