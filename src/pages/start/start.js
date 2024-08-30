const { Login, getData, postData } = require("../../utils/util");
import { Interpreter } from "eval5"
const app = getApp()
// pages/start/start.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        logo: '../../static/img/logo1.jpg',
        identity: '本科生',
        identityIndex: 0, // 当前选择的身份的下标
        identityList: [
          '本科生', '研究生',  
        ], //  '21级新绿'
        identityPickerShow: false, // 是否显示身份选择器
        canUse: true, // 当前身份是否可以登录
        buttonText: '验证登录',
        studentNumber: '',
        password: '',

        // 新绿入口字段
        studentName: '',
        ksh: '',
        sfzh: '',
        validateCodeForm: '', // 表单中的验证码
        validateCodeMock: null, // Mock验证码
        validateCodes: [
            {
                "base64": "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",
                "text": "e9bn"
            },
            {
                "base64": "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",
                "text": "p8qu"
            }
        ]
    },
    login: async function () {
        if (this.data.identityIndex === 0) {

            // 验证学号密码的合法性
            if (this.data.studentNumber.length !== 9 || this.data.password.length < 6) {
                wx.vibrateShort() // 震动反馈
                wx.lin.showMessage({
                    type:'error',
                    icon: 'xxxxx',
                    content:'学号或密码不正确',
                    duration: 1500
                })
                return
            }
            // 判断验证码合法性
            if (this.data.validateCodeForm.toLowerCase() !== this.data.validateCodeMock.text) {
                console.log(this.data.validateCodeForm.toLowerCase(), this.data.validateCodeMock.text)
                wx.vibrateShort() // 震动反馈
                wx.lin.showMessage({
                    type:'error',
                    icon: 'xxxxx',
                    content:'验证码错误',
                    duration: 1500
                })
                this.randomValidateCode()
                return
            }
            this.setData({
                canUse: false
            })
            try {
                // if (this.data.studentNumber[0] === '2' && this.data.studentNumber[1] === '1') {
                //     wx.vibrateShort() // 震动反馈
                //     wx.lin.showMessage({
                //         type:'warning',
                //         icon: 'xxxxx',
                //         content:'21级暂未开通教务验证，请走新绿验证通道',
                //         duration: 1500
                //     })
                //     this.randomValidateCode()
                //     this.setData({
                //         canUse: true
                //     })
                //     return
                // }
                wx.lin.showMessage({
                    type:'warning',
                    icon: 'xxxxx',
                    content:'验证中...',
                    duration: 10000
                })
                await Login();
                let res = await postData('/jwLogin/', {
                    xh: this.data.studentNumber,
                    pwd: this.data.password
                })
                this.setData({
                    canUse: true
                })
                if (res.statusCode === 200) {
                    let data = res.data
                    console.log('data', data)
                    if (data.success === 0) {
                        wx.setStorageSync('xh', data.xh)
                        console.log('data.xh', data.xh)
                        wx.setStorageSync('pwd', data.pwd)
                        wx.setStorageSync('verifyType', data.verifyType)
                        wx.vibrateShort() // 震动反馈
                        wx.lin.showMessage({
                            type:'success',
                            icon: 'xxxxx',
                            content:'登录成功',
                            duration: 1500
                        })
                        setTimeout(()=>{
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        }, 800)
                    } else if (data.success === 1) {
                        wx.vibrateShort() // 震动反馈
                        wx.lin.showMessage({
                            type:'error',
                            icon: 'xxxxx',
                            content:'学号或密码错误',
                            duration: 1500
                        })
                        this.randomValidateCode()
                    } else {
                        wx.vibrateShort() // 震动反馈
                        wx.lin.showMessage({
                            icon: 'xxxxx',
                            content:'系统繁忙',
                            duration: 1500
                        })
                        this.randomValidateCode()
                    }
                } else {
                    wx.vibrateShort() // 震动反馈
                        wx.lin.showMessage({
                            icon: 'xxxxx',
                            content:'网络繁忙, 请重试',
                            duration: 1500
                    })
                }
            } catch {
                this.setData({
                    canUse: true
                })
                wx.lin.showMessage({
                    icon: 'xxxxx',
                    content:'网络状况不佳',
                    duration: 1500
                })
                this.randomValidateCode()
            }
        }
        else if (this.data.identityIndex === 2) {  // 研究生入口
            if (this.data.studentName.length <= 1) {  // 判断姓名合法性
                wx.vibrateShort() // 震动反馈
                wx.lin.showMessage({
                    type:'error',
                    icon: 'xxxxx',
                    content:'请输入姓名',
                    duration: 1500
                })
                return
            }
            
            // 判断验证码合法性
            if (this.data.validateCodeForm.toLowerCase() !== this.data.validateCodeMock.text) {
                console.log(this.data.validateCodeForm.toLowerCase(), this.data.validateCodeMock.text)
                wx.vibrateShort() // 震动反馈
                wx.lin.showMessage({
                    type:'error',
                    icon: 'xxxxx',
                    content:'验证码错误',
                    duration: 1500
                })
                this.randomValidateCode()
                return
            }
            this.setData({
                canUse: false
            })
            try {
                wx.lin.showMessage({
                    type:'warning',
                    icon: 'xxxxx',
                    content:'验证中...',
                    duration: 10000
                })
                await Login();
                let res = await postData('/zsbLogin/', {
                    studentName: this.data.studentName,
                    ksh: this.data.ksh,
                    sfzh: this.data.sfzh
                })
                this.setData({
                    canUse: true
                })
                if (res.statusCode === 200) {
                    let data = res.data
                    console.log('data', data)
                    if (data.success === 0) {
                        wx.setStorageSync('verifyType', data.verifyType)
                        wx.vibrateShort() // 震动反馈
                        wx.lin.showMessage({
                            type:'success',
                            icon: 'xxxxx',
                            content:'登录成功',
                            duration: 1500
                        })
                        setTimeout(()=>{
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        }, 800)
                    } else if (data.success === 1) {
                        wx.vibrateShort() // 震动反馈
                        wx.lin.showMessage({
                            icon: 'xxxxx',
                            content:'暂未查到录取信息，请耐心等待',
                            duration: 1500
                        })
                    } else {
                        wx.vibrateShort() // 震动反馈
                        wx.lin.showMessage({
                            icon: 'xxxxx',
                            content:'网络繁忙，请稍后再试',
                            duration: 1500
                        })
                    }
                } else {
                    wx.vibrateShort() // 震动反馈
                        wx.lin.showMessage({
                            icon: 'xxxxx',
                            content:'网络繁忙, 请重试',
                            duration: 1500
                    })
                }
            } catch {
                this.setData({
                    canUse: true
                })
                wx.lin.showMessage({
                    icon: 'xxxxx',
                    content:'网络状况不佳',
                    duration: 1500
                })
            }
        }
        
        
        
    },
    showidentityPicker: function () {
        this.setData({
            identityPickerShow: true
        })
    },
    identityPickerOnClose: function () {
        this.setData({
            identityPickerShow: false
        })
    },
    identityPickerOnCancel: function () {
        this.setData({
            identityPickerShow: false
        })
    },
    identityPickerOnConfirm: function (event) {
        const { picker, value, index } = event.detail;
        console.log(event.detail)
        if(index === 0 || index === 2) {
            this.setData({
                canUse: true,
                buttonText: '验证登录',
                identityIndex: index,
                identity: this.data.identityList[index]
            })
        } else if (index === 1) {
            this.setData({
                canUse: false,
                buttonText: '暂不支持',
                identityIndex: index,
                identity: this.data.identityList[index]
            })
        }
        this.setData({
            identityPickerShow: false
        })
    },
    passwordInputFocus: function (event) { // 密码输入框聚焦
        this.setData({
            logo: '../../static/img/logo2.jpg'

        })
    },
    passwordInputBlur: function (event) { // 密码输入框失焦
        this.setData({
            logo: '../../static/img/logo1.jpg'
        })
    },
    getValidateCodes: async function (options) {
        try{
            await Login();
            let res = await getData('/globalVar/validateCodes/', {})
            if (res.statusCode === 200) {
                let str_validate_codes = res.data.value
                let interpreter = new Interpreter(window, {
                    timeout: 1000,
                });
                let validate_codes = interpreter.evaluate(str_validate_codes)
                this.setData({
                    validateCodes: validate_codes
                })
                this.setData({
                    validateCodeMock: this.data.validateCodes[Math.floor(Math.random() * this.data.validateCodes.length)]
                })
            } else {
            }
        } catch {
        }
    },
    randomValidateCode: function(options) {
        this.setData({
            validateCodeMock: this.data.validateCodes[Math.floor(Math.random() * this.data.validateCodes.length)]
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu({
            success: (res) => {},
        })
        wx.hideHomeButton({
          success: (res) => {},
        })
        this.getValidateCodes()
        this.setData({
            validateCodeMock: this.data.validateCodes[Math.floor(Math.random() * this.data.validateCodes.length)]
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

    }
})