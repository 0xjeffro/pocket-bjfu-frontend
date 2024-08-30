// pages/kechengbiao/kechengbiao.js
const { Login, getData, postData } = require("../../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        zc: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
        weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        weekDate: [],
        weekDatePlaceHolder: ['-/-', '-/-', '-/-', '-/-', '-/-', '-/-', '-/-'],
        classNumber: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
        currentWeek: 'default',
        lessons: [],
        isViewingLessonInfo: false,
        viewingLessonInfo: ''
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
        wx.lin.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000000,
            mask: true
        })
        this.setData({
            weekDate: this.data.weekDatePlaceHolder
        })
        try {
          await Login();
          let res = await getData('/keChengBiao/', {
              currentWeek: this.data.currentWeek,
              xh: wx.getStorageSync('xh'),
              pwd: wx.getStorageSync('pwd')
          })
          if (res.statusCode === 200) {
            this.setData({
                weekDate: res.data.weekDate,
                lessons: this.calcLessonStyle(res.data.kcb),
                currentWeek: res.data.currentWeek
            })
            wx.lin.hideToast()
          } else {
            wx.lin.showToast({
                title: '网络错误',
                icon: 'error',
                duration: 1500,
                mask: true
            })
          }
        } catch {
            wx.lin.showToast({
                title: '网络错误',
                icon: 'error',
                duration: 1500,
                mask: true
            })
        }
    },
    clickTab: function (event) {
        let currentWeek = event.detail.index + 1
        this.setData({
            currentWeek: currentWeek
        })
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

    },
    calcLessonStyle: function (kcb) {
        // var colors = ['rgb(135, 194, 200)', 'rgb(187, 131, 233)', 'rgb(121, 143, 197)', 'rgb(228, 122, 128)', 'rgb(242, 169, 165)', 'rgb(137, 199, 166)', 'rgb(229, 166, 131)', 'rgb(225, 131, 162)'];
        var colors = ['#a0ee04', '#38ede8', '#01f39d', '#ffc32d', '#fddd3a', '#63d3f9', '#e08afe', '#7cb0fb', '#fc97dd', '#a8d744', '#ffa42f', '#63edf9', '#eb8eea']
        var kcColors = { };
        for(let lesson of kcb) {
            if (lesson.kcmc.length > 8) {
                lesson.kcmcShort = lesson.kcmc.slice(0, 8) + '..'
            } else {
                lesson.kcmcShort = lesson.kcmc
            }
            var kcsj = lesson.kcsj;
            var day = kcsj[0];
            var firstNumber = Number(kcsj.slice(1, 3));
            var nsCount = Math.ceil((kcsj.length - 1) / 2);
            var width = 710/7;
            var left = 46 + width * (day - 1) ;
            var perHeight = 1131 / 13;
            var top = 1 + perHeight * (firstNumber - 1);
            var height = perHeight * nsCount - 3;
            if (!kcColors[lesson.kcmc]) {
                kcColors[lesson.kcmc] = colors[Object.keys(kcColors).length % colors.length];
                // console.log(kcColors)
            }
            lesson['style'] = 'left: ' + left + 'rpx;top: ' + top + 'rpx;height: ' + height + 'rpx;background-color: ' + kcColors[lesson.kcmc];
        }
        // console.log(kcb)
        return kcb
    },
    closeLessonView: function () {
        this.setData({
            isViewingLessonInfo: false
        })
    },
    handleViewLessonInfo: function (event) {
        let kcsj = event.currentTarget.dataset.kcsj
        let kcmc = event.currentTarget.dataset.kcmc
        let jsmc = event.currentTarget.dataset.jsmc
        let kkzc = event.currentTarget.dataset.kkzc
        let jsxm = event.currentTarget.dataset.jsxm
        // let viewingLessonInfo = kcsj[0] + '、【' + kcmc + '】' + '[' + jsxm + ']@' +
        // jsmc + '(' + kkzc + '周)';
        let viewingLessonInfo = '课程：' + kcmc + '\n' +
            '授课教师：' + jsxm + '\n' + 
            '教室：' + jsmc + '\n' + 
            '开课周次：' + kkzc + '周'
        this.setData({
            viewingLessonInfo: viewingLessonInfo,
            isViewingLessonInfo: true
        })
    }
    

})