import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import 'common/stylus/index.styl'
import store from './store'

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png'),
  error: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
