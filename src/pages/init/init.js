// pages/welcome/welcome.js
const { Login, getData, postData } = require("../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.hideShareMenu({
        success: (res) => {},
      })
      wx.lin.showToast({
        title: '正在进入',
        icon: 'loading',
        duration: 1500000,
        mask: false
    })
      this.IdentityCheck()
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
    },
    IdentityCheck: async function () {
        let verifyType = wx.getStorageSync('verifyType') // 看本地是否有学号信息
        console.log(verifyType)
        if (! verifyType) {
          try {
            await Login();
            let res = await getData('/getUserInfo/', {})
            if (res.statusCode === 200) {
              verifyType = res.data.verifyType
              wx.setStorageSync('xh', res.data.xh)
              wx.setStorageSync('pwd', res.data.pwd)
              wx.setStorageSync('verifyType', res.data.verifyType)
              // console.log(res.data)
            } else {
              throw new Error('网络错误')
            }
          } catch (e) {
          }
        }
        if (verifyType && verifyType !== "0" && verifyType !=="x") { // 有，说明登录过，执行页面初始化逻辑
          wx.switchTab({
            url: '/pages/index/index',
          })
        } else { // 没有，重定向到登录页面
          wx.redirectTo({
            url: '/pages/start/start',
          })
        }
    },
    refresh: function () {
      setTimeout(() => {
        this.IdentityCheck()
      }, 2000)
    }
})