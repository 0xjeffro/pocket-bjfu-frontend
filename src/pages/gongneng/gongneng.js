// pages/gongneng/gongneng.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
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

        // 初始化tabbar
        this.getTabBar().setData({
            selected: 1,
            ['list[0].text']: "发现"
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
        return {
            title: '',
            desc: '',
            path: '/pages/init/init'
          }
    },

    toChangyonglianjie: function(event) { // 跳转到常用链接
        wx.navigateTo({
          url: '/pk_gongneng/pages/changyonglianjie/changyonglianjie',
        })
    },

    toXiaoli: function(event) { // 跳转到校历
        wx.navigateTo({
          url: '/pk_gongneng/pages/xiaoli/xiaoli',
        })
    },
    toStart: function(event) {
        wx.navigateTo({
            url: '/pages/start/start',
        })
    },
    toSunnyRun: function(event) {
        if (wx.getStorageSync('verifyType') === '2')
        {
            Dialog.setDefaultOptions({
                confirmButtonText: '好的，我晓得了',
                confirmButtonColor: '#5abe80'
            })
            Dialog.alert({
                title: '- 提示 -',
                message: '使用【阳光长跑】功能需关联学号。\n 新绿用户可在入学后，点击【聚合】-【切换学号】-【身份】-【本科生】关联学号。',
            }).then(() => {
            })
        }
        if (wx.getStorageSync('verifyType') === '1')
        {
            wx.navigateTo({
                url: '/pk_gongneng/pages/sunnyrun/sunnyrun',
            })
        }
        
    },
    toKongJiaoShi: function(event) {
        if (wx.getStorageSync('verifyType') === '2')
        {
            Dialog.setDefaultOptions({
                confirmButtonText: '好的，我晓得了',
                confirmButtonColor: '#5abe80'
            })
            Dialog.alert({
                title: '- 提示 -',
                message: '使用【空教室】功能需关联学号。\n 新绿用户可在入学后，点击【聚合】-【切换学号】-【身份】-【本科生】关联学号。',
            }).then(() => {
            })
        }
        if (wx.getStorageSync('verifyType') === '1')
        {
            wx.navigateTo({
                url: '/pk_gongneng/pages/kongjiaoshi/kongjiaoshi',
            })
        }
    },
    toChengJi: function(event) {
        if (wx.getStorageSync('verifyType') === '2')
        {
            Dialog.setDefaultOptions({
                confirmButtonText: '好的，我晓得了',
                confirmButtonColor: '#5abe80'
            })
            Dialog.alert({
                title: '- 提示 -',
                message: '使用【成绩查询】功能需关联学号。\n 新绿用户可在入学后，点击【聚合】-【切换学号】-【身份】-【本科生】关联学号。',
            }).then(() => {
            })
        }
        if (wx.getStorageSync('verifyType') === '1')
        {
            wx.navigateTo({
                url: '/pk_gongneng/pages/chengji/chengji',
            })
        }
    },
    toJiaoWuNews: function(event) {
        wx.navigateTo({
            url: '/pk_gongneng/pages/jiaowunews/jiaowunews',
        })
    },
    clickCao: function() {
        Dialog.setDefaultOptions({
            confirmButtonText: '好的，加油！',
            confirmButtonColor: '#5abe80'
        })
        Dialog.alert({
            title: '-(o・ω・o)-',
            message: '这里是校园网查询、夜间模式、福利抽奖等大坑，没做完先放个盆栽占位',
        }).then(() => {
        })
    }
})
