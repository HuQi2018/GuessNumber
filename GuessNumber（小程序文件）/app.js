//app.js

App({
  onLaunch: function () {
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userData: null,
    session_key: "",
    openid: "",
    x: null,//最小值
    y: null,//最大值
    n: null,//个数
    r: null,//是否不重复
    type: null,//等级
    times: null,//第几次猜想
    timesArr: [],//存储数组
    num: null,//存储产生的随机数组
    interval: "",//存储计时器
    time: null,//存储秒数
    timeData: "",
    begTime: "",
    tempArr: [],
    rebegin: 0,
  }
})