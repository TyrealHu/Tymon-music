import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15
const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArr(arr, compare) {
  const index = arr.findIndex(compare)
  if (index < 0) {
    return
  }
  arr.splice(index, 1)
}

export function saveSearch(value) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, value, (item) => {
    return item === value
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function getSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(value) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArr(searches, (item) => {
    return item === value
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay(song) {
  let plays = storage.get(PLAY_KEY, [])
  insertArray(plays, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, plays)
  return plays
}

export function getPlay() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  let favorites = storage.get(FAVORITE_KEY, [])
  insertArray(favorites, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, favorites)
  return favorites
}

export function deleteFavorite(song) {
  let favorites = storage.get(FAVORITE_KEY, [])
  deleteFromArr(favorites, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, favorites)
  return favorites
}

export function getFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
