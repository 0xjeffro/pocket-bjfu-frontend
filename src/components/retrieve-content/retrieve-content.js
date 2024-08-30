// components/retrieve-content/retrieve-content.js
const { Login, getData, postData } = require("../../utils/util");
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
        decorationUrl_d: '',
        nLike_d: 0,
        nComment_d: 0,
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
                        contentText: data.contentText,
                        decorationUrl_d: data.decoration_url,
                        nComment_d: Math.max(data.nComment, 0),
                        likeColor: data.isLike ? this.data._likeColor : this.data._dislikeColor
                    })
                    // if (data.state === '0') {
                    //     this.setData({
                    //         contentText: '内容涉嫌违规，不予显示',
                    //         urls: []
                    //     })
                    // }
                    this.setData({
                        skeletonShow: false
                    })
                } else {
                    throw new Error('请求超时')
                }
            } catch(e) {
                console.log(e.message);
                // wx.lin.showToast({
                //     title: '请求超时',
                // })
            }
        },
        likeClick: async function () {
            try {
                this.likeReverse()
                await Login();
                let res = await postData('/likeToContent/', {
                    contentId: this.properties.number
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
        toDetail: function () {
            wx.navigateTo({
              url: '/pages/index/detail/detail?' + 
              'id=' + this.properties.number
            })
        }
    }
})
