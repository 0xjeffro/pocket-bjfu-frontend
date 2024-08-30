// pages/index/detail/detail.js
import bus from 'iny-bus'
const { Login, getData, postData } = require("../../../utils/util");
const {commentReshape} = require("../../../utils/commentReshape")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
       
        // 控制评论弹出框
        writeCommentShow: false,
        commentText: '',
        placeholder: '发个友善的评论',
        deep1Id: -1, // 回复所属一级评论的id
        reply: -1,
        deep: 1,

        nComment: '-',
        deep1: [],
        noAskTipShow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu({
            success: (res) => {},
        })
        this.setData({
            id: options.id
        })
        this.loadComment()
        bus.on('writeCommentShow', (reply, deep, deep1Id, placeholder) => {
            this.setData({
                reply: reply,
                deep: deep,
                deep1Id: deep1Id,
                placeholder: placeholder,
                writeCommentShow: true
            })
        })


    },
    loadComment: async function () {
        try {
            await Login();
            let res = await getData('/comment/', {
                contentId: this.data.id
            })
            if (res.statusCode === 200) {
                let nComment = res.data.length
                this.setData({
                    nComment: nComment
                })
                let deep1 = commentReshape(res.data)
                let ad_deep1 = this.insertAD(deep1)
                this.setData({
                    deep1: ad_deep1,
                })
                wx.uma.trackEvent('view_content', {'contentId': this.data.id, 'nComment': this.data.nComment})
            } else {
                throw new Error('网络错误')
            }
        } catch (e) {
            console.log(e.message)
        }
    },
    insertAD: function (deep1) {
        let ad_deep1 = []
        let ad_start_pos = Math.floor(Math.random()*(2)+0);
        let cycle = 9
        for (let i = 0; i< deep1.length; i++)
        {
            ad_deep1.push(deep1[i])
            if (i % cycle === ad_start_pos) {
                ad_deep1.push({
                    'is_ad': true,
                    'id': -i
                })
            }
        }
        return ad_deep1
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    writeComment: function (event) {
        // 对当前主题进行评论
        bus.emit('writeCommentShow', -1, 1, -1, '发条友善的评论')
    },
    onClose() {
        this.setData({  writeCommentShow: false });
        console.log('onclose')
    },
    sendComment: async function () {
        let commentText = this.data.commentText
        let contentId = this.data.id // detail页面的id就是contentId
        let commentId = this.data.deep1Id
        let deep = this.data.deep
        let reply = this.data.reply
        if(commentText.trim()===''){
            wx.lin.showToast({
                title: '请输入内容',
            })
            return
        }
        try {
            wx.lin.showToast({
                title: '发送中...',
                icon: 'loading',
                duration: 10000000,
                mask: true
            })
            await Login();
            let res = await postData('/comment/', {
                commentText: commentText,
                commentId: commentId,
                contentId: contentId,
                deep: deep,
                reply: reply
            })
            if (res.statusCode === 201) {
                wx.lin.showToast({
                    title: '发送成功',
                    icon: 'success',
                    duration: 1000,
                })
                this.setData({
                    writeCommentShow: false,
                    commentText: ''
                })
                wx.getSetting({
                    withSubscriptions: true,
                    success: (res) => {
                        console.log("SUCCESS", res.subscriptionsSetting.itemSettings)
                        if (res.subscriptionsSetting.itemSettings === undefined) {
                          this.setData({
                              noAskTipShow: true
                          })
                        }
                    }
                })
                wx.requestSubscribeMessage({
                    tmplIds: ['mcVxahzO9c1kmGRGIPNqcpl-ktqYudlqWmh55osOMxs'],
                    complete: (res) => {
                        this.setData({
                            noAskTipShow: false
                        })
                    }
                })
                wx.uma.trackEvent('post_comment', {'contentId': contentId, 'deep': deep})
                this.loadComment()
            } else {
                throw new Error('网络错误')
            }
        } catch (e) {
            wx.lin.showToast({
                title: e.message,
            })
        }

    },
    nextOne: function () {
        wx.vibrateShort()
        if (this.data.id.toString() === '1') {
            wx.lin.showToast({
                title: '最后一条啦',
            })
        } else {
            this.setData({
                id: this.data.id - 1,
                nComment: '-',
                deep1: []
            })
            this.loadComment()
        }
    }
})