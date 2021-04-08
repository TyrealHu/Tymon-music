<template>
  <transition name="slide">
    <music-list :rank="true" :title="topTitle" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getTopSongList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  name: 'TopList',
  data() {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  mounted() {
    this._getSongInfoList()
  },
  methods: {
    _getSongInfoList() {
      if (!this.currentTop.topId) {
        this.$router.push({
          path: '/rank'
        })
        return
      }
      getTopSongList(this.currentTop.topId, this.currentTop.period).then(res => {
        if (res.code === ERR_OK) {
          console.log(res)
          let songs = res.data.songInfoList
          let songClsArr = []
          for (let i in songs) {
            createSong(songs[i]).then(song => {
              songClsArr.push(song)
              this.songs = songClsArr
            })
          }
        }
      })
    }
  },
  computed: {
    topTitle() {
      return this.currentTop.title
    },
    bgImage() {
      return this.currentTop.topAlbumURL
    },
    ...mapGetters([
      'currentTop'
    ])
  }
}
</script>

<style scoped lang="stylus">
.slide-leave-active, .slide-enter-active
  transition all 0.3s

.slide-enter, .slide-leave-tp
  transform translate3d(100%, 0, 0)
</style>
