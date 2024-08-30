// pages/kongjiaoshi/kongjiaoshi.js
const { Login, getData, postData } = require("../../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xnxq: [],
        stage: ['上学期', '下学期', '小学期'],
        value: [1, 0],
        loadingType: 'loading',
        pmShow: true, // 排名卡片显示状态
        result: []
    },
    query: async function() {
        this.setData({
            loadingType: 'loading',
            result: []
        })
        try {
            let xnxq = this.data.xnxq[this.data.value[0]] + '-' + (this.data.value[1] + 1).toString()
            await Login();
            let res = await getData('/chengJi/', {
                xnxq: xnxq,
                xh: wx.getStorageSync('xh'),
                pwd: wx.getStorageSync('pwd')
            })
            // console.log(res.statusCode)
            // console.log(res.data)
            if (res.statusCode === 200) {
                this.setData({
                  loadingType: 'end',
                  result: res.data.result
                })
                wx.vibrateShort()
            } else {
                this.setData({
                    loadingType: 'end'
                })
            }
        } catch {
            this.setData({
                loadingType: 'end'
            })
        }
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu({
            success: (res) => {},
        })
        this.initXnxq()
        this.query()
    },
    initXnxq: function (options) {
        let xh = wx.getStorageSync('xh') // 获取缓存中的学号
        let pre_xh = xh.substring(0,2) // 获取学号前两位
        let d = new Date()
        let suf_year = d.getFullYear().toString().substring(2,4) // 年份后缀
        let xnxq = []
        for (let i = parseInt(pre_xh); i <= parseInt(suf_year); i++) {
            xnxq.push('20' + i.toString() + '-' + '20' + (i+1).toString())
        }
        this.setData({
            xnxq: xnxq.reverse(),
        })
        this.setData({
            value: [1, 1]
        })
    },
    pickerChange: function(event) {
        console.log(event.detail)
        this.setData({
            value: event.detail.value
        })
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