<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back">
        <i class="icon-back" @click="back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll-view :refreshDelay="refreshDelay" ref="favoriteList" class="list-scroll" v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <song-list @select="selectSong" :songs="favoriteList"></song-list>
          </div>
        </scroll-view>
        <scroll-view :refreshDelay="refreshDelay" ref="playHistory" v-if="currentIndex === 1" class="list-scroll" :data="playHistory">
          <div class="list-inner">
            <song-list @select="selectSong" :songs="playHistory"></song-list>
          </div>
        </scroll-view>
      </div>
      <div class="no-result-wrapper" v-show="showNoResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Switches from 'base/switches/switches'
import ScrollView from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import NoResult from 'base/no-result/no-result'
import {playlistMixin} from 'common/js/mixin'
import Song from 'common/js/song'
import {mapActions, mapGetters} from 'vuex'
export default {
  name: 'UserCenter',
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {name: '我喜欢'},
        {name: '最近播放'}
      ],
      refreshDelay: 100
    }
  },
  computed: {
    noResultDesc() {
      if (this.currentIndex === 0 && this.favoriteList.length === 0) {
        return '快去添加我喜欢！'
      }
      if (this.currentIndex === 1 && this.playHistory.length === 0) {
        return '请听了音乐再来！'
      }
    },
    showNoResult() {
      if (this.currentIndex === 0) {
        return this.favoriteList.length === 0
      }
      if (this.currentIndex === 1) {
        return this.playHistory.length === 0
      }
    },
    ...mapGetters([
      'playHistory',
      'favoriteList'
    ])
  },
  components: {
    NoResult,
    Switches,
    ScrollView,
    SongList
  },
  methods: {
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      list = list.map((song) => {
        return new Song(song)
      })
      this.radomPlay({list})
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playHistory && this.$refs.playHistory.refresh()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    back() {
      this.$router.back()
    },
    selectSong(item) {
      this.insertSong(new Song(item))
    },
    ...mapActions([
      'insertSong',
      'radomPlay'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"

.user-center
  position: fixed
  top: 0
  bottom: 0
  z-index: 100
  width: 100%
  background: $color-background
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.3s
  &.slide-enter, &.slide-leave-to
    transform: translate3d(100%, 0, 0)
  .back
    position absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .switches-wrapper
    margin: 10px 0 30px 0
  .play-btn
    box-sizing: border-box
    width: 135px
    padding: 7px 0
    margin: 0 auto
    text-align: center
    border: 1px solid  $color-text-l
    color: $color-text-l
    border-radius: 100px
    font-size: 0
    .icon-play
      display: inline-block
      vertical-align: middle
      margin-right: 6px
      font-size: $font-size-medium-x
    .text
      display: inline-block
      vertical-align: middle
      font-size: $font-size-small
  .list-wrapper
    position: absolute
    top: 110px
    bottom: 0
    width: 100%
    .list-scroll
      height: 100%
      overflow: hidden
      .list-inner
        padding: 20px 30px
  .no-result-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
