// components/shadow-ad/shadow-ad.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
    },
    pageLifetimes: {
        
        show: function() {
          // 页面被展示
          console.log('————页面被显示————')
        },
        hide: function() {
            // 页面被隐藏
            console.log('————页面被隐藏————')
        },
    },
    lifetimes: {
        created: function() {
            // 在组件实例刚刚被创建时执行
            console.log('————created————')
        },
        attached: function() {
            // 在组件实例进入页面节点树时执行
            console.log('————attached————')
        },
        ready: function() {
            // 在组件在视图层布局完成后执行
            console.log('————ready————')
        },
        detached: function() {
            // 在组件实例被从页面节点树移除时执行
            console.log('————detached————')
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
    },

    /**
     * 组件的方法列表
     */
    methods: {
    }
})
