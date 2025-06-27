// 通用api类型
import type { PageResult } from './base.ts'

// 字段参数
export interface SuperviseField {
  id: string;        // ID
  fieldAlias: string; // 字段别名
  fieldName: string;  // 字段名称
  fieldRange: string; // 所属功能
  fieldType: string;  // 字段格式
  fieldValue: string; // 字段值
  updateTime?: string;// 更新时间
}

// 字段值信息
export interface FieldValueItem {
  value: string;
  allowEdit: boolean;
}

// 字段查询参数
export interface FieldQueryParameters {
  fieldName?: string;    // 字段名称
  fieldAlias?: string;   // 字段别名
  fieldType?: string;    // 字段格式
  fieldValue?: string;   // 字段值
  fieldRange?: string;   // 所属功能
  page: number;         // 当前页码
  rows: number;         // 每页行数
  sort?: string;         // 排序字段
  order?: string;        // 排序顺序
}

// 字段列表返回
export interface SuperviseFieldResult {
  pageResult: PageResult,
  rows: SuperviseField[];
  total: number
}
