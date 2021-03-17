const app = getApp()
var util = require('../../utils/util.js');
//将秒数转换为时分秒格式
function formatSeconds(value) {

  var theTime = parseInt(value); // 秒
  var middle = 0; // 分
  var hour = 0; // 小时

  if (theTime > 60) {
    middle = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (middle > 60) {
      hour = parseInt(middle / 60);
      middle = parseInt(middle % 60);
    }
  }
  var result = "" + parseInt(theTime) + "秒";
  if (middle > 0) {
    result = "" + parseInt(middle) + "分" + result;
  }
  if (hour > 0) {
    result = "" + parseInt(hour) + "小时" + result;
  }
  return result;
}

function compare(x, y) {
  var set1 = 0; //包含
  var set2 = 0; //包含且位置相同
  for (var i = 0; i < x.length; i++) {
    if (x.indexOf(parseInt(y[i])) > -1) {
      set1++;
      if (x[i] == parseInt(y[i])) {
        set2++;
      }
    }
  }
  if (set2 == x.length) {
    return "恭喜你全对了！"
  } else {
    return "猜中：" + set1 + "\xa0\xa0\xa0\xa0\xa0" + "同时位置准确：" + set2
  }
}

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

  /**
   * 页面的初始数据
   */
  data: {
    timeData: app.globalData.timeData,
    begTime: app.globalData.begTime,
    num: app.globalData.num,
    tipArr: [],

    inputLenth: app.globalData.n,
    times: 1,
    timesArr: [],
    dev: '',
    scanValue: '',
    inputWidth: '90rpx',
    inputHeight: '90rpx'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  reBegin: function() {
    var x = app.globalData.x
    var y = app.globalData.y
    var n = app.globalData.n
    var r = app.globalData.r
    app.globalData.num = generateNumber(x, y, n, r)
    app.globalData.times = 0
    clearInterval(app.globalData.interval)
    // app.globalData.rebegin = 1
    app.globalData.interval = ""
    app.globalData.begTime = ""
    app.globalData.timeData = ""
    app.globalData.timesArr = []
    
    this.setData({
      timeData: "",
      begTime: "",
      num: app.globalData.num,
      timesArr: [],
      tipArr: [],
    })
    this.onShow();
    // wx.switchTab({
    //   url: '/pages/content/index',
    // })
  },
  // generate: function (x = 1, y = 10, n = 4, r = 1) {
  //   if ((y - x) < n && r == 1) {
  //     alert("请注意最大最小值取值及个数！");
  //     return;
  //   }
  //   app.globalData.num = generateNumber(1, 10, 4, 1)
  //   // console.log(app.globalData.num[1])
  //   this.setData({
  //     num: app.globalData.num
  //   })

  // },
  setupPasswordComplete(event) {
    this.setData({
      'dev': event.detail
    })
    // console.log(this.data.dev)
    // console.log(app.globalData.tempArr)
    var temptext = compare(app.globalData.num, app.globalData.tempArr);
    if (temptext == "恭喜你全对了！") {
      
      wx.request({
        url: '/xiaochengxu_insert.php',
        method: 'POST',
        data: {
          id: wx.getStorageSync('openid'),
          type: app.globalData.type,
          header: wx.getStorageSync('userData').avatarUrl,
          name: wx.getStorageSync('userData').nickName,
          time: app.globalData.time,
          timeData: app.globalData.timeData,
          date: util.formatTime(new Date()),
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": "JSESSION=" + wx.getStorageSync('session_key')
        },
        success: function (res) {
          // console.log(that.data.currentTab)
          // console.log("排行榜", res.data);
          if (res.data.status == 0) {
            // console.log("排行榜", res.data.status);
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // console.log('用户点击确定');
                }
              }
            })
          }
        }
      })

      wx.showToast({
        title: '恭喜你全对了！用时：' + app.globalData.timeData,
        icon: 'success',
        duration: 3000
      })

      clearInterval(app.globalData.interval)
      app.globalData.interval = ""

    } else {

      app.globalData.times = 1
      var temp = app.globalData.timesArr;
      temp.push(temp.length);
      // temp.pop(temp.length);
      app.globalData.timesArr = temp;
      this.setData({
        timesArr: app.globalData.timesArr,
      })
    }
    var tipTemp = this.data.tipArr;
    tipTemp.push(temptext);
    // temp.pop(temp.length);
    this.setData({
      tipArr: tipTemp,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    if (app.globalData.num == null) {
      wx.showToast({
        title: '请先生成随机数！',
        icon: 'loading',
        duration: 2000
      }) //icon：loading
      function jump() {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      setTimeout(jump, 1000);
    } else {
      // console.log("随机数已生成！")
      if (app.globalData.times == 0) {
        // console.log("初次加载！")
        if (app.globalData.rebegin == 1){
          this.setData({
            timeData: "",
            begTime: "",
            num: app.globalData.num,
            timesArr: [],
            tipArr: [],
          })
          app.globalData.rebegin = 0
        }
        var that = this
        // console.log(Date.parse(new Date()));
        app.globalData.begTime = Date.parse(new Date())

        app.globalData.interval = setInterval(showTime, 1000)

        function showTime() {
          // console.log(app.globalData.begTime);
          app.globalData.time = (Date.parse(new Date()) - app.globalData.begTime) / 1000
          app.globalData.timeData = formatSeconds(app.globalData.time);
          // console.log(app.globalData.timeData);
          // timeData = app.globalData.timeData

          that.setData({
            timeData: app.globalData.timeData,
          })
        }

        app.globalData.times = 1
        var temp = app.globalData.timesArr;
        temp.push(temp.length);
        // temp.pop(temp.length);
        app.globalData.timesArr = temp;
        this.onLoad();
        this.setData({
          x: app.globalData.x,
          y: app.globalData.y,
          inputLenth: app.globalData.n,
          times: app.globalData.times,
          timesArr: [0],
          tipArr: []
        })
        that.passwordBox = that.selectComponent('#passwordBox') // 获取密码框组件，用来操作组件内部的方法
      }
    }

    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})