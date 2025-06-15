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
