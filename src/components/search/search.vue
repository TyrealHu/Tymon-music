<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @value="searchValue" ref="searchBox"></search-box>
    </div>
    <div ref="shortCutWrapper" class="shortcut-wrapper" v-show="!value">
      <scroll-view :refreshDelay="refreshDelay" class="shortcut" ref="scrollShortCut" :data="scrollData">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addValue(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list @select="addValue" @delete="deleteHistory" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll-view>
    </div>
    <div ref="searchResult" class="search-result" v-show="value">
      <suggest ref="suggest" @listScroll="blurInput" @toSongDetail="toSongDetail" @toSingerDetail="toSingerDetail"
               :value="value"></suggest>
    </div>
    <router-view></router-view>
    <confirm ref="confirm"
             confirmBtnText="清空"
             @confirm="confirmConfirm" text="是否清空历史搜索"></confirm>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import ScrollView from 'base/scroll/scroll'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import {playlistMixin, searchMixin} from 'common/js/mixin'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import {mapMutations, mapActions, mapGetters} from 'vuex'

export default {
  name: 'Search',
  mixins: [playlistMixin, searchMixin],
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    ScrollView
  },
  computed: {
    scrollData() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  data() {
    return {
      hotKey: [],
      refreshDelay: 100
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortCutWrapper.style.bottom = bottom
      this.$refs.scrollShortCut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    toSingerDetail(singer) {
      this.$router.push({
        path: `/search/${singer.id}`
      })
      this.setSinger(singer)
    },
    clearHistory() {
      this.clearSearchHistory()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    confirmConfirm() {
      this.clearHistory()
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotKey.slice(0, 10)
        }
      })
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    value(newValue) {
      if (!newValue) {
        setTimeout(() => {
          this.$refs.scrollShortCut.refresh()
        }, 20)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.search
  .search-box-wrapper
    margin: 20px

  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%

    .shortcut
      height: 100%
      overflow: hidden

      .hot-key
        margin: 0 20px 20px 20px

        .title
          margin-bottom: 20px
          font-size: $font-size-medium
          color: $color-text-l

        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d

      .search-history
        position: relative
        margin: 0 20px

        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l

          .text
            flex: 1

          .clear
            extend-click()

            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d

  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
</style>
