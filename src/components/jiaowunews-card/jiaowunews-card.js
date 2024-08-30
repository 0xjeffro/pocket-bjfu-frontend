// components/jiaowunews-card/jiaowunews-card.js
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
        lis: []
    },
    pageLifetimes: {
        show: function() {
          // 页面被展示
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
                this.setData({
                    loadingTextShow: true,
                    contentTextShow: false,
                    refreshButtonShow: false
                })
                await Login();
                let res = await getData('/jiaoWuChuNews/', {
                    ordering: '-time'
                })
                // console.log(res.data)
                if (res.statusCode === 200) {
                    this.setData({
                        lis: res.data.results
                    })
                } else {
                }
            } catch {
            }
        }
    }
})
