import {getSongUrl} from 'api/singer'
import {ERR_OK} from 'api/config'
import {getLyric} from 'api/song'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyricFunc() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.code === 0) {
          this.lyric = Base64.decode(res.data.ret.lyric)
          resolve(this.lyric)
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('no lyric')
        }
      })
    })
  }
}

export function createSong(songInfo) {
  return getSongUrlByMid(songInfo.mid).then(res => {
    let url = res
    let song = new Song({
      id: songInfo.id,
      mid: songInfo.mid,
      singer: filterSinger(songInfo.singer),
      name: songInfo.title,
      album: songInfo.album.name,
      duration: songInfo.interval,
      image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${songInfo.album.pmid}.jpg?max_age=2592000`,
      url: url
    })
    if (song.url === '') {
      song.code = -1
    } else {
      song.code = 0
    }
    return Promise.resolve(song)
  })
}

function getSongUrlByMid(mid) {
  return getSongUrl(mid).then(res => {
    if (res.code === ERR_OK) {
      let songUrlInfo = res.data
      let url = songUrlInfo.midurlinfo[0].purl ? songUrlInfo.sip[0] + songUrlInfo.midurlinfo[0].purl : ''
      return url
    }
  })
}

export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}
