// pages/kongjiaoshi/kongjiaoshi.js
const { Login, getData, postData } = require("../../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        zc: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周', '第9周', '第10周', '第11周', '第12周', '第13周', '第14周', '第15周', '第16周', '第17周', '第18周', '第19周'],
        xq: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        times: ['1-2节', '3-4节', '5节', '6-7节', '8-9节', '10-11-12节'],
        buildings: ['全部', '一教', '二教', '学研'],
        value: [2, 3, 1, 0],
        kjs: [],
        loadingType: 'loading'
    },
    query: async function() {
        this.setData({
            loadingType: 'loading',
            kjs: []
        })
        try {
            await Login();
            let res = await getData('/kongJiaoShi/', {
                type: 'request',
                week: this.data.value[0] + 1,
                day: this.data.value[1] + 1,
                jc: this.data.value[2],
                jxl: this.data.value[3],
                xh: wx.getStorageSync('xh'),
                pwd: wx.getStorageSync('pwd')
            })
            if (res.statusCode === 200) {
                // console.log(res.data)
                this.setData({
                    value: res.data.value,
                    kjs: res.data.kjs.kjs,
                    loadingType: 'end'
                })
            } else {
              wx.lin.showToast({
                  title: '网络错误',
                  icon: 'error',
                  duration: 1500,
                  mask: true
              })
              this.setData({
                kjs: [],
                loadingType: 'end'
              })
            }
          } catch {
              wx.lin.showToast({
                  title: '网络错误',
                  icon: 'error',
                  duration: 1500,
                  mask: true
              })
              this.setData({
                kjs: [],
                loadingType: 'end'
              })
          }
    },
    bindChange: function(e) {
        console.log(e.detail.value)
        this.setData({
            value: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu({
            success: (res) => {},
        })
        this.initData()
    },
    initData: async function () {
        try {
            wx.lin.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 150000,
                mask: true
            })
            await Login();
            this.setData({
                loadingType: 'loading',
                kjs: []
            })
            let res = await getData('/kongJiaoShi/', {
                type: 'default',
                xh: wx.getStorageSync('xh'),
                pwd: wx.getStorageSync('pwd')
            })
            if (res.statusCode === 200) {
                // console.log(res.data)
              this.setData({
                  value: res.data.value,
                  kjs: res.data.kjs.kjs,
                  loadingType: 'end'
              })
              wx.lin.hideToast({
                success: (res) => {},
              })
            } else {
              wx.lin.showToast({
                  title: '网络错误',
                  icon: 'error',
                  duration: 1500,
                  mask: true
              })
              this.setData({
                kjs: [],
                loadingType: 'end'
              })
            }
          } catch {
              wx.lin.showToast({
                  title: '网络错误',
                  icon: 'error',
                  duration: 1500,
                  mask: true
              })
              this.setData({
                kjs: [],
                loadingType: 'end'
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