import request from '../services/request.ts';
import type {
  LedgerFormData,
  LedgerListParams,
  ProblemListResponse,
  RectificationRecord,
  ProgressUpdatePayload,
  RectProcessListParams,
  RectProcessListResult,
  EvaluationPayload,
  ProblemDetailWithStartFlow
} from '@/types/problemLedger.ts'
import type { ApiResponse } from '@/types/base.ts'
import type { ProblemDetailsParams } from '@/types/problemDatabase.ts'


export function getRectificationList(params: LedgerListParams) {
  return request<ApiResponse<ProblemListResponse>>({
    url: '/core/rectificationBook/rectificationBook/listJson',
    method: 'get',
    params,
  });
}

export function saveLedger(payload: LedgerFormData) {
  return request<ApiResponse<any>>({ // 假设保存后返回通用成功信息
    url: '/core/rectificationBook/rectificationBook/save',
    method: 'post',
    data: payload,
  });
}

// 获取表单详情
export function getRectificationRecordById(params: ProblemDetailsParams) {
  return request<ApiResponse<RectificationRecord>>({
    url: '/core/rectificationBook/rectificationBook/getJson',
    method: 'get',
    params
  });
}

// 获取更新进展详情
export function getRectProcessById(id: string) {
  return request<ApiResponse<RectificationRecord>>({
    url: '/core/rectProcess/rectProcess/getJson',
    method: 'get',
    params: {
      id: id
    }
  });
}

// 新增更新进展
export function updateRectProcess(data: ProgressUpdatePayload) {
  return request<ApiResponse<any>>({
    url: '/core/rectProcess/rectProcess/save',
    method: 'post',
    data,
  });
}

// 更新进展列表
export function getRectProcessList(params?: RectProcessListParams) {
  return request<ApiResponse<RectProcessListResult>>({
    url: '/core/rectProcess/rectProcess/listJson',
    method: 'get',
    params,
  });
}

// 评价列表
export function getRectEvaluationList(params?: RectProcessListParams) {
  return request<ApiResponse<RectProcessListResult>>({
    url: '/core/rectEvaluation/rectEvaluation/listJson',
    method: 'get',
    params,
  });
}

// 新增评价
export function submitEvaluation(data: EvaluationPayload) {
  return request<ApiResponse<any>>({
    url: '/core/rectEvaluation/rectEvaluation/save',
    method: 'post',
    data,
  });
}

// 发起接口
export function rectificationBookCommit(data: ProblemDetailWithStartFlow) {
  return request<ApiResponse<any>>({
    url: '/core/rectificationBook/rectificationBook/commit',
    method: 'post',
    data
  });
}
