// pages/myfav/myfav.js
const { Login, getData, postData } = require("../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        contentList: [],
        next: '/myFav/?page=1&ordering=-createTime',
        count: 10000000, // 帖子总数,
        loadType: 'loading'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
      wx.hideShareMenu({
        success: (res) => {},
      })
        this.loadContent()
    },
    loadContent: async function () {
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
            let new_content = res.data.results
            let content_lis = this.data.contentList
            for (let c of new_content) {
              content_lis.push(c)
            }
            this.setData({
              contentList: content_lis,
              count: res.data.count,
              next: res.data.next
            })
          } else {
            throw new Error('网络错误')
          }
        } catch (e) {
            console.log(e.message)
        }
      },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom () {
        console.log('reach bottom')
        this.loadContent()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})