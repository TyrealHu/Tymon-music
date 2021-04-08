import {commonParams, tagsIndex} from './config'
import axios from 'axios'
import getSecuritySign from 'common/js/getSign'

export function search(value, page, zhida) {
  const url = '/api/search'
  const data = {
    _: (Math.random() + '').replace('0.', ''),
    g_tk: 5381,
    uin: '',
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    w: value,
    p: page,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    remoteplace: 'txt.mqq.all'
  }
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getHotKey() {
  const url = '/api/getHotKey'
  const data = {
    g_tk_new_20200303: 5381,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  }
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
