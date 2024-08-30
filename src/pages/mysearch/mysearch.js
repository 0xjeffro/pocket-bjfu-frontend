// pages/mysearch/mysearch.js
const { Login, getData, postData } = require("../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchValue: '',
        contentList: [],
        next: null,
        count: 10000000, // 帖子总数,
        loadType: 'end',
        loadingShow: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.hideShareMenu({
        success: (res) => {},
      })
    },
    loadContent: async function () {
        if (this.data.count <= this.data.contentList.length) {
          this.setData({
            loadingShow: true,
            loadType: 'end'
          })
          return
        } else {
          this.setData({
            loadingShow: true,
            loadType: 'loading'
          })
        }
        
        try {
          await Login()
          let url = ''
          if (this.data.next === null) {
            url = '/content/?ordering=-createTime&page=1&search=' + encodeURIComponent(this.data.searchValue.toString())
          } else {
              url = this.data.next
          }
          let res = await getData(url, {})
          if (res.statusCode === 200) {
            // console.log(res.data)
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
            this.setData({
                loadingShow: true,
                loadType: 'end'
            })
          } else {
            throw new Error('网络错误')
          }
        } catch (e) {
            console.log(e.message)
        }
    },
    onChange(e) {
        this.setData({
          contentList: [],
          next: null,
          count: 10000000,
          loadType: 'end',
          loadingShow: false,
        });
    },
    onSearch() {
        this.setData({
            contentList: [],
            next: null,
            count: 10000000,
            loadType: 'end',
            loadingShow: false,
        });
        this.loadContent()
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
        this.loadContent()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})