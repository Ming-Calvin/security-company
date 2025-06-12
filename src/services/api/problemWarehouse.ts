import request from '../request';

/**
 * 接口返回的 data 字段的类型
 */
export interface ProblemCountData {
  AllCount: number;
  runningCount: number;
  noCommitCount: number;
  endCount: number;
}

/**
 * 这样，所有返回类似结构的接口都可以复用它
 */
export interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
  success: boolean;
}

/**
 * @description 获取各类问题的数量统计
 */
export function getProblemCount() {
  // 我们告诉 request，期望的返回数据结构是 ApiResponse<ProblemCountData>
  return request<ApiResponse<ProblemCountData>>({
    url: '/core/problemWarehouse/problemWarehouse/getProblemCount',
    method: 'get'
  });
}
