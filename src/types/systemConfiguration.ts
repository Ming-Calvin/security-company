// 通用api类型
import type { PageResult } from './base.ts'

// 字段配置查询参数
export interface SuperviseFieldListParams {
  'Q^FIELD_NAME^SL'?: string; // 字段名称
  'Q^FIELD_ALIAS^SL'?: string;
  'Q^FIELD_TYPE^SL'?: string;
  'Q^FIELD_VALUE^SL'?: string;
  'Q^FIELD_RANGE^SL'?: string;
}

// 字段配置查询参数查询参数
export interface SuperviseFieldItem {
  id: string;
  refId: string;
  fEvaluateContent?: string;
  fEvaluateScore?: number;
  fEvaluateTime?: number;
  fEvaluater?: string;
  fEvaluaterDept?: string;
  fEvaluaterDeptId?: string;
  fEvaluaterId?: string;
  fRemarkA?: string;
  fRemarkB?: string;
  fRemarkC?: string;
}

// 字段配置查询返回只
export interface ListResponseData {
  pageResult: PageResult;
  rows: SuperviseFieldItem[];
  total: number;
}
