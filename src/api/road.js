import HttpRequest from '@/axios/api.request'

export const RoadQryAction = () => {
  return HttpRequest.request({
    url: 'road/',
    method: 'get'
  })
}
