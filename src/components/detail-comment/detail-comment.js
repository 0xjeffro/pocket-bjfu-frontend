const { Login, getData, postData } = require("../../utils/util");
import bus from 'iny-bus'
// components/detail-comment/detail-comment.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        number: Number,
        nickname: String,
        time: String,
        state: String,
        deep: Number,
        reply: Number,
        commentText: String,
        contentId: Number,
        isLike: Boolean,
        isAuthor: Boolean,
        nLike: Number,
        action: String,
        actionTo: String,
        comments: Object,
    },
    observers: {
        'isAuthor': function(isAuthor) {
            if (isAuthor) {
                this.setData({
                    authorTag: ' 楼主'
                })
            } else {
                this.setData({
                    authorTag: ''
                })
            }
        },
        'isLike': function(isLike) {
            this.setData({
                isLike_d: isLike,
                likeIcon: isLike ? 'good-job' : 'good-job-o',
                likeColor: isLike ? this.data._likeColor : this.data._dislikeColor
            })
        },
        'nLike': function(nLike) {
            this.setData({
                nLike_d: Math.max(nLike, 0),
            })
        },
        'comments': function (comments) {
            if (comments.length > 3) {
                this.setData({
                    moreInfo: '共' + comments.length + '条回复'
                })
            }
            comments = comments.slice(0, 3)
            for (let i of comments) {
                if (i.commentText.length > 50) {
                    i.commentText = i.commentText.slice(0,50)
                    i.commentText += '...'
                }
                if (i.isAuthor) {
                    i.authorTag = '【楼主】'
                } else {
                    i.authorTag = ''
                }
            }
            this.setData({
                comments_d: comments
            })
        } 
    },

    /**
     * 组件的初始数据
     */
    data: {
        authorTag: '',
        comments_d: [],
        moreInfo: '',

        //点赞相关
        likeIcon: 'good-job-o',
        isLike_d: false,
        nLike_d: 0,
        _likeColor: 'pink',
        _dislikeColor: '#c0c4d0',
        likeColor: '#c0c4d0',
        animationType: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        writeComment: function () {
            // 写一级评论的评论
            wx.getSetting({
                withSubscriptions: true,
                success: (res) => {
                    console.log("SUCCESS", res)
                    if (res.subscriptionsSetting.itemSettings === undefined) {
                    } else {
                        wx.requestSubscribeMessage({
                            tmplIds: ['mcVxahzO9c1kmGRGIPNqcpl-ktqYudlqWmh55osOMxs'],
                            complete (res) {
                              console.log("HACK SUCCESS")
                            }
                        })
                    }
                }
            })
            bus.emit('writeCommentShow', this.properties.number, 2, this.properties.number, '回复 @' + this.properties.nickname + ':')
        },
        toCommentDetail: function (event) {
            wx.getSetting({
                withSubscriptions: true,
                success: (res) => {
                    console.log("SUCCESS", res)
                    if (res.subscriptionsSetting.itemSettings === undefined) {
                    } else {
                        wx.requestSubscribeMessage({
                            tmplIds: ['mcVxahzO9c1kmGRGIPNqcpl-ktqYudlqWmh55osOMxs'],
                            complete (res) {
                              console.log("HACK SUCCESS")
                            }
                        })
                    }
                }
            })
            // 进入评论详情页面

            //向detail页面汇报页面跳转事件
            wx.navigateTo({
              url: '/pages/commentDetail/commentDetail?' + 'commentId=' + this.properties.number + '&contentId=' + this.properties.contentId
            })
        },
        likeClick: async function () {
            try {
                this.likeReverse()
                await Login();
                let res = await postData('/likeToComment/', {
                    commentId: this.properties.number,
                })
                // console.log(res.data)
                if (res.statusCode === 201) {
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
        likeReverse: function () {
            // 这个函数实现点赞状态的反转操作
            if (this.data.isLike_d) {
                this.setData({
                    nLike_d: Math.max(this.data.nLike_d - 1, 0),
                    likeColor: this.data._dislikeColor,
                    likeIcon: 'good-job-o',
                    isLike_d: false,
                    animationType: ''
                })
            } else {
                this.setData({
                    nLike_d: this.data.nLike_d + 1,
                    likeColor: this.data._likeColor,
                    likeIcon: 'good-job',
                    isLike_d: true,
                    animationType: 'animated bounceIn'
                })
                wx.vibrateShort()
            }
        },
        copyCommentText: function (event) {
            wx.setClipboardData({
                data: event.currentTarget.dataset.text,
                success (res) {
                    wx.vibrateShort({
                    success: (res) => {},
                    })
                }
           })
        }
    }
})
