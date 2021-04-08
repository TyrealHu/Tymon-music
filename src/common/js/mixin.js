import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newValue) {
      this.handlePlaylist(newValue)
    }
  },
  methods: {
    handlePlaylist(playlist) {
      throw new Error('component must inplement handlePlaylist')
    }
  }
}

export const playerMixin = {
  computed: {
    playMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'mode',
      'sequenceList',
      'currentSong',
      'playlist',
      'favoriteList'
    ])
  },
  methods: {
    onChangeMode() {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      }
      if (mode === playMode.sequence) {
        list = this.sequenceList
      }
      this.restCurrentIndex(list)
      this.setPlaylist(list)
    },
    restCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon(song) {
      return this.isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.savaFavoriteList(song)
      }
    },
    isFavorite(song) {
      let index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlaying: 'SET_PLAYING',
      setSequenceList: 'SET_SEQUENCE_LIST'
    }),
    ...mapActions([
      'deleteFavoriteList',
      'savaFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      value: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurInput() {
      this.$refs.searchBox.blur()
    },
    toSongDetail(item) {
      this.insertSong(item)
      this.saveSearchHistory(this.value)
    },
    searchValue(value) {
      this.value = value
    },
    addValue(value) {
      this.$refs.searchBox.setValue(value)
    },
    deleteHistory(value) {
      this.deleteSearchHistory(value)
    },
    ...mapActions([
      'insertSong',
      'saveSearchHistory',
      'deleteSearchHistory',
    ])
  }
}
