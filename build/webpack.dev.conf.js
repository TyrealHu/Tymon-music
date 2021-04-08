'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const axios = require('axios')
const bodyParser = require('body-parser')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap, usePostCSS: true})
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(app) {
      app.get('/api/search', function (req, res) {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

        axios.get(url, {
          headers: {
            origin: 'https://i.y.qq.com',
            referer: 'https://i.y.qq.com/'
          },
          params: req.query
        }).then(response => {
          response = response.data
          res.json({
            code: 0,
            data: response.data
          })
        })
      })

      app.get('/api/getHotKey', function (req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
          },
          params: req.query
        }).then(response => {
          response = response.data
          let hotKey = response.data.hotkey
          res.json({
            code: 0,
            data: {
              hotKey: hotKey
            }
          })
        })
      })

      app.get('/api/getCdSongList', function (req, res) {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
          },
          params: req.query
        }).then(response => {
          response = response.data
          const cdlist = response.cdlist[0]
          res.json({
            code: 0,
            data: {
              cdlist
            }
          })
        }).catch(e => {
          console.log(e)
        })
      })

      app.get('/api/getTopSongList', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
          },
          params: req.query
        }).then(response => {
          response = response.data
          let songInfoList = response.detail.data.songInfoList
          res.json({
            code: 0,
            data: {
              songInfoList: songInfoList
            }
          })
        }).catch(e => {
          console.log(e)
        })
      })

      app.get('/api/lyric', function (req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
          },
          params: req.query
        }).then((response) => {
          let ret = response.data
          res.json({
            code: 0,
            data: {
              ret
            }
          })
        }).catch((e) => {
          console.log(e)
        })
      })

      app.get('/api/getSingerDetail', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data
          let singerSongList = response.singerSongList.data
          res.json({
            code: 0,
            data: {
              singerSongList
            }
          })
        }).catch(e => {
          console.log(e)
        })
      })

      app.get('/api/getSingerList', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data
          let singerlist = response.singerList.data.singerlist
          let tagsIndex = response.singerList.data.tags.index
          let index = response.singerList.data.index
          res.json({
            code: 0,
            data: {
              index,
              singerlist,
              tagsIndex
            }
          })
        }).catch(e => {
          console.log(e)
        })
      })

      app.get('/api/changeDicsList', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then((response) => {
          response = response.data
          let flag = response.playlist ? 'playlist' : 'hot'
          let categoryList = []
          let newCategoryList = []
          if (flag === 'playlist') {
            categoryList = response.playlist.data.v_playlist
            for (let i = 0; i < 10; i++) {
              newCategoryList[i] = categoryList[i]
            }
            categoryList = newCategoryList
          } else {
            categoryList = response.recomPlaylist.data.v_hot
            for (let i = 0; i < 10; i++) {
              newCategoryList[i] = categoryList[i]
            }
            categoryList = newCategoryList
          }
          res.json({
            code: 0,
            data: {
              categoryList: categoryList
            }
          })
        }).catch((e) => {
          console.log(e)
        })
      })

      app.get('/api/getTopBanner', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then((response) => {
          response = response.data
          let category = response.category.data.category[0].items
          let dicsList = response.recomPlaylist.data.v_hot
          let content = response.focus.data && response.focus.data.shelf.v_niche[0].v_card
          let toplist = response.toplist.data.group
          if (dicsList.length > 10) {
            let newDicsList = []
            for (let i = 0; i < 10; i++) {
              newDicsList[i] = dicsList[i]
            }
            dicsList = newDicsList
          }
          let newCategory = []
          let randomNumList = []
          while (newCategory.length < 4) {
            let randomNum = Math.floor(Math.random() * 16)
            if (randomNumList.indexOf(randomNum) > -1) {
              continue
            }
            randomNumList.push(randomNum)
            newCategory.push(category[randomNum])
          }
          category = newCategory
          res.json({
            code: 0,
            data: {
              slider: content,
              dicsList: dicsList,
              category: category,
              toplist: toplist
            }
          })
        }).catch((e) => {
          console.log(e)
        })
      })

      app.get('/api/getSongUrl', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

        axios.get(url, {
          headers: {
            origin: 'https://y.qq.com',
            referer: 'https://y.qq.com/'
          },
          params: req.query
        }).then(response => {
          response = response.data
          let data = response.req_0.data
          res.json({
            code: 0,
            data: data
          })
        }).catch(e => {
          console.log(e)
        })
      })

    },
    historyApiFallback: true,
    hot: true,
    host: process.env.HOST || config.dev.host,
    port: process.env.PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true,
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
