//index.js
//获取应用实例
const app = getApp()

function generateNumber(x = 1, y = 10, n = 4, r = 1) { //匿名函数，产生1-10不重复的n个随机数，r=1为检测重复
  app.globalData.times = 0
  app.globalData.num = Array(n);
  for (var i = 0; i < n; i++) {
    var data = "";
    do {
      data = Math.floor(Math.random() * (y - x + 1) + x);
      // console.log(data)
    } while (app.globalData.num.indexOf(data) > -1 && r == 1); //检测是否重复
    app.globalData.num[i] = data;
  }
  app.globalData.begTime = Date.parse(new Date());
  // app.globalData.interval = setInterval(showTime, 1000);
  // console.log(app.globalData.num)
  return app.globalData.num;
}

Page({
  data: {
    motto: '开始',
    array: ['初级', '中级', '高级'], //, '自定义'
    numArray: [
      [1, 6, 4, 1],
      [1, 8, 5, 1],
      [0, 9, 6, 1]
    ],
    index: 0,
    userInfo: {},
    hasUserInfo: false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
  },
  login: function(){
    this.setData({
      isHide: true
    })
  },
  cancelLogin: function () {
    this.setData({
      isHide: false
    })
  },
  //事件处理函数
  bindViewTap: function(e) {
    var that = this
    var x = this.data.numArray[this.data.index][0]
    var y = this.data.numArray[this.data.index][1]
    var n = this.data.numArray[this.data.index][2]
    var r = this.data.numArray[this.data.index][3]
    app.globalData.x = x
    app.globalData.y = y
    app.globalData.n = n
    app.globalData.r = r
    if ((y - x) < n && r == 1) {
      alert("请注意最大最小值取值及个数！");
      return;
    }
    if (app.globalData.times) {
      wx.showModal({
        title: '提示',
        content: "是否重新开始！",
        showCancel: true,
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击确定');
            app.globalData.times = 0
            clearInterval(app.globalData.interval)
            app.globalData.interval = ""
            app.globalData.begTime = ""
            app.globalData.timeData = ""
            app.globalData.rebegin = 1
            app.globalData.timesArr = []
            app.globalData.type = that.data.index
            app.globalData.num = generateNumber(x, y, n, r)
            wx.switchTab({
              url: '/pages/content/index',
            })
          }
        }
      })
    } else {
      app.globalData.type = that.data.index
      app.globalData.num = generateNumber(x, y, n, r)
      wx.switchTab({
        url: '/pages/content/index',
      })
    }

  },
  bindPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    // if (e.detail.value==3){
    //   //自定义
    // }
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function(e) {
    // console.log(wx.getStorageSync('session_key'))
    // console.log(wx.getStorageSync('openid'))
    // console.log(wx.getStorageSync('userData'))
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (wx.getStorageSync('openid') == '') {
      var that = this
      wx.getUserInfo({
        success: res => {
          res.detail = res
          that.bindGetUserInfo(res);
        }
      })
    }
    // var that = this;
    // // 查看是否授权
    // wx.getSetting({
    //   success: function(res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.switchTab({
    //         url: '/pages/index/index',
    //       })
    //       // 还未授权，显示授权按钮
    //       that.setData({
    //         isHide: true
    //       });
    //     } else {
    //       // 已授权，隐藏授权按钮，显示正文
    //       that.setData({
    //         isHide: false
    //       });
    //     }
    //   }
    // })
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  //授权登陆按钮
  bindGetUserInfo: function(e) {
    var that = this;
    // console.log(e)
    if (e.detail.userInfo) {
      //用户授权登陆，并跳转首页
      // that.getOpenid()
      wx.login({
        success: function(res) {
          // 请求自己后台获取用户openid
          wx.request({
            url: '/login.php',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              encryptedData: e.detail.encryptedData,
              signature: e.detail.signature,
              rawData: e.detail.rawData,
              iv: e.detail.iv,
              code: res.code
            },
            success: function(res_user) {
              // console.log(res_user.data)
              if (res_user.data.status == 0) {
                var data = res_user.data.msg　　　　 //json转对象
                //授权成功返回的数据，根据自己需求操作
                console.log(data)

                //授权成功后，隐藏授权按钮，显示正文
                that.setData({
                  userInfo: e.detail.userInfo,
                  hasUserInfo: true,
                  isHide: false
                });
                //存储登录信息
                // var logs = wx.getStorageSync('logs') || []//获取缓存
                wx.setStorageSync('session_key', res_user.data.session_key)
                wx.setStorageSync('openid', res_user.data.openid)
                wx.setStorageSync('userData', res_user.data.userData)
                app.globalData.session_key = res_user.data.session_key
                app.globalData.openid = res_user.data.openid
                app.globalData.userData = res_user.data.userData
                if (wx.getStorageSync('key') == '') {
                  wx.setStorage({
                    key: 'key',
                    data: e.detail.userInfo,
                  });
                };
                if (!e.encryptedData){
                  wx.showToast({
                    title: '授权成功！',
                    icon: 'success',
                    duration: 3000
                  })
                }
              }
            },
            fail: function() {
              that.showModal('获取授权信息失败')
            }
          })
        }
      })
    } else {
      //用户按了拒绝授权按钮，提示引导授权
      that.showModal('请授权后使用小程序')
    }
  },

  //未授权弹窗
  showModal: function(e) {
    wx.showModal({
      title: '提示',
      content: e,
      showCancel: false,
      confirmText: '返回授权',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击了“返回授权”')
        }
      }
    })
  },
})