// components/kcb-card/kcb-card.js
const { Login, getData, postData } = require("../../utils/util");
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        month: '',
        date: '',
        day: '', //今天是星期几 ，1，2，3，4，5，6，7
        dayText: '',
        currentWeek: ' - ',
        lessons: null,
        noClassShow: false,
        isLoading: true, //默认首次加载是true,后续每次onShow不将其重置，以防闪烁
        noBind: false
    },
    pageLifetimes: {
        show: function() {
          // 页面被展示
            let d = new Date()
            let month = d.getMonth()
            let date = d.getDate()
            let day = d.getDay()
            if (day === 0) { // 星期日返回0
                day = 7
            }
            let wd = ['一', '二', '三', '四', '五', '六', '日']
            this.setData({
                month: month +1,
                date: date,
                day: day,
                dayText: wd[day - 1]
            })
            if (wx.getStorageSync('verifyType') === '2') {
                this.setData({
                    isLoading: false,
                    noBind: true
                })
                return
            }
            this.loadData()
        },
        hide: function() {
          // 页面被隐藏
        },
        resize: function(size) {
          // 页面尺寸变化
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        loadData: async function () {
            try {
                await Login();
                let res = await getData('/keChengBiao/', {
                    currentWeek: 'default',
                    xh: wx.getStorageSync('xh'),
                    pwd: wx.getStorageSync('pwd')
                })
                if (res.statusCode === 200) {
                    this.setData({
                        isLoading: false
                    })
                    this.setData({
                        currentWeek: res.data.currentWeek,
                        lessons: this.cacluLessons(res.data.kcb)
                    })
                } else {
                }
            } catch {
            }
        },
        cacluLessons: function (kcb) {
            // console.log(kcb)
            let lessonsToday = []
            let iter = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13']
            for (let i of iter) {
                for (let lesson of kcb) {
                    if (lesson.kcsj.slice(1,3) === i && this.data.day.toString() === lesson.kcsj.slice(0, 1)) {
                        lessonsToday.push(lesson)
                        break;
                    }
                }
            }
            for (let lesson of lessonsToday) {
                let kcsj = lesson.kcsj
                let kcsj_text = ''
                let t = Number(kcsj.slice(1, 3))
                if (t <= 5) {
                    kcsj_text = '上午'
                } else if (t <= 9) {
                    kcsj_text = '下午'
                } else {
                    kcsj_text = '晚上'
                }
                kcsj_text += t.toString()
                kcsj_text += '-'
                kcsj_text += Number(kcsj.substr(kcsj.length-2)).toString()

                lesson.kcsj_text = kcsj_text + '节'
            }
            // console.log(lessonsToday)
            return lessonsToday
        },
        toKeChengBiao: function () {
            if (wx.getStorageSync('verifyType') === '2')
            {
                Dialog.setDefaultOptions({
                    confirmButtonText: '好的，我晓得了',
                    confirmButtonColor: '#5abe80'
                })
                Dialog.alert({
                    title: '- 提示 -',
                    message: '使用【课程表】功能需关联学号。\n 新绿用户可在入学后，点击【聚合】-【切换学号】-【身份】-【本科生】关联学号。',
                }).then(() => {
                })
            }
            if (wx.getStorageSync('verifyType') === '1') 
            {
                wx.navigateTo({
                    url: '/pk_gongneng/pages/kechengbiao/kechengbiao',
                })
            }
        }
    },
    attached () {

    }
})
