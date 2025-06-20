import request from '../../request.ts';
// 通用api类型
import type {
  ApiResponse,
  PeopleSelectTreeParams,
  PeopleSelectTreeResult,
  PeopleSelectUserParams,
  PeopleSelectUserTable
} from '../types.ts'

// 问题库类型
import type {
  ProblemCountData,
  ProblemListParams,
  ProblemListResponse,
  ProblemSavePayload,
  ProblemDetail,
  ProblemDetailWithStartFlow,
  PendingListResponse,
  PendingListParams, ProblemDetailsParams
} from './types.ts'

import qs from 'qs'

// 问题数量统计
export function getProblemCount() {
  return request<ApiResponse<ProblemCountData>>({
    url: '/core/problemWarehouse/problemWarehouse/getProblemCount',
    method: 'get'
  });
}

// 问题数量列表
export function getProblemList(params: ProblemListParams) {
  return request<ApiResponse<ProblemListResponse>>({
    url: '/core/problemWarehouse/problemWarehouse/listJson',
    method: 'post',
    params,
  });
}

// 保存问题
export function saveProblem(data: ProblemSavePayload) {
  return request<ApiResponse<any>>({
    url: '/core/problemWarehouse/problemWarehouse/save',
    method: 'post',
    data: data,
  });
}

// 根据id查询详情
export function getProblemDetails(params: ProblemDetailsParams) {
  return request<ApiResponse<ProblemDetail>>({
    url: '/core/problemWarehouse/problemWarehouse/getJson',
    method: 'get',
    params
  });
}

// 获取组织部门树
export function getTreeList(data: PeopleSelectTreeParams) {
  const staticParams = {
    dialog_alias_: 'orgSelectorCombin',
    demId: 1,
  };

  return request<PeopleSelectTreeResult[]>({
    url: "/form/customDialog/getTreeData",
    method: "post",
    params: {
      ...staticParams
    },
    data: qs.stringify(data)
  })
}

// 人员选择器获取人员数据
export function getUserTable(query: PeopleSelectUserParams) {
  // 固定参数
  const staticParams = {
    dialog_alias_: 'userSelector',
    demId: 1,
  };

  return request<PeopleSelectUserTable> ({
    url: "/form/customDialog/getListData",
    method: "get",
    params: {
      ...staticParams,
      ...query
    }
  })
}

// 发起接口
export function problemWarehouseCommit(data: ProblemDetailWithStartFlow) {
  return request<ApiResponse<any>>({
    url: '/core/problemWarehouse/problemWarehouse/commit',
    method: 'post',
    data
  });
}

export function getPendingList(params: PendingListParams) {
  return request<ApiResponse<PendingListResponse>>({
    url: '/office/receivedProcess/pendingJsonNew',
    method: 'get',
    params,
  });
}

