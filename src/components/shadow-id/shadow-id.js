// components/shadow-id/shadow-id.js
const base64 = require('base64-utf8')
Component({
    /**
     * 组件的属性列表
     */
    properties: {
    },
    pageLifetimes: {
        show: function() {
          // 页面被展示
          this.getUserId()
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        user_id: 'None'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getUserId: function () {
            let JWT = wx.getStorageSync('JWT');
            if (JWT) { // 如果本地存在JWT
                // 将jwt的payload解码
                let payload = JWT.split('.')[1]
                let payload_str = base64.decode(payload)
                let payload_json = JSON.parse(payload_str)
                let openid = payload_json.username
                let user_id = payload_json.user_id
                let exp = payload_json.exp
                this.setData({
                    user_id: user_id
                })
            }
        }
    }
})
