import request from '../services/request.ts';
import type { FieldQueryParameters, SuperviseField, SuperviseFieldResult } from '@/types/systemSetting.ts'

// 新增、编辑字段
export function saveSuperviseField(data: SuperviseField) {
  return request<unknown>({
    url: '/core/superviseField/superviseField/save',
    method: 'post',
    data
  });
}

// 字段列表查询
export function superviseFieldList(params: FieldQueryParameters) {
  return request<SuperviseFieldResult>({
    url: '/core/superviseField/superviseField/listJson',
    method: 'get',
    params
  });
}

// 删除字段
// 问题列表删除问题
export function superviseFieldRemove(id: string) {
  return request<string>({
    url: '/core/superviseField/superviseField/remove',
    method: 'get',
    params: {
      id
    }
  })
}
