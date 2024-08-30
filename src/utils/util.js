var base64 = require('base64-utf8');
const app = getApp()


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function Login() {
  const getToken = new Promise((resolve, reject) => {
    let JWT = wx.getStorageSync('JWT');
    if (JWT) { // 如果本地存在JWT
      // 将jwt的payload解码
      let payload = JWT.split('.')[1]
      let payload_str = base64.decode(payload)
      let payload_json = JSON.parse(payload_str)
      let openid = payload_json.username
      let user_id = payload_json.user_id
      let exp = payload_json.exp
      let timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      if (exp - timestamp > 120) { // 如果有效期大于120秒
        resolve('')
        return
      }
    }
    // 如果本地不存在JWT或者 有效期不足60秒 执行登录逻辑：
    wx.login({
      success(res) {
        // console.log(app.globalData.API + '/wxLogin/')
        let code = res.code
        console.log(code)
        wx.request({
          url: app.globalData.API + '/wxLogin/',
          method: 'POST',
          data: {
            code: code
          },
          success: function (res) {
            wx.setStorageSync('JWT', res.data.JWT)
            resolve('')
          },
          fail: function (res){
            console.log(res)
          }
        })
      }
    })
    
  })
  return getToken
}

function getOpenId() {
  let JWT = wx.getStorageSync('JWT');
  if (JWT) { // 如果本地存在JWT
    // 将jwt的payload解码
    let payload = JWT.split('.')[1]
    let payload_str = base64.decode(payload)
    let payload_json = JSON.parse(payload_str)
    let openid = payload_json.username
    return openid
  } else {
    return undefined
  }
}

function getData(path, param) {
  return new Promise ( (resolve, reject) => {
    let url = ''
    if (path[0] === '/') {
      url = app.globalData.API + path
    } else {
      url = path
    }
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'JWT' + ' ' + wx.getStorageSync('JWT')
      },
      data: param,
      success (res) {
        // console.log(res)
        resolve(res)
      },
      fail (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

function postData(path, param) {
  return new Promise ( (resolve, reject) => {
    let url = ''
    if (path[0] === '/') {
      url = app.globalData.API + path
    } else {
      url = path
    }
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'JWT' + ' ' + wx.getStorageSync('JWT')
      },
      data: param,
      success (res) {
        // console.log(res)
        resolve(res)
      },
      fail (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

function putData(path, param) {
  return new Promise ( (resolve, reject) => {
    let url = ''
    if (path[0] === '/') {
      url = app.globalData.API + path
    } else {
      url = path
    }
    wx.request({
      url: url,
      method: 'PUT',
      header: {
        'content-type': 'application/json',
        'Authorization': 'JWT' + ' ' + wx.getStorageSync('JWT')
      },
      data: param,
      success (res) {
        resolve(res)
      },
      fail (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  Login: Login,
  getData: getData,
  postData: postData,
  putData: putData,
  getOpenId: getOpenId
}
