import request from '@/services/request.ts';
// 通用类型
import type { ApiResponse, QuestionOrderTaskIdParams, QuestionOrderTaskIdResult } from '@/types/base.ts'

// 根据任务Id获取TaskId
export function getQuestionOrderTaskId(params: QuestionOrderTaskIdParams) {
  return request<ApiResponse<QuestionOrderTaskIdResult[]>>({
    url: '/quora/order/questionOrderTask/getQuestionOrderTaskId',
    method: 'get',
    params
  });
}

// 根据taskId获取流程按钮
export function getTaskHandleDetailByTaskId(taskId: string) {
  return request<any> ({
    url: '/restful/task/getTaskHandleDetailByTaskId',
    method: 'get',
    params: {
      taskId
    }
  })
}
