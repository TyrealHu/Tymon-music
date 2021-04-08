import {commonParams} from './config'
import axios from 'axios'
import getSecuritySign from 'common/js/getSign'

const debug = process.env.NODE_ENV !== 'production'

export function getRecommendAndDicsList () {
  const url = '/api/getTopBanner'

  let dataValue = {
    'comm': { 'ct': 24 },
    'category': { 'method': 'get_hot_category', 'param': { 'qq': '' }, 'module': 'music.web_category_svr' },
    'recomPlaylist': {
      'method': 'get_hot_recommend',
      'param': { 'async': 1, 'cmd': 2 },
      'module': 'playlist.HotRecommendServer'
    },
    'playlist': {
      'method': 'get_playlist_by_category',
      'param': { 'id': 8, 'curPage': 1, 'size': 40, 'order': 5, 'titleid': 8 },
      'module': 'playlist.PlayListPlazaServer'
    },
    'new_song': { 'module': 'newsong.NewSongServer', 'method': 'get_new_song_info', 'param': { 'type': 5 } },
    'new_album': {
      'module': 'newalbum.NewAlbumServer',
      'method': 'get_new_album_info',
      'param': { 'area': 1, 'sin': 0, 'num': 10 }
    },
    'new_album_tag': { 'module': 'newalbum.NewAlbumServer', 'method': 'get_new_album_area', 'param': {} },
    'toplist': { 'module': 'musicToplist.ToplistInfoServer', 'method': 'GetAll', 'param': {} },
    'focus': { 'module': 'music.musicHall.MusicHallPlatform', 'method': 'GetFocus', 'param': {} }
  }
  let sign = getSecuritySign(dataValue)
  const data = Object.assign({}, commonParams, {
    '-': 'recom' + (Math.random() + '').replace('0.', ''),
    platform: 'yqq.json',
    loginUin: 0,
    hostUin: 0,
    sign: sign,
    needNewCode: 0,
    inCharset: 'utf8',
    format: 'json',
    data: dataValue
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function changeDicsList(categoryId) {
  const url = '/api/changeDicsList'
  let data = null
  let dataValue = {}
  if (categoryId === 0) {
    dataValue = {
      'comm': {
        'ct': 24
      },
      'recomPlaylist': {
        'method': 'get_hot_recommend',
        'param': {
          'async': 1,
          'cmd': 2
        },
        'module': 'playlist.HotRecommendServer'
      }
    }
    let sign = getSecuritySign(dataValue)
    data = Object.assign({}, commonParams, {
      '-': 'recom' + (Math.random() + '').replace('0.', ''),
      sign: sign,
      loginUin: 0,
      hostUin: 0,
      notice: 0,
      platform: 'yqq.json',
      needNewCode: 0,
      data: dataValue
    })
  } else {
    dataValue = {
      'comm': {
        'ct': 24
      },
      'playlist': {
        'method': 'get_playlist_by_category',
        'param': {
          'id': categoryId,
          'curPage': 1,
          'size': 40,
          'order': 5,
          'titleid': categoryId
        },
        'module': 'playlist.PlayListPlazaServer'
      }
    }
    let sign = getSecuritySign(dataValue)
    data = Object.assign({}, commonParams, {
      '-': 'recom' + (Math.random() + '').replace('0.', ''),
      sign: sign,
      loginUin: 0,
      hostUin: 0,
      notice: 0,
      platform: 'yqq.json',
      needNewCode: 0,
      data: dataValue
    })
  }
  return axios.get(url, {
    params: data
  }).then(res => {
    if (categoryId !== 0) {
      let _array = res.data.data.categoryList
      for (let i in _array) {
        if (!_array[i].cover_url_big) {
          _array[i].cover_url_big = _array[i].imgurl
          break
        }
        let urlArr = _array[i].cover_url_big.split('//')
        urlArr[0] = 'https:'
        let urlArr1child = urlArr[1].split('/')
        let newUrl = urlArr[0] + '//' + 'qpic.y.qq.com' + '/' + urlArr1child[1] + '/' + urlArr1child[2] + '/' + '300?n=1'
        _array[i].cover_url_big = newUrl
      }
      res.data.data.categoryList = _array
    }
    return Promise.resolve(res.data)
  })
}

export function getCdSongList(dissid) {
  const url = '/api/getCdSongList'
  const data = {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    new_format: 1,
    disstid: dissid,
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
