<template>
  <div class="rank" ref="rank">
    <scroll-view :data="toplist" class="toplist" ref="toplist">
      <ul>
        <div v-for="item in toplist" :key="item.groupId">
          <li @click="toTopListPage(top)" class="item" v-for="top in item.toplist" :key="top.topId">
            <div class="icon">
              <span class="groupName">{{item.groupName}}</span>
              <span class="topTitle">{{top.title}}</span>
            </div>
            <ul class="songlist">
              <li class="song" v-for="(song, index) in top.song" :key="index">
                <span>{{ index + 1 }}</span>
                <span>{{ song.title }} - {{ song.singerName }}</span>
              </li>
            </ul>
          </li>
        </div>
      </ul>
      <div class="loading-container" v-show="toplist.length === 0">
        <loading></loading>
      </div>
    </scroll-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import {getRecommendAndDicsList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import ScrollView from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'

export default {
  name: 'Rank',
  mixins: [playlistMixin],
  components: {
    ScrollView,
    Loading
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'toplist'
    ])
  },
  mounted() {
    if (this.toplist.length <= 0) {
      this._getToplist()
    }
  },
  methods: {
    toTopListPage(top) {
      this.setCurrentTop(top)
      this.$router.push({
        path: `/rank/${top.topId}`
      })
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    _getToplist() {
      getRecommendAndDicsList().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data.toplist)
          this.setToplist(res.data.toplist)
        }
      })
    },
    ...mapMutations({
      setToplist: 'SET_TOPLIST',
      setCurrentTop: 'SET_CURRENT_TOP'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.rank
  position: fixed
  width: 100%
  top: 88px
  bottom: 0

  .toplist
    height: 100%
    overflow: hidden

    .top-title
      padding-top 10px
      padding-left 20px
      font-size $font-size-medium
      color: $color-theme

    .item
      display: flex
      margin: 0 20px
      padding-top: 10px
      height: 100px

      &:last-child
        padding-bottom: 20px

      .icon
        display flex
        flex-direction column
        justify-content center
        padding 10px 5px 0 10px
        align-items center
        flex: 0 0 100px
        width: 100px
        height: 100px
        background-color $color-theme-d
        box-sizing border-box
        .groupName
          font-size $font-size-large-x
          color $color-text-ll
          margin-bottom 20px
        .topTitle
          color $color-text-l
          font-size $font-size-medium-x
          text-align center

      .songlist
        flex: 1
        display: flex
        flex-direction: column
        justify-content: center
        padding: 0 20px
        height: 100px
        overflow: hidden
        background: $color-highlight-background
        color: $color-text-d
        font-size: $font-size-small

        .song
          no-wrap()
          line-height: 26px

    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
