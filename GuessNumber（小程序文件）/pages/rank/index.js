Page({

  /**
   * 页面的初始数据
   */
  data: {

    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    delBtnWidth: 180,
    // 数据
    list: [[], [], []],
    myList: [[], [], []],
    openid: wx.getStorageSync('openid'),
    p: 0
  },
  switchNav: function(e) {
    var page = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      page.setData({
        currentTab: e.target.dataset.current
      });
    }
    this.getrank(page);
  },
  onSlideChange: function(e) {
    var page = this;
    if (this.data.currentTab == e.detail.current) {
      return false;
    } else {
      page.setData({
        currentTab: e.detail.current
      });
    }
    this.getrank(page,0);
  },
  getrank(that, p){
    wx.request({
      url: '/xiaochengxu.php',
      method: 'POST',
      data: {
        type: that.data.currentTab,
        openid: wx.getStorageSync('openid'),
        page: p
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "JSESSION=" + wx.getStorageSync('session_key')
      },
      success: function (res) {
        // console.log(that.data.currentTab)
        // console.log("排行榜", res.data);
        // console.log("排行榜", res.data.data);
        // console.log("排行榜", res.data.myData);
        if (res.data.data != null) {
          // var tempList = that.data.list[res.data.type]
          
          var li = "list[" + res.data.type + "]"
          var myList = "myList[" + res.data.type + "]"
          that.setData({
            // [li]: tempList.concat(res.data.data),
            [li]: res.data.data,
            [myList]: res.data.myData,
            openid: wx.getStorageSync('openid'),
          })
          // console.log(that.data.list[res.data.type])
        } else {
          if(res.data.status==0){
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
        if(that.p!=0){
          // 隐藏加载框
          wx.hideLoading();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log("排行榜", options.id);

    var that = this;
    this.getrank(that,0);

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
    // var that = this;
    // // 查看是否授权
    // wx.getSetting({
    //   success: function(res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.switchTab({
    //         url: '/pages/index/index',
    //       })
    //     }
    //   }
    // })
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
    // var that = this;
    // // 显示加载图标
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
    // // 页数+1
    // that.p = that.p + 1;
    // that.getrank(that, that.p);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})