<template>
  <scroll @scroll="scroll" :data="data" class="listview" ref="listview" :probe-type="probeType" :listen-scroll="listenScroll">
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li @click="selectSinger(item)" v-for="(item,index) in data[index].items" :key="index" class="list-group-item">
            <img class="avatar" :src="item.avatar" v-if="group.title === '热门' && index < 10">
            <img class="avatar" v-lazy="'dist/static/img/default.712b6ae.png'" v-else>
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div v-show="shortcutList.length == 28" class="list-shortcut">
      <ul>
        <li class="item" :class="{'current': currentIndex === index}" v-for="(item, index) in shortcutList" :data-index="index" :key="index"
        @touchstart.stop.prevent="shortcutTouchStart" @touchmove.stop.prevent="shortcutTouchMove" @touchend.stop>
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixedTitle" v-show="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="data.length === 0">
      <loading></loading>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
import Loading from 'base/loading/loading'
import {tagsIndex} from 'api/config'

const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18

export default {
  name: 'ListView',
  components: {
    Scroll,
    Loading
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1,
      shortcutList: []
    }
  },
  mounted() {
    this.shortcutList = tagsIndex.map((item) => {
      return item.charAt(0)
    })
  },
  computed: {
    fixedTitle() {
      if (this.scrollY > 0) {
        return
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectSinger(item) {
      this.$emit('select', item)
    },
    _sortSingerList() {
      this.data.sort((a, b) => {
        return Number(a.id) - Number(b.id)
      })
    },
    shortcutTouchStart(el) {
      let anchoIndex = getData(el.target, 'index')
      this.touch.y1 = el.touches[0].pageY
      this.touch.anchoIndex = anchoIndex
      this._scrollToElement(anchoIndex)
    },
    shortcutTouchMove(el) {
      this.touch.y2 = el.touches[0].pageY
      let moveY = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
      let anchoIndex = parseInt(this.touch.anchoIndex) + moveY
      anchoIndex = anchoIndex >= 0 ? anchoIndex : 0
      anchoIndex = anchoIndex <= 28 ? anchoIndex : 28
      this._scrollToElement(anchoIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    _scrollToElement(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      }
      if (index >= this.shortcutList.length) {
        index = this.shortcutList.length - 1
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0, false, false)
    },
    _calculateHeight() {
      let height = 0
      let list = this.$refs.listGroup
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._sortSingerList()
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < this.listHeight.length - 1; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (-newY < height2 && -newY >= height1) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      this.currentIndex = this.listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (fixedTop === this.fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
