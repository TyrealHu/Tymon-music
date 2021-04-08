import {commonParams, tagsIndex} from './config'
import axios from 'axios'
import getSecuritySign from 'common/js/getSign'
import Singer from 'common/js/singer'

export function getSingerList() {
  let result = []
  const url = '/api/getSingerList'
  for (let i = 0; i < 28; i++) {
    let index = 0
    if (i === 0) {
      index = -100
    } else {
      index = i
    }
    let dataValue = {
      'comm': {
        'ct': 24,
        'cv': 0
      },
      'singerList': {
        'module': 'Music.SingerListServer',
        'method': 'get_singer_list',
        'param': {
          'area': -100,
          'sex': -100,
          'genre': -100,
          'index': index,
          'sin': 0,
          'cur_page': 1
        }
      }
    }

    let sign = getSecuritySign(dataValue)

    const data = Object.assign({}, commonParams, {
      '-': 'recom' + (Math.random() + '').replace('0.', ''),
      sign: sign,
      onlysong: 0,
      platform: 'yqq.json',
      loginUin: 0,
      hostUin: 0,
      needNewCode: 0,
      data: dataValue
    })
    axios.get(url, {
      params: data
    }).then((res) => {
      let list = formatSingerList(res.data.data)
      result.push(list)
    })
  }
  return result
}

export function getSingerDetail(singerId) {
  const url = '/api/getSingerDetail'

  let dataValue = {
    'comm': {
      'ct': 24,
      'cv': 0
    },
    'singerSongList': {
      'method': 'GetSingerSongList',
      'param': {
        'order': 1,
        'singerMid': `${singerId}`,
        'begin': 0,
        'num': 100
      },
      'module': 'musichall.song_list_server'
    }
  }
  let sign = getSecuritySign(dataValue)

  const data = {
    '-': 'getSingerSong' + (Math.random() + '').replace('0.', ''),
    g_tk: 5381,
    sign: sign,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: dataValue
  }

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSongUrl(songMid) {
  const url = '/api/getSongUrl'

  let dataValue = {
    'req': {
      'module': 'CDN.SrfCdnDispatchServer',
      'method': 'GetCdnDispatch',
      'param': {
        'guid': '2283240480',
        'calltype': 0,
        'userip': ''
      }
    },
    'req_0': {
      'module': 'vkey.GetVkeyServer',
      'method': 'CgiGetVkey',
      'param': {
        'guid': '2283240480',
        'songmid': [
          `${songMid}`
        ],
        'songtype': [0],
        'uin': '1152921505052949506',
        'loginflag': 1,
        'platform': '20'
      }
    },
    'comm': {
      'uin': '1152921505052949506',
      'format': 'json',
      'ct': 24,
      'cv': 0
    }
  }
  let sign = getSecuritySign(dataValue)

  const data = {
    '-': 'getplaysongvkey' + (Math.random() + '').replace('0.', ''),
    g_tk: 461498285,
    sign: sign,
    loginUin: 1152921505052949506,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: dataValue
  }

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

function formatSingerList(data) {
  let index = data.index === -100 ? 0 : data.index
  let singerlist = data.singerlist
  let tag = tagsIndex[index]
  let newSingerList = []
  let result = {}
  for (let i = 0; i < singerlist.length; i++) {
    let newSinger = new Singer(singerlist[i].singer_mid, singerlist[i].singer_name)
    newSingerList.push(newSinger)
  }
  result['title'] = tag
  result['id'] = index
  result['items'] = newSingerList
  return result
}
