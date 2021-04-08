var express = require('express')
var compression = require('compression')
var config = require('./config/index')
var axios = require('axios')

var port = process.env.PORT || config.build.port

var app = express()

var apiRoutes = express.Router()

apiRoutes.get('/search', function (req, res) {
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

apiRoutes.get('/getHotKey', function (req, res) {
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

apiRoutes.get('/getCdSongList', function (req, res) {
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

apiRoutes.get('/getTopSongList', function (req, res) {
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

apiRoutes.get('/lyric', function (req, res) {
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

apiRoutes.get('/getSingerDetail', function (req, res) {
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

apiRoutes.get('/getSingerList', function (req, res) {
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

apiRoutes.get('/changeDicsList', function (req, res) {
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

apiRoutes.get('/getTopBanner', function (req, res) {
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

apiRoutes.get('/getSongUrl', function (req, res) {
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

app.use('/api', apiRoutes)

app.use(compression())

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
