// components/ad-comment-list/ad-comment-list.js
const { Login, getData, postData } = require("../../utils/util");
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },
    lifetimes: {
        attached: function() {
          // 在组件实例进入页面节点树时执行
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
    },
    pageLifetimes: {
        show: function() {
          // 页面被展示
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        active: 1
    },

    /**
     * 组件的方法列表
     */
    methods: {
        customBindError (event) {
            if (event.detail.errCode === 1004) {
                this.setData({
                    active: 2
                })
            }
        }
    }
})
