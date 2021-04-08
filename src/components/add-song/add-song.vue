<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close">
          <i class="icon-close" @click="hide"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" placeholder="搜索歌曲" @value="searchValue"></search-box>
      </div>
      <div class="shortcut" v-show="!value">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
        <div class="list-wrapper">
          <scroll-view :refreshDelay="refreshDelay" ref="songList" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner">
              <song-list @select="selectSong" :songs="playHistory"></song-list>
            </div>
          </scroll-view>
          <scroll-view ref="searchList" v-if="currentIndex === 1" class="list-scroll" :data="searchHistory">
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="addValue" @delete="deleteHistory"></search-list>
            </div>
          </scroll-view>
        </div>
      </div>
      <div class="search-result" v-show="value">
        <suggest @listScroll="blurInput" @toSongDetail="selectSuggest" :value="value" :showSinger="showSinger"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import TopTip from 'base/top-tip/top-tip'
import Switches from 'base/switches/switches'
import SearchList from 'base/search-list/search-list'
import ScrollView from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import {searchMixin} from 'common/js/mixin'
import Suggest from 'components/suggest/suggest'
import Song from 'common/js/song'
import {mapActions, mapGetters} from 'vuex'
export default {
  name: 'AddSong',
  mixins: [searchMixin],
  components: {
    SearchBox,
    Suggest,
    Switches,
    ScrollView,
    SongList,
    SearchList,
    TopTip
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  data() {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      refreshDelay: 100,
      switches: [
        {
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ]
    }
  },
  methods: {
    switchItem(index) {
      this.currentIndex = index
    },
    show() {
      this.showFlag = true
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else if (this.currentIndex === 1) {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    selectSuggest(item) {
      this.toSongDetail(item)
      this.showTip()
    },
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
        this.showTip()
      }
    },
    showTip() {
      this.$refs.topTip.show()
    },
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.add-song
  position: fixed
  top: 0
  bottom: 0
  width: 100%
  z-index: 200
  background: $color-background
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.3s
  &.slide-enter, &.slide-leave-to
    transform: translate3d(100%, 0, 0)
  .header
    position: relative
    height: 44px
    text-align: center
    .title
      line-height: 44px
      font-size: $font-size-large
      color: $color-text
    .close
      position: absolute
      top: 0
      right: 8px
      .icon-close
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme

  .search-box-wrapper
    margin: 20px
  .shortcut
    .list-wrapper
      position: absolute
      top: 165px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
  .search-result
    position: fixed
    top: 124px
    bottom: 0
    width: 100%
  .tip-title
    text-align: center
    padding: 18px 0
    font-size: 0
    .icon-ok
      font-size: $font-size-medium
      color: $color-theme
      margin-right: 4px
    .text
      font-size: $font-size-medium
      color: $color-text
</style>
