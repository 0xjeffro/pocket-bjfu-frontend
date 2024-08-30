// components/notice/notice.js
const { Login, getData, postData } = require("../../utils/util");
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        component: String
    },
    pageLifetimes: {
        show: function() {
          // 页面被展示
          this.loadData()
        },
    },
    lifetimes: {
        attached: function() {
          // 在组件实例进入页面节点树时执行
          this.loadData()
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        show: false,
        text: '',
        leftIcon: null,
        color: null,
        background: null,
        scrollable: null,
        mode: null,
        delay: 1,
        speed: 32,
        to_type: 'None',
        to_url: null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        loadData: async function () {
            try {
                await Login();
                let res = await getData('/notice', {
                    component: this.properties.component
                })
                if (res.statusCode === 200) {
                    console.log(res.data)
                    if (res.data.id === undefined){
                        console.log('无通知')
                        this.setData({
                            show: false
                        })
                    } else {
                        this.setData({
                            show: true,
                            text: res.data.content,
                            leftIcon: res.data.left_icon,
                            color: res.data.color,
                            background: res.data.background,
                            scrollable: res.data.scrollable,
                            mode: res.data.mode,
                            delay: res.data.delay,
                            speed: res.data.speed,
                            to_type: res.data.to_type,
                            to_url: res.data.to_url
                        })
                    }
                } else {
                }
            } catch {
            }
        },
        onClick: function () {
            if (this.data.to_type === 'url') {
                wx.navigateTo({
                    url: '/pages/webview/webview?' +
                    'url=' + encodeURIComponent(this.data.to_url)
                })
            }
        }
    }
})
