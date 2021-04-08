export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandom(0, i)
    let arr1 = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = arr1
  }
  return _arr
}

export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
