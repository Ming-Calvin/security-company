import request from '../services/request.ts';
// 通用api类型
import type {
  ApiResponse,
  PeopleSelectTreeParams,
  PeopleSelectTreeResult,
  PeopleSelectUserParams,
  PeopleSelectUserTable
} from '../types/base.ts'

// 问题库类型
import type {
  ProblemCountData,
  ProblemListParams,
  ProblemListResponse,
  ProblemSavePayload,
  ProblemDetail,
  ProblemDetailWithStartFlow,
  PendingListResponse,
  PendingListParams,
  ProblemDetailsParams,
  ProblemDatabaseSaveResponse
} from '../types/problemDatabase.ts'

import qs from 'qs'

// 问题数量统计
export function getProblemCount() {
  return request<ProblemCountData>({
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

// 问题列表删除问题
export function problemWarehouseRemove(id: string) {
  return request<string>({
    url: '/core/problemWarehouse/problemWarehouse/remove',
    method: 'get',
    params: {
      id
    }
  })
}

// 保存问题
export function saveProblem(data: ProblemSavePayload) {
  return request<ProblemDatabaseSaveResponse>({
    url: '/core/problemWarehouse/problemWarehouse/save',
    method: 'post',
    data: data,
  });
}

// 根据id查询详情
export function getProblemDetails(params: ProblemDetailsParams) {
  return request<ProblemDetail>({
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

// 部门选择器
export function getOrgTable(query: PeopleSelectUserParams) {
  // 固定参数
  const staticParams = {
    dialog_alias_: 'orgSelector',
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
  return request<ApiResponse<unknown>>({
    url: '/core/problemWarehouse/problemWarehouse/commit',
    method: 'post',
    data
  });
}

// 待办接口
export function getPendingList(params: PendingListParams) {
  return request<ApiResponse<PendingListResponse>>({
    url: '/office/receivedProcess/pendingJsonNew',
    method: 'get',
    params,
  });
}

// 待办接口
export function getHandledList(params: PendingListParams) {
  return request<ApiResponse<PendingListResponse>>({
    url: '/office/receivedProcess/handledJsonNew',
    method: 'get',
    params,
  });
}

