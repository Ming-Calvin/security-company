import request from '@/services/request.ts';
// 通用类型
import type { ApiResponse, QuestionOrderTaskIdParams, QuestionOrderTaskIdResult } from '@/services/api/types.ts'

// 根据任务Id获取TaskId
export function getQuestionOrderTaskId(params: QuestionOrderTaskIdParams) {
  return request<ApiResponse<QuestionOrderTaskIdResult[]>>({
    url: '/quora/order/questionOrderTask/getQuestionOrderTaskId',
    method: 'get',
    params
  });
}
