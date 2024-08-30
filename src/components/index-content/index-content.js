// components/index-content/index-content.js
const { Login, getData, postData, putData, getOpenId } = require("../../utils/util");
import bus from 'iny-bus'
Component({
    /**
     * 组件的属性列表
     */
    lifetimes: {
        attached: function() {
          // 在组件实例进入页面节点树时执行
          this.setData({
            likeColor: this.properties.isLike ? this.data._likeColor : this.data._dislikeColor
          })
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
    },
    properties: {
        number: Number,
        openId: String,
        contentText: String,
        contentImg: String,
        decorationUrl: String,
        time: String,
        nLike: Number,
        nComment: Number,
        isLike: Boolean,
        isFav: Boolean,
    },
    observers: {
        'contentText': function (contentText) {
            this.setData({
                contentText_d: contentText.length > 140 ? contentText.slice(0, 140) + '...': contentText
            })
        },
        'contentImg': function (contentImg) {
            let img_lis = contentImg.split('|')
            let urls_buf = []
            for(let img of img_lis) {
              if (img !== "") {
                urls_buf.push(img + '?imageView2/0/w/400/h/600')
              }
            }
            this.setData({
              urls: urls_buf
            })
        },
        'time': function (time) {
            this.setData({
                time_d: time
            })
        },
        'nComment': function (nComment) {
            this.setData({
                nComment_d: nComment
            })
        },
        'nLike': function (nLike) {
            this.setData({
                nLike_d: Math.max(this.properties.nLike, 0)
            })
        },
        'isLike': function (isLike) {
            this.setData({
                isLike_d: isLike,
                likeColor: isLike ? this.data._likeColor : this.data._dislikeColor
            })
        },
        'isFav': function (isFav) {
            this.setData({
                isFav_d: isFav
            })
        },
        'nComment': function (nComment) {
            this.setData({
                nComment_d: Math.max(this.properties.nComment, 0)
            })
        },
        
    },

    /**
     * 组件的初始数据
     */
    data: {
        show: true,
        
        urls: [],
        time_d: '',
        contentText_d: '',
        isLike_d: true,
        isFav_d: false,
        nLike_d: 0,
        nComment_d: 0,
        _likeColor: 'pink',
        _dislikeColor: '#c0c4d0',
        likeColor: '#c0c4d0',
        animationType: "",

        showAction: false,
        description: '',
        actions: [
        ],
    },
    

    /**
     * 组件的方法列表
     */
    methods: {
        likeClick: async function () {
            try {
                this.likeReverse()
                await Login();
                let res = await postData('/likeToContent/', {
                    contentId: this.properties.number,
                })
                // console.log(res.data)
                if (res.statusCode === 201) {
                    console.log('点赞成功')
                } else {
                    throw new Error('操作失败')
                }
            } catch {
                this.likeReverse()
                wx.lin.showToast({
                    title: '操作失败',
                })
            }
        },
        favClick: async function () {
            try {
                this.favReverse()
                await Login();
                let res = await postData('/favToContent/', {
                    contentId: this.properties.number
                })
                if (res.statusCode === 201) {
                    console.log('收藏成功')
                } else {
                    throw new Error('操作失败')
                }
            } catch {
                this.likeReverse()
                wx.lin.showToast({
                    title: '操作失败',
                })
            }
        },
        likeReverse: function () {
            // 这个函数实现点赞状态的反转操作
            if (this.data.isLike_d) {
                this.setData({
                    nLike_d: Math.max(this.data.nLike_d - 1, 0),
                    likeColor: this.data._dislikeColor,
                    isLike_d: false,
                    animationType: ''
                })
            } else {
                this.setData({
                    nLike_d: this.data.nLike_d + 1,
                    likeColor: this.data._likeColor,
                    isLike_d: true,
                    animationType: 'animated bounceIn'
                })
                wx.vibrateShort()
            }
        },
        favReverse: function () {
            if (this.data.isFav_d) {
                this.setData({
                    isFav_d: false
                })
            } else {
                this.setData({
                    isFav_d: true
                })
                wx.vibrateShort()
            }
        },
        toDetail () {
            wx.getSetting({
                withSubscriptions: true,
                success: (res) => {
                    console.log("SUCCESS", res)
                    if (res.subscriptionsSetting.itemSettings === undefined) {
                    } else {
                        console.log('FUCK', res.subscriptionsSetting.itemSettings)
                        wx.requestSubscribeMessage({
                            tmplIds: ['mcVxahzO9c1kmGRGIPNqcpl-ktqYudlqWmh55osOMxs'],
                            complete (res) {
                              console.log("HACK SUCCESS")
                            }
                        })
                    }
                }
            })
            
            wx.navigateTo({
                url: '/pages/index/detail/detail?' + 
                'id=' + this.properties.number
            })
        },
        longPress () {
            const app = getApp()
            let openId = getOpenId()
            let copy = {
                name: '复制',
                className: 'option-style'
            }
            let report = {
                name: '举报',
                className: 'option-style'
            }
            let delete_ = {
                name: '删除',
                className: 'option-style'
            }
            let shield = {
                name: '违规屏蔽',
                subname: '内容涉嫌违规，系统自动屏蔽',
                className: 'option-style'
            }
            let shield2 = {
                name: '辅助屏蔽',
                subname: '应相关方面要求，该内容已被删除',
                className: 'option-style'
            }
            let cold = {
                name: '🧊🧊🧊🧊',
                subname: '',
                className: 'option-style'
            }

            let actions = []

            if (app.globalData.AdminUsers.indexOf(openId) !== -1) {
                console.log('是管理员')
                actions = [copy, shield, shield2, cold]
            }
            else if (this.properties.openId === openId) {
                console.log('是作者')
                actions = [copy, ]
            }
            else{
                console.log('是普通用户')
                actions = [copy, report]
            }

            bus.emit('tabBarHide')
            this.setData({
                showAction: true,
                description: '#' + this.properties.number,
                actions: actions
            })
        },
        onSelect(event) {
            let option = event.detail.name
            if (option === '复制') {
                wx.setClipboardData({
                  data: this.properties.contentText,
                })
            }
            else if (option === '举报') {
                this.reportContent()
            }
            else if (option === '删除') {
                this.deleteContent()
            }
            else if (option === '违规屏蔽') {
                this.hideContent()
            }
            else if (option === '辅助屏蔽') {
                this.hideContent2()
            }
            else if (option === '🧊🧊🧊🧊') {
                this.coldContent()
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
                let res = await putData('/content/' + this.properties.number + '/', {
                    state: '2'
                })
                if (res.statusCode === 200) {
                    wx.showToast({
                        title: '内容已删除',
                        icon: 'none'
                    })
                    this.setData({
                        show: false
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
        reportContent: async function () {
            try {
                await Login();
                let res = await postData('/reportToContent/', {
                    contentId: this.properties.number
                })
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
                let res = await putData('/content/' + this.properties.number + '/', {
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
        },
        hideContent2: async function () {
            try {
                await Login();
                let res = await putData('/content/' + this.properties.number + '/', {
                    state: '3'
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
        },
        coldContent: async function () {
            try {
                await Login();
                let res = await putData('/content/' + this.properties.number + '/', {
                    state: '7'
                })
                console.log(res.data)
                if (res.statusCode === 200) {
                    wx.showToast({
                        title: '🧊🧊🧊🧊',
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
