import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'
import {saveSearch, deleteSearch, clearSearch, savePlay, deleteFavorite, saveFavorite} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, findIndex(list, list[index]))
  } else {
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_CURRENT_INDEX, index)
  }
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

export const radomPlay = function ({commit}, {list}) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice(0)
  let sequenceList = state.sequenceList.slice(0)
  let currentIndex = state.currentIndex
  let currentSong = playlist[currentIndex]
  let fIndex = findIndex(playlist, song)
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  if (fIndex > -1) {
    if (currentIndex > fIndex) {
      playlist.splice(fIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fIndex++, 1)
    }
  }
  let currentsIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentIndex, 0, song)
  if (fsIndex > -1) {
    if (currentsIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex++, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

export const saveSearchHistory = function ({commit}, value) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(value))
}

export const deleteSearchHistory = function ({commit}, value) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(value))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice(0)
  let sequenceList = state.sequenceList.slice(0)
  let currentIndex = state.currentIndex
  let pindex = findIndex(playlist, song)
  let sIndex = findIndex(sequenceList, song)
  playlist.splice(pindex, 1)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pindex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (!playlist.length) {
    commit(types.SET_PLAYING, false)
  } else {
    commit(types.SET_PLAYING, true)
  }
}

export const clearSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING, false)
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const savaFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
