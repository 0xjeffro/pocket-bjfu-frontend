// pages/changyonglianjie/changyonglianjie.js
const { Login, getData, postData } = require("../../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadingShow: true,
        loadingFail: false,
        linkList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu({
            success: (res) => {},
        })
        this.loadData();
    },
    loadData: async function () {
        this.setData({
            loadingShow: true,
            loadingFail: false
        })
        try {
            await Login();
            let res = await getData('/changYongLianJie/', {
                ordering: '-priority' 
            })
            console.log(res.statusCode)
            if (res.statusCode === 200) {
                this.setData({
                  loadingShow: false,
                  linkList: res.data
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
    copy: function (event) {
        console.log(event.currentTarget.dataset)
        wx.setClipboardData({
            data: event.currentTarget.dataset.url,
            success (res) {
                wx.vibrateShort({
                  success: (res) => {},
                })
            }
        })
        postData('/changYongLianJieAddPriority/', {
            id: event.currentTarget.dataset.id
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