// pages/index/write/write.js
const qiniuUploader = require("../../../utils/qiniuUploader");
const { Login, getData, postData } = require("../../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileList: [],
        contentText: '',
        noAskTipShow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu({
            success: (res) => {},
        })
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
    afterRead(event) {
        let files = event.detail.file // 获取到传来的文件列表
        // 给文件列表中的每一个文件对象初始化 status='uploading'、message='上传中'、imageUrl=null
        for (let file of files) {
            file.status = 'uploading'
            file.message='上传中...'
            file.imageUrl=null
        }
        // 把文件列表中的文件塞进fileList进行显示
        let file_lis = this.data.fileList
        for (let file of files) {
            file_lis.push(file)
            this.upLoadImg(file.url) // 开始上传图片
        }
        console.log(file_lis)
        this.setData({
            fileList: file_lis
        })
    },
    send: async function () {
        let contentText = this.data.contentText
        let contentImg = ''
        let file_lis = this.data.fileList
        for(let f of file_lis) {
            if (f.imageUrl) {
                contentImg += f.imageUrl.toString()
                contentImg += '|'
            }
        }
        console.log(contentImg)
        if(contentText.trim()===''){
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
            let res = await postData('/content/', {
                contentText: contentText,
                contentImg: contentImg
            })
            console.log(res.statusCode)
            if (res.statusCode === 201) {
                wx.lin.showToast({
                    title: '发送成功',
                    icon: 'success',
                    duration: 1500,
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
                let that = this
                wx.requestSubscribeMessage({
                  tmplIds: ['mcVxahzO9c1kmGRGIPNqcpl-ktqYudlqWmh55osOMxs'],
                  complete (res) {
                    wx.navigateBack({
                        delta: 1,
                        success: (res) => {
                          wx.startPullDownRefresh({
                            success: (res) => {},
                          })
                        }
                    })
                    
                    that.setData({
                        noAskTipShow: false
                    })
                  }
                })
                wx.uma.trackEvent('post_content')
            } else {
                throw new Error('网络错误')
            }
        } catch (e) {
            wx.lin.showToast({
                title: e.message,
            })
        }
    },
    upLoadImg: async function (url) {
         console.log('url', url)
        // 接收一个参数url,是文件的本地临时路径
        try {
            // 将url作为filename获取uploadToken
            let data = await this.getUploadToken(url)
            let uploadToken = data.uploadToken
            let key = data.key
            if (uploadToken) {
                this.initQiNiu(uploadToken)
                qiniuUploader.upload(url, (res) => {
                    // 上传完成
                    let lis_buf = this.data.fileList
                    for (let f of lis_buf) {
                        if (f.url === url) {
                            f.message = ''
                            f.status = 'done'
                            f.imageUrl=res.fileURL
                            break
                        }
                    }
                    this.setData({
                        fileList: lis_buf
                    })
                    // console.log(res.data)
                    console.log('file url is: ' + res.fileURL);
                }, (error) => {
                    // 上传失败
                    throw new Error(JSON.stringify(error))
                    }, {
                        key: key
                    }, (progress) => {
                        let lis_buf = this.data.fileList
                        for (let f of lis_buf) {
                            if (f.url === url) {
                                f.message = progress.progress + '%'
                                break
                            }
                        }
                        this.setData({
                            fileList: lis_buf
                        })
                        // console.log('上传进度', progress.progress);
                    }
                )
            } else {
                throw new Error('uploadToken获取失败')
            }
        } catch (e) {
            console.log('err', e)
            let lis_buf = this.data.fileList
            for (let f of lis_buf) {
                if (f.url === url) {
                    f.message = '上传失败'
                    f.status = 'failed'
                    break
                }
            }
            this.setData({
                fileList: lis_buf
            })
        }
    },
    delete(event) {
        const { index, name } = event.detail;
        const fileList = this.data[`fileList${name}`];
        fileList.splice(index, 1);
        this.setData({ [`fileList${name}`]: fileList });
    },
    getUploadToken: async function (url) {
        try {
            let filename = url.toString()
            filename = filename.substring(filename.length-10, filename.length)
            console.log('filename', filename)
            await Login();
            let res = await getData('/uploadToken/', {
                filename: filename
            })
            console.log('uploadToken', res.data.uploadToken)
            if (res.statusCode === 200) {
                return res.data
            } else {
                return null
            }
        } catch {
            return null
        }
    },
    initQiNiu: function (uploadToken) {
        var options = {
            // bucket所在区域，这里是华北区。ECN, SCN, NCN, NA, ASG，分别对应七牛云的：华东，华南，华北，北美，新加坡 5 个区域
            region: 'SCN',
    
            // 由其他程序生成七牛云uptoken，然后直接写入uptoken
            uptoken: uploadToken,
            // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "0MLvWPnyy..."}
            
            // bucket 外链域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 fileURL 字段。否则需要自己拼接
            domain: 'https://pocket-bfu-img.bfuer.com',
            // qiniuShouldUseQiniuFileName 如果是 true，则文件的 key 由 qiniu 服务器分配（全局去重）。如果是 false，则文件的 key 使用微信自动生成的 filename。出于初代sdk用户升级后兼容问题的考虑，默认是 false。
            // 微信自动生成的 filename较长，导致fileURL较长。推荐使用{qiniuShouldUseQiniuFileName: true} + "通过fileURL下载文件时，自定义下载名" 的组合方式。
            // 自定义上传key 需要两个条件：1. 此处shouldUseQiniuFileName值为false。 2. 通过修改qiniuUploader.upload方法传入的options参数，可以进行自定义key。（请不要直接在sdk中修改options参数，修改方法请见demo的index.js）
            // 通过fileURL下载文件时，自定义下载名，请参考：七牛云“对象存储 > 产品手册 > 下载资源 > 下载设置 > 自定义资源下载名”（https://developer.qiniu.com/kodo/manual/1659/download-setting）。本sdk在README.md的"常见问题"板块中，有"通过fileURL下载文件时，自定义下载名"使用样例。
            shouldUseQiniuFileName: true
        };
        // 将七牛云相关配置初始化进本sdk
        qiniuUploader.init(options);
    }
})