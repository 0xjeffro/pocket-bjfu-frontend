// pages/commentDetail/commentDetail.js
import bus from 'iny-bus'
const { Login, getData, postData } = require("../../utils/util");
const {commentReshape} = require("../../utils/commentReshape")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false, //控制整个页面的显示
        contentId: '',
        commentId: '', //当前一级评论的id
       
        // 控制评论弹出框
        writeCommentShow: false,
        commentText: '',
        placeholder: '发个友善的评论',
        deep1Id: -1, // 回复所属一级评论的id
        reply: -1,
        deep: 1,

        nComment: '-',
        comment: null,
        comments: [],

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
            contentId: options.contentId,
            commentId: options.commentId
        })
        bus.on('writeCommentInCommentDetailShow', (reply, deep, deep1Id, placeholder) => {
            deep1Id = this.data.commentId
            this.setData({
                reply: reply,
                deep: deep,
                deep1Id: deep1Id,
                placeholder: placeholder,
                writeCommentShow: true
            })
        })
        this.loadComment()
    },
    deep1Reshape: function (deep1) {
        for (let i of deep1) {
            console.log(i.id, this.data.commentId)
            if (i.id.toString() === this.data.commentId) {
                
                // 清洗动作，此时传入的comments的action和actionTo字段包含有对当前二级评论的信息
                for (let j of i.comments) {
                    if (j.reply === i.id) {
                        j.action = ''
                        j.actionTo = ''
                    }
                }
                this.setData({
                    comment: i,
                    comments: i.comments
                })
                break;
            }
        }
    },
    loadComment: async function () {
        try {
            await Login();
            let res = await getData('/comment/', {
                contentId: this.data.contentId
            })
            if (res.statusCode === 200) {
                let deep1 = commentReshape(res.data)
                this.setData({
                    show: true
                })
                this.deep1Reshape(deep1)
            } else {
                throw new Error('网络错误')
            }
        } catch (e) {
            console.log(e.message)
        }
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
    sendComment: async function () {
        let commentText = this.data.commentText
        let contentId = this.data.contentId // detail页面的id就是contentId
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
                        console.log("SUCCESS", res)
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
                // console.log(res.data)
            } else {
                throw new Error('网络错误')
            }
        } catch (e) {
            wx.lin.showToast({
                title: e.message,
            })
        }

    }
})