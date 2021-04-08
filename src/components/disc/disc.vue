<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songList"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {createSong} from 'common/js/song'
import {getCdSongList} from 'api/recommend'
import {mapGetters} from 'vuex'

export default {
  name: 'Disc',
  components: {
    MusicList
  },
  data () {
    return {
      songList: []
    }
  },
  mounted() {
    this._getCdSongList()
  },
  methods: {
    _getCdSongList() {
      if (!this.disc.content_id && !this.disc.tid) {
        this.$router.push('/recommend')
        return
      }
      let id = this.disc.content_id ? this.disc.content_id : this.disc.tid
      getCdSongList(id).then(res => {
        if (res.code === 0) {
          let songList = res.data.cdlist.songlist
          this._toSongClass(songList)
        }
      })
    },
    _toSongClass(songlist) {
      let songClassList = []
      for (let i in songlist) {
        if (songlist[i].id && songlist[i].album.id) {
          createSong(songlist[i]).then((song) => {
            songClassList.push(song)
            this.songList = songClassList
          })
        }
      }
    }
  },
  computed: {
    title() {
      return this.disc.title
    },
    bgImage() {
      return this.disc.cover ? this.disc.cover : this.disc.cover_url_big
    },
    ...mapGetters([
      'disc'
    ])
  },
  watch: {
  }
}
</script>

<style scoped lang="stylus">

.slide-enter-active,.slide-leave-active
  transition all 0.3s
.slide-enter,.slide-leave-to
  transform translate3d(100%,0,0)
</style>
