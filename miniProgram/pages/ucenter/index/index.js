var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();

Page({
  data: {
    vip: '/images/VIP.png',
    userInfo: {
      nickName: '点击登录',
      avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    showDialog: false,
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {
    var that = this
    //关于我们，手机号
    util.request(api.About, )
      .then(function (res) {
        console.log(res)
        that.setData({
          tel: res.data.tel,
          serviceTime: res.data.serviceTime
        })
      });
  },
  onShow: function() {
    var that = this
    //获取用户的登录信息
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
      });
    }
    if (wx.getStorageSync('userInfo')){
      util.request(api.Remind,)
        .then(function (res) {
          console.log(res.data)
          that.setData({
            remind: res.data,
          })
        });
      //获取用户信息， isShopauth商家认证审核中
      util.request(api.Myinfo, )
        .then(function (res) {
          that.setData({
            isShopauth: res.data.userinfo.isShopauth,
            authinfo: res.data.userinfo
          })
        });  
       
    }
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },
  /*点击变色*/
  click: function (e) {
    var id = e.currentTarget.dataset.id
    var that = this
    that.setData({
      id: id
    })
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      value: 'show'
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var that = this
    that.setData({
      value: e.detail.value
    })
    console.log(this.data.value)
  },
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  freeBack: function () {
    var that = this
    if (this.data.value == 'show') {
      wx.showModal({
        title: '提示',
        content: '你没有选择任何内容',
      })
    }
    that.setData({
      showDialog: !this.data.showDialog
    })
  },
  freetoBack: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '你没有选择任何内容',
    })
    that.setData({
      showDialog: !this.data.showDialog,
      value: 'show',
      checked: false,
    })
  },
  goLogin() {
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goOrder(e) {
    var that = this
    var showType = e.currentTarget.dataset.showtype;
    var status = e.currentTarget.dataset.status;
    if (app.globalData.hasLogin) {
      var data = {
        status: status
      }
      util.request(api.Update, data)
        .then(function (res) {
          console.log(res.data)
          that.setData({
            remind: res.data,
          })
        });
      wx.navigateTo({
        url: "/pages/ucenter/order/order?showType="+showType
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goCoupon() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/coupon/coupon"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };

  },
  authentication () {
    if (app.globalData.hasLogin) {
      let isShopauth = this.data.isShopauth
      wx.navigateTo({
        url: "/pages/ucenter/authentication/authentication?isShopauth=" + isShopauth
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goCollect() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/collect/collect"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goFootprint() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/footprint/footprint"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goAddress() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/address/address"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  aboutUs: function() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },
  calling: function () {
    var that = this
    let tel = that.data.tel
    wx.makePhoneCall({
      phoneNumber: tel,
      success: function () {

      },
      fail: function () {

      }
    })
  },
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  }
})