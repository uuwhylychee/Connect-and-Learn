import request from '@/utils/request'

export const myBooking = (params) =>
  request({
    url: 'booking/my-booking',
    method: 'get',
    params,
  })

export const pointItem = (data) =>
    request({
        url: 'order',
        method: 'post',
        data
    })
