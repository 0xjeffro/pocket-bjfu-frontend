// pages/jiaowunews/jiaowunews.js
const { Login, getData, postData } = require("../../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        next: '',
        loadingShow: true,
        loadingType: 'loading',
        lis: []
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
            loadingType: 'loading'
        })
        try {
            await Login();
            let res = await getData('/jiaoWuChuNews/', {
                ordering: '-time' 
            })
            console.log(res.statusCode)
            if (res.statusCode === 200) {
                this.setData({
                  lis: res.data.results,
                  next: res.data.next,
                  loadingShow: false
                })
            } else {
                wx.lin.showToast({
                    title: '网络错误',
                })
            }
        } catch {
            wx.lin.showToast({
                title: '网络错误',
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
    onReachBottom: async function () {
        if (this.data.next === null) {
            console.log('next is null')
            this.setData({
                loadingShow: true,
                loadingType: 'end'
            })
            return
        }
        this.setData({
            loadingShow: true,
            loadingType: 'loading'
        })
        try {
            await Login();
            let res = await getData(this.data.next, {
                ordering: '-time' 
            })
            // console.log(res.statusCode)
            // console.log(res.data)
            if (res.statusCode === 200) {
                this.setData({
                  lis: this.data.lis.concat(res.data.results),
                  next: res.data.next,
                  loadingShow: false
                })
            } else {
                wx.lin.showToast({
                    title: '网络错误',
                })
            }
        } catch {
            wx.lin.showToast({
                title: '网络错误',
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    toSnapShot (event) {
        let dataset = event.currentTarget.dataset
        wx.navigateTo({
          url: '/pk_gongneng/pages/jiaowunews/snapshot/snapshot?' +
          'url=' + encodeURIComponent(dataset.url) +
          '&pic_url=' + encodeURIComponent(dataset.pic_url) +
          '&title=' + encodeURIComponent(dataset.title)
        })
    }
})