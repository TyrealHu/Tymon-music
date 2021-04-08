import {commonParams} from './config'
import axios from 'axios'
import getSecuritySign from 'common/js/getSign'

export function getTopSongList(topId, period) {
  const url = '/api/getTopSongList'
  let dataValue = {
    'detail': {
      'module': 'musicToplist.ToplistInfoServer',
      'method': 'GetDetail',
      'param': {
        'topId': topId,
        'offset': 0,
        'num': 20,
        'period': period
      }
    },
    'comm': {'ct': 24, 'cv': 0}
  }
  let sign = getSecuritySign(dataValue)
  const data = Object.assign({}, commonParams, {
    '-': 'getUCGI' + (Math.random() + '').replace('0.', ''),
    g_tk: 5381,
    platform: 'yqq.json',
    loginUin: 0,
    hostUin: 0,
    sign: sign,
    needNewCode: 0,
    inCharset: 'utf8',
    notice: 0,
    format: 'json',
    data: dataValue
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
