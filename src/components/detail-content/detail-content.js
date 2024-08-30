// components/detail-content/detail-content.js
const { Login, getData, postData } = require("../../utils/util");
import bus from 'iny-bus'
Component({
    /**
     * 组件的属性列表
     */
    lifetimes: {
        attached: function() {
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
    },
    observers: {
        'number': function (number) {
            this.loadData()
        }
    },
    properties: {
        number: Number,
    },

    /**
     * 组件的初始数据
     */
    data: {
        skeletonShow: true,
        urls: [],
        isLike_d: true,
        isFav_d: false,
        time_d: '',
        contentText: '',
        nLike_d: 0,
        nComment_d: 0,
        decorationUrl_d: '',

        _likeColor: 'pink',
        _dislikeColor: '#c0c4d0',
        likeColor: '#c0c4d0',
        animationType: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        loadData: async function () {
            try {
                this.setData({
                    skeletonShow: true
                })
                await Login();
                let res = await getData('/content/' + this.properties.number.toString() + '/', {})
                // console.log(res.data)
                if (res.statusCode === 200) {
                    let data = res.data
                    let contentImg = data.contentImg
                    let img_lis = contentImg.split('|')
                    let urls_buf = []
                    for(let img of img_lis) {
                    if (img !== "") {
                        urls_buf.push(img)
                    }
                    }
                    this.setData({
                    urls: urls_buf
                    })
                    this.setData({
                        isLike_d: data.isLike,
                        isFav_d: data.isFav,
                        nLike_d: Math.max(data.nLike, 0),
                        time_d: data.time,
                        decorationUrl_d: data.decoration_url,
                        contentText: data.contentText,
                        nComment_d: Math.max(data.nComment, 0),
                        likeColor: data.isLike ? this.data._likeColor : this.data._dislikeColor
                    })
                    if (data.state === '0') {
                        this.setData({
                            contentText: '内容涉嫌违规，系统自动屏蔽',
                            urls: []
                        })
                    } else if (data.state === '2') {
                        this.setData({
                            contentText: '该内容已被发布者删除',
                            urls: []
                        })
                    } else if (data.state === '3') {
                        this.setData({
                            contentText: '应相关方面要求，该内容已被删除',
                            urls: []
                        })
                    }
                    this.setData({
                        skeletonShow: false
                    })
                } else {
                    throw new Error('请求超时')
                }
            } catch(e) {
                console.log(e.message);
            }
        },
        likeClick: async function () {
            try {
                this.likeReverse()
                await Login();
                let res = await postData('/likeToContent/', {
                    contentId: this.properties.number,
                })
                // console.log(res.data)
                if (res.statusCode === 201) {
                    bus.emit('SynLikeEvent', this.properties.number)
                } else {
                    throw new Error('操作失败')
                }
            } catch (e) {
                console.log(e)
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
                    bus.emit('SynFavEvent', this.properties.number)
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
        writeComment: function () {
            bus.emit('writeCommentShow', -1, 1, -1, '发条友善的评论')
        }
    }
})
