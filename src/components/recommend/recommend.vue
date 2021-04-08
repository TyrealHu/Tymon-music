<template>
  <div class="recommend" ref="recommend">
    <scroll-view ref="scroll" :data="dicsList" class="recommend-content">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item of recommends" :key="item.id" >
              <a :href="item.linkUrl">
                <img class="needclass" @load="imgLoading" :src="item.cover"/>
              </a>
            </div>
          </slider>
        </div>
        <div v-if="checkChangeSucc" class="recommend-list">
          <div class="list-title-container">
            <h1 v-if="category.length !== 0" class="list-title needclass" :class="{active: choiceTheme === 0}" @click="changeList(0)">为你推荐</h1>
            <h1 class="list-title needclass" v-for="(listTitle, listIndex) in category" :key="listTitle.item_id"
            :class="{active: choiceTheme === listIndex + 1}" @click="changeList(listIndex + 1)">
              {{listTitle.item_name}}
            </h1>
          </div>
          <ul>
            <li class="item" v-for="(item,index) in dicsList" :key="index" @click="onToDisc(item)">
              <div class="icon">
                <img v-if="choiceTheme === 0" v-lazy="item.cover"/>
                <img v-if="choiceTheme !== 0" ref="imgHeader" v-lazy="item.cover_url_big"/>
              </div>
              <div class="text">
                <h2 v-if="choiceTheme === 0" class="name" v-html="item.username"></h2>
                <h2 v-if="choiceTheme !== 0" class="name" v-html="item.creator_info.nick"></h2>
                <p class="desc" v-html="item.title"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="dicsList.length === 0">
        <loading></loading>
      </div>
    </scroll-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getRecommendAndDicsList, changeDicsList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import ScrollView from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  name: 'Recommend',
  mixins: [playlistMixin],
  components: {
    Slider,
    ScrollView,
    Loading
  },
  created () {
    this._getRecommendAndDicsList()
  },
  data () {
    return {
      recommends: [],
      dicsList: [],
      choiceTheme: 0,
      category: [],
      checkChangeSucc: true
    }
  },
  methods: {
    onToDisc(item) {
      let id = null
      if (item.content_id) {
        id = item.content_id
      } else {
        id = item.tid
      }
      this.$router.push({
        path: `/recommend/${id}`
      })
      this.setDisc(item)
    },
    handlePlaylist(playlist) {
      let bottom = playlist.length ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getRecommendAndDicsList () {
      getRecommendAndDicsList().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
          this.dicsList = res.data.dicsList
          this.category = res.data.category
          this.setToplist(res.data.toplist)
          this._getJumpUrl()
        }
      })
    },
    _getJumpUrl() {
      for (let i = 0; i < this.recommends.length; i++) {
        if (this.recommends[i].jumptype === 10014) {
          this.recommends[i].linkUrl = `https://y.qq.com/n/yqq/playlist/${this.recommends[i].id}.html#stat=y_new.index.focus.click`
        } else if (this.recommends[i].jumptype === 3001) {
          this.recommends[i].linkUrl = this.recommends[i].id
        } else {
          this.recommends[i].linkUrl = `https://y.qq.com/n/yqq/album/${this.recommends[i].subid}.html#stat=y_new.index.focus.click`
        }
      }
    },
    imgLoading() {
      if (!this.checkLoaded) {
        this.checkLoaded = true
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    },
    changeList(listIndex) {
      this.checkChangeSucc = false
      this.choiceTheme = listIndex
      this._changeDicsList()
    },
    _changeDicsList() {
      if (this.choiceTheme === 0) {
        changeDicsList(0).then(res => {
          this.dicsList = res.data.categoryList
          this.checkChangeSucc = true
        })
      } else {
        changeDicsList(this.category[this.choiceTheme - 1].item_id).then(res => {
          this.dicsList = res.data.categoryList
          this.checkChangeSucc = true
        })
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC',
      setToplist: 'SET_TOPLIST'
    })
  }
}

</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title-container
          display flex
          flex-direction row
          justify-content space-around
          .list-title
            height: 65px
            line-height: 65px
            text-align: center
            box-sizing border-box
            font-size: $font-size-medium
            color: $color-text-l
            &.active
              height: 65px
              line-height: 65px
              text-align: center
              font-size: $font-size-medium
              color: $color-text
        .item
          display: flex
          flex-direction row
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            height 60px
            width: 60px
            padding-right: 20px
            img
              width 60px
              height 60px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            align-items flex-start
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
