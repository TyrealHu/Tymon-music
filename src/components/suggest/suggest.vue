<template>
  <scroll-view ref="scroll"
               :pullup="true"
               :beforeScroll="true"
               @beforeScroll="listScroll"
               @scrollToEnd="onScrollToEnd"
               :data="result"
               class="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" ref="suggestItems" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="loading" title=""></loading>
    </ul>
    <div v-show="!result || page * 20 > totalNum" class="no-result-wrapper">
      <no-result title="暂无搜索结果"></no-result>
    </div>
  </scroll-view>
</template>

<script type="text/ecmascript-6">
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import NoResult from 'base/no-result/no-result'
import ScrollView from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'

const TYPE_SINGER = 'singer'

export default {
  name: 'Suggest',
  components: {
    ScrollView,
    Loading,
    NoResult
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      lastValue: '',
      page: 1,
      singerRet: [],
      totalNum: 0,
      loading: false,
      songRet: []
    }
  },
  computed: {
    result () {
      return this.singerRet.concat(this.songRet)
    }
  },
  methods: {
    listScroll() {
      this.$emit('listScroll')
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer(item.singermid, item.singername)
        this.$emit('toSingerDetail', singer)
      } else {
        this.$emit('toSongDetail', item)
      }
    },
    onScrollToEnd() {
      if (this.page * 20 >= this.totalNum) {
        return
      }
      this.page += 1
      this.loading = true
      this.search()
    },
    getDisplayName(item) {
      if (item.type && item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    getIconCls(item) {
      if (item.type && item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    search() {
      this.loading = true
      if (this.lastValue !== this.value) {
        this.page = 1
        this.$refs.scroll.scrollTo(0, 0)
      }
      search(this.value, this.page, this.showSinger).then(res => {
        if (res.code === ERR_OK) {
          this._getResult(res.data)
        }
      })
    },
    clear() {
      this.lastValue = ''
      this.page = 1
      this.songRet = []
      this.singerRet = []
      this.totalNum = 0
      this.loading = false
    },
    refresh() {
      this.$refs.scroll.refresh()
    },
    _getResult(result) {
      this.totalNum = result.song.totalnum
      if (this.lastValue !== this.value) {
        this.songRet = []
        if (result.zhida && result.zhida.singerid) {
          this.singerRet.push({...result.zhida, ...{type: TYPE_SINGER}})
        }
      }
      if (result.song) {
        this._formatSong(result.song.list)
      }
      this.lastValue = result.keyword
      this.loading = false
    },
    _formatSong (list) {
      for (let i in list) {
        let item = list[i]
        let songInfo = {
          id: item.songid,
          mid: item.songmid,
          singer: item.singer,
          title: item.songname,
          album: {
            name: item.albumname,
            pmid: item.albummid
          },
          interval: item.interval
        }
        createSong(songInfo).then(song => {
          if (song.url) {
            this.songRet.push(song)
          }
        })
      }
    }
  },
  watch: {
    value(newValue) {
      if (!newValue) {
        this.clear()
        return
      }
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.suggest
  height: 100%
  overflow: hidden

  .suggest-list
    padding: 0 30px

    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px

    .icon
      flex: 0 0 30px
      width: 30px

      [class^="icon-"]
        font-size: 14px
        color: $color-text-d

    .name
      flex: 1
      font-size: $font-size-medium
      color: $color-text-d
      overflow: hidden

      .text
        no-wrap()

  .no-result-wrapper
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
