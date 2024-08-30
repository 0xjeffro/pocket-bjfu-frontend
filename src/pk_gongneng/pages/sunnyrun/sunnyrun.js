// pages/sunnyrun/sunnyrun.js
const { Login, getData, postData } = require("../../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        achievements: [],
        xnxq: '*',
        teacher: '*',
        validTimesNormal: '*',
        validTimesAPP: '*',
        xh: '-',
        noDataShow: false,
        loadingShow: true,
        loadingErrorShow: false
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
        xnxq: '*',
        teacher: 'null',
        validTimesNormal: '*',
        validTimesAPP: '*',
        xh: '-',
        noDataShow: false,
        loadingShow: true,
        loadingErrorShow: false
      })
      try {
        await Login();
        let res = await getData('/sunnyRun/', {
            xh: wx.getStorageSync('xh')
        })
        if (res.statusCode === 200) {
          // console.log(res.data)
          this.setData({
            loadingShow: false,
            loadingErrorShow: false,
            xh: res.data.xh,
            xnxq: res.data.xnxq,
            teacher: res.data.teacher,
            validTimesNormal: res.data.validTimesNormal
          })
          let achievements = res.data.achievements
          for (let i=0; i < achievements.length; i++) {
            achievements[i].id = i
            if (achievements[i].isValid) {
              achievements[i].t_isValid = '成绩有效'
              achievements[i].dotColor = '#5abe64'
            } else {
              achievements[i].t_isValid = '成绩无效'
              achievements[i].dotColor = '#ccc'
            }
            achievements[i].t_speed = achievements[i].speed.toFixed(2)
            if (i != achievements.length - 1) {
              achievements[i].showGhostDot = true //幽灵节点，为了将无效节点置为灰色
            } else {
              achievements[i].showGhostDot = false // 最后一个记录的幽灵节点不显示
            }
          }
          
          console.log(achievements)
          this.setData({
            achievements: achievements
          })
          if (this.data.achievements.length === 0) {
            this.setData({
              noDataShow: true
            })
          }
        } else {
          this.setData({
            noDataShow: false,
            loadingShow: false,
            loadingErrorShow: true
          })
        }
      } catch {
        this.setData({
          noDataShow: false,
          loadingShow: false,
          loadingErrorShow: true
        })
      }
    },
    bindReload: function () {
      this.loadData()
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