//index.js
import bus from 'iny-bus'
import deviceUtil from '../../miniprogram_npm/lin-ui/utils/device-util'
const { Login, getData, postData } = require("../../utils/util");
Page({
  data: {
    contentList: [],
    ad_contentList: [],
    ordering: '-priority',
    next: '/content/?page=1&ordering=-priority',
    count: 10000000, // 帖子总数,
    successMessageShow: false,
    loadType: 'loading',
    capsuleBarHeight: deviceUtil.getNavigationBarHeight()
  },

  //事件处理函数
  getNavigationBarHeight: function() {
    const capsuleBarHeight = deviceUtil.getNavigationBarHeight()
    console.log(`CapsuleBar 的高度为${capsuleBarHeight}rpx`)
  },
  bindViewTap: function() {
  },
  onLoad: function () {
    wx.hideShareMenu({
      success: (res) => {},
    })
    this.getTabBar().setData({
      selected: 0
    })
    
    this.loadContent()
    bus.on('switchToDefault', () => {
      this.setData({
        ordering: '-priority',
        next: '/content/?page=1&ordering=-priority'
      })
      this.setData({
        contentList: [],
        ad_contentList: []
      })
      this.loadContent()
    })
    bus.on('switchToLatest', () => {
      this.setData({
        ordering: '-id',
        next: '/content/?page=1&ordering=-id'
      })
      this.setData({
        contentList: [],
        ad_contentList: []
      })
      this.loadContent()
    })
    bus.on('SynLikeEvent', (id) => {
      console.log('SynLikeEvent', id)
      let len = this.data.contentList.length
      for (let i = 0; i<len; ++i) {
        if (this.data.contentList[i].id === id) {
          let it = this.data.contentList[i]
          if (it.isLike) {
            it.isLike = false
            it.nLike = it.nLike - 1
          } else {
            it.isLike = true
            it.nLike = it.nLike + 1
          }
          let s = 'contentList[' + i.toString() + ']'
          this.setData({
            [s]: it
          })
          break;
        }
      }
    })
    bus.on('SynFavEvent', (id) => {
      console.log('SynLikeEvent', id)
      let len = this.data.contentList.length
      for (let i = 0; i<len; ++i) {
        if (this.data.contentList[i].id === id) {
          let it = this.data.contentList[i]
          if (it.isFav) {
            it.isFav = false
          } else {
            it.isFav = true
          }
          let s = 'contentList[' + i.toString() + ']'
          this.setData({
            [s]: it
          })
          break;
        }
      }
    })
  },
  loadContent: async function () {
    console.log(this.data.count , this.data.contentList.length)
    if (this.data.count <= this.data.contentList.length) {
      this.setData({
        loadType: 'end'
      })
      return
    } else {
      this.setData({
        loadType: 'loading'
      })
    }
    
    try {
      await Login()
      let res = await getData(this.data.next, {})
      if (res.statusCode === 200) {
        console.log(res.data)
        let new_content = res.data.results
        let ad_new_content = this.insertAD(res.data.results)

        let content_lis = this.data.contentList
        let ad_content_lis = this.data.ad_contentList

        for (let c of new_content) {
          content_lis.push(c)
        }

        for (let c of ad_new_content) {
          ad_content_lis.push(c)
        }
        
        this.setData({
          contentList: content_lis,
          ad_contentList: ad_content_lis,
          count: res.data.count,
          next: res.data.next
        })
      } else {
        throw new Error('网络错误')
      }
    } catch (e) {}
  },
  refreshContent: async function () {
    this.setData({
      next: '/content/?page=1&ordering=' + this.data.ordering,
      count: 10000000, // 帖子总数
    })
    try {
      await Login()
      let res = await getData(this.data.next, {})
      if (res.statusCode === 200) {
        // console.log(res.data)
        let new_content = res.data.results
        let ad_new_content = this.insertAD(res.data.results)

        let content_lis = []
        let ad_content_lis = []

        for (let c of new_content) {
          content_lis.push(c)
        }

        for (let c of ad_new_content) {
          ad_content_lis.push(c)
        }

        this.setData({
          contentList: content_lis,
          ad_contentList: ad_content_lis,
          count: res.data.count,
          next: res.data.next
        })
        wx.stopPullDownRefresh()
        this.setData({
          successMessageShow: true
        })
        wx.vibrateShort()
        
      } else {
        throw new Error('网络错误')
      }
    } catch (e) {
      wx.stopPullDownRefresh()
    }
  },
  insertAD (new_content) {
    // 在列表中插入广告
    // let pos = 3
    // let res = []
    // for (let i = 0; i< new_content.length; i++)
    // {
    //   res.push(new_content[i])
    //   if (i === pos)
    //   {
    //     res.push({
    //       'is_ad': true,
    //       'id': 0 - parseInt(new_content[i].id)
    //     })
    //   }
    // }
    // console.log('###############', res)

    // 在列表末插入广告
    let res = new_content
    let max = 10000
    let min = 1 //生成1-10000的随机数
    res.push({
        'is_ad': true,
        'id': 0 - Math.floor(Math.random() * (max - min)) + min
    })
    // console.log('ad_res', res)
    return res
  },
  onPullDownRefresh () { // 监听下拉刷新事件
    setTimeout(() => {
      this.refreshContent()
      wx.uma.trackEvent('onPullDownRefresh_forum')
    }, 260)
  },
  onReachBottom () {
    console.log('reach bottom')
    this.loadContent()
  },
  onPageScroll(e) {
  },
  toMyFav() {
    wx.navigateTo({
      url: '/pages/myfav/myfav',
    })
  },
  toMyContent() {
    wx.navigateTo({
      url: '/pages/mycontent/mycontent',
    })
  },
  toMySearch() {
    wx.navigateTo({
      url: '/pages/mysearch/mysearch',
    })
  }
})