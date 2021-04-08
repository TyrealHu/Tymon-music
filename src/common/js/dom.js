export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, value) {
  const prefix = 'data-'
  if (value) {
    return el.setAttribute(prefix + name, value)
  }
  return el.getAttribute(prefix + name)
}

let elementStyle = document.createElement('div').style

let screenPrefix = (() => {
  const prefix = {
    webkit: 'WebkitTransform', // safari,chrome等
    Moz: 'MozTransform', // firefox
    O: 'OTransform', // Opera
    ms: 'MsTransform', // ie
    standard: 'transform' // 默认
  }

  for (let key in prefix) {
    if (elementStyle[prefix[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function addPrefix(style) {
  if (screenPrefix) { // 添加前缀返回的方法是false可能是出error了
    return false
  }
  if (screenPrefix === 'transform') { // 说明不用添加前缀，默认即可
    return style
  }
  // 驼峰命名
  return screenPrefix + style.charAt(0).toUpperCase() + style.substr(1)
}