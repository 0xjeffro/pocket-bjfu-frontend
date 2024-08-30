// components/t-switch/t-switch.js
import bus from 'iny-bus'
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
        back: 'back',
        backStyle: '',
        left: 'left active',
        right: 'right',

        state: 'left'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleLeft () {
            console.log('handle left')
            this.setData({
                back: 'back right-to-left',
                right: 'right',
                left: 'left active'
            })
            
            
            let that = this
            setTimeout(function () {
                that.setData({
                    backStyle: 'left: 4rpx;'
                })
                if (that.data.state === 'right') {
                    // 说明发生了状态切换，通知兄弟组件切换查找字段
                    bus.emit('switchToDefault')
                }
                that.setData({
                    state: 'left'
                })
            }, 200);
            
        },
        handleRight () {
            console.log('handle right')
            this.setData({
                back: 'back left-to-right',
                left: 'left',
                right: 'right active'
            })
            
            
            let that = this
            setTimeout(function () {
                that.setData({
                    backStyle: 'left: 110rpx'
                })
                if (that.data.state === 'left') {
                    // 说明发生了状态切换，通知兄弟组件切换查找字段
                    bus.emit('switchToLatest')
                }
                that.setData({
                    state: 'right'
                })
            }, 200);
            
        }
    }
})
