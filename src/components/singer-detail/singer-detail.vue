<template>
  <transition appear name="slider">
    <div class="singer-detail">
      <music-list :bg-image="singer.avatar" :songs="songs" :title="singer.name"></music-list>
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import { getSingerDetail } from 'api/singer'
import { createSong } from 'common/js/song'
import { ERR_OK } from 'api/config'
import MusicList from 'components/music-list/music-list'

export default {
  name: 'SingerDetail',
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getSingerSongDetail()
  },
  methods: {
    _getSingerSongDetail() {
      let _id = this.singer.id
      if (!_id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(_id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.singerSongList.songList)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let {songInfo} = item
        if (songInfo.mid && songInfo.album.mid) {
          createSong(songInfo).then(song => {
            if (song.code === 0) {
              ret.push(song)
            }
            this.songs = ret
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background

  .slider-leave-active,.slider-enter-active
    transition all 0.3s
  .slider-enter,.slider-leave-to
    transform translate3d(100%, 0, 0)
</style>
