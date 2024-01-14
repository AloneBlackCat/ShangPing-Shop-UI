import request from '@/utils/request'

const base_api = '/admin/system/sysUser'
export const GetSysUserListByPage = (current, limit, queryDto) => {
  return request({
    url: `${base_api}/findByPage/${current}/${limit}`,
    method: 'post',
    data: queryDto,
  })
}

export const addSysUser = sysUser => {
  return request({
    url: `${base_api}/addSysUser`,
    method: 'post',
    data: sysUser,
  })
}

export const updateSysUser = sysUser => {
  return request({
    url: `${base_api}/updateSysUser`,
    method: 'put',
    data: sysUser,
  })
}
export const deleteById = sysUserId => {
  return request({
    url: `${base_api}/deleteById/${sysUserId}`,
    method: 'delete',
  })
}
