import request from '@/services/request.ts';
// 通用类型
import type { ApiResponse, QuestionOrderTaskIdParams, QuestionOrderTaskIdResult, GetRoleApiResponse } from '@/types/base.ts'
import config from '@/services/config.ts'
import { getPortalToken } from '@/utils/auth.ts'

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

// 获取登录人员权限
export function getRole() {
  return request<GetRoleApiResponse>({
    baseURL: config.portalApi,
    url: '/getInfo',
    method: 'get',
    isPortal: true
  })
}

export function loginByTgt(code: string) {
  return request<any>({
    baseURL: config.portalApi,
    url: '/loginByTgt?code=' + code,
    method: 'get'
  })
}

