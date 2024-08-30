// components/content-card/paiming-card/paiming-card.js
const { Login, getData, postData } = require("../../utils/util");
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
        loadingTextShow: true,
        contentTextShow: false,
        refreshButtonShow: false,
        desc: '',
        pm: []
    },

    /**
     * 组件的方法列表
     */
    methods: {
        loadData: async function () {
            try {
                this.setData({
                    loadingTextShow: true,
                    contentTextShow: false,
                    refreshButtonShow: false
                })
                await Login();
                let res = await getData('/paiMing/', {
                    xh: wx.getStorageSync('xh'),
                    pwd: wx.getStorageSync('pwd')
                })
                // console.log(res.statusCode)
                // console.log(res.data)
                if (res.statusCode === 200) {
                    this.setData({
                        desc: res.data.desc,
                        pm: res.data.pm,
                    })
                    this.setData({
                        loadingTextShow: false,
                        contentTextShow: true,
                        refreshButtonShow: false
                    })
                } else {
                    this.setData({
                        loadingTextShow: false,
                        contentTextShow: false,
                        refreshButtonShow: true
                    })
                }
            } catch {
                this.setData({
                    loadingTextShow: false,
                    contentTextShow: false,
                    refreshButtonShow: true
                })
            }
        },
    },
    
    attached: function () {
        this.loadData()
    },
})
