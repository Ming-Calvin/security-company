import request from '../services/request.ts';
import type {
  SuperviseFieldListParams,
  ListResponseData
} from '@/types/systemConfiguration.ts'


export function getSuperviseFieldList(params: SuperviseFieldListParams) {
  // 固定参数
  const staticParams = {
    page: 1,
    rows: 99,
    sort: 'ID',
    order: 'desc',
  };

  return request<ListResponseData>({
    url: '/core/superviseField/superviseField/listJson',
    method: 'get',
    params: {
      ...staticParams,
      ...params
    },
  });
}
