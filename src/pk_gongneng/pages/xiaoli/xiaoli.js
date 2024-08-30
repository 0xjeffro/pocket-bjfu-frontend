const { Login, getData, postData } = require("../../../utils/util");

// pages/xiaoli/xiaoli.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadingShow: true,
        loadingFail: false,
        imgList: []
    },
    preview: function (event) {
        console.log(event)
        wx.previewImage({
          urls: [event.currentTarget.dataset.url],
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.hideShareMenu({
        success: (res) => {},
      })
      this.loadData()
    },
    loadData: async function () {
      this.setData({
        loadingShow: true,
        loadingFail: false
      })
      try {
        await Login();
        let res = await getData('/xiaoLi/', {
            ordering: '-priority' 
        })
        if (res.statusCode === 200) {
          this.setData({
            loadingShow: false,
            imgList: res.data
          })
        } else {
          this.setData({
            loadingShow: false,
            loadingFail: true
          })
        }
      } catch {
        this.setData({
          loadingShow: false,
          loadingFail: true
        })
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
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})