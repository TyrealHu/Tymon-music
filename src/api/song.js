import {commonParams, tagsIndex} from './config'
import axios from 'axios'

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    '-': 'MusicJsonCallback_lrc',
    pcachetime: +new Date(),
    songmid: mid,
    g_tk_new_20200303: 5389520,
    g_tk: 5389520,
    loginUin: 1152921505052949506,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
