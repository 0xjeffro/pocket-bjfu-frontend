// components/content-actionsheet/content-actionsheet.js
const { getOpenId, putData, postData, Login } = require("../../utils/util");
import bus from 'iny-bus';
Component({
    /**
     * 组件的属性列表
     */
    lifetimes: {
        attached: function() {
          // 在组件实例进入页面节点树时执行
            bus.on('contentActionSheetShow', (contentId, contentText , author) => {
                console.log(contentId, contentText, author)
                const app = getApp()
                let openId = getOpenId()
                let copy = {
                    name: '复制',
                }
                let report = {
                    name: '举报',
                }
                let delete_ = {
                    name: '删除',
                }
                let shield = {
                    name: '屏蔽',
                }

                let actions = []

                if (app.globalData.AdminUsers.indexOf(openId) !== -1) {
                    console.log('是管理员')
                    actions = [copy, shield]
                }
                else if (author === openId) {
                    console.log('是作者')
                    actions = [copy, delete_]
                }
                else{
                    console.log('是普通用户')
                    actions = [copy, report]
                }

                bus.emit('tabBarHide')
                this.setData({
                    showAction: true,
                    contentText: contentText,
                    contentId: contentId,
                    description: '#' + contentId,
                    actions: actions
                })
                console.log(this.data.options)
                

            })
        }
    },
    properties: {
    },
    observers: {
    },


    /**
     * 组件的初始数据
     */
    data: {
        showAction: false,
        contentId: undefined,
        contentText: '',
        description: '',
        actions: [
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onSelect(event) {
            let option = event.detail.name
            if (option === '复制') {
                wx.setClipboardData({
                  data: this.data.contentText,
                })
            }
            else if (option === '举报') {
                this.reportContent()
               
            }
            else if (option === '删除') {
                this.deleteContent()
            }
            else if (option === '屏蔽') {
                this.hideContent()
            }
            this.onClose()
        },
        onClose(event) {
            bus.emit('tabBarShow')
            
            this.setData({
                showAction: false
            })
        },
        deleteContent: async function () {
            try {
                await Login();
                let res = await putData('/content/' + this.data.contentId + '/', {
                    state: '2'
                })
                console.log(res.data)
                if (res.statusCode === 200) {
                    wx.showToast({
                        title: '内容已删除',
                        icon: 'none'
                    })
                    bus.emit('hideContent', this.data.contentId)
                } else {
                    throw new Error('操作失败')
                }
            } catch (e) {
                wx.showToast({
                    title: e,
                    icon: 'none'
                })
            }
        },
        reportContent: async function () {
            try {
                await Login();
                let res = await postData('/reportToContent/', {
                    contentId: this.data.contentId
                })
                console.log(res.data)
                if (res.statusCode === 201) {
                    wx.showToast({
                        title: '感谢反馈，该内容\n将不再为您展示。',
                        icon: 'none'
                    })
                } else {
                    throw new Error('操作失败')
                }
            } catch (e) {
                wx.showToast({
                    title: e,
                    icon: 'none'
                })
            }
        },
        hideContent: async function () {
            try {
                await Login();
                let res = await putData('/content/' + this.data.contentId + '/', {
                    state: '0'
                })
                console.log(res.data)
                if (res.statusCode === 200) {
                    wx.showToast({
                        title: '已屏蔽',
                        icon: 'none'
                    })
                } else {
                    throw new Error('操作失败')
                }
            } catch (e) {
                wx.showToast({
                    title: e,
                    icon: 'none'
                })
            }
        }
    }
})
