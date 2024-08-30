//app.js
import 'umtrack-wx';

App({
  onLaunch: function () {
    wx.onUserCaptureScreen(async function (res) {
      var pages = getCurrentPages();    //获取加载的页面
      var currentPage = pages[pages.length - 1];  //获取当前页面的对象
      var url = currentPage.route;  //当前页面url
      var options = currentPage.options;
      let options_text = JSON.stringify(options)
      const { Login, postData } = require("/utils/util");
      await Login();
      let r = await postData('/captureScreen/', {
            pageUrl: url,
            options: options_text
      })
    })
  },
  globalData: {
    userInfo: null,
    API: 'http://xi3wvs.natappfree.cc',
    tAPI: 'https://pocket-bfu-api.bfuer.com',
    AdminUsers: ['oJipO5OC8Mc9uNn1eVALGPhY1604', 'oJipO5LbLf5gb2cowl7fkmhMq-c0'],
  },
  umengConfig: {
    appKey: '605da4cc6ee47d382b98221d', //由友盟分配的APP_KEY
    // 使用Openid进行统计，此项为false时将使用友盟+uuid进行用户统计。
    // 使用Openid来统计微信小程序的用户，会使统计的指标更为准确，对系统准确性要求高的应用推荐使用Openid。
    useOpenid: true,
    enableVerify: false,
    // 使用openid进行统计时，是否授权友盟自动获取Openid，
    // 如若需要，请到友盟后台"设置管理-应用信息"(https://mp.umeng.com/setting/appset)中设置appId及secret
    autoGetOpenid: true,
    debug: false, //是否打开调试模式
    uploadUserInfo: false // 自动上传用户信息，设为false取消上传，默认为false
  }
})