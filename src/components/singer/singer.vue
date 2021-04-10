<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="result" ref="singerList"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSingerList} from 'api/singer'
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

export default {
  name: 'Singer',
  mixins: [playlistMixin],
  components: {
    ListView
  },
  data() {
    return {
      result: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    selectSinger(singer) {
      this.setSinger(singer)
      this.$router.push({
        path: `/singer/${singer.id}`
      })
    },
    _getSingerList() {
      this.result = getSingerList()
    },
    handlePlaylist(playlist) {
      let bottom = playlist.length ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.singerList.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
