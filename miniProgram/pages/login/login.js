// pages/login/login.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
var app = getApp();
Page({
  data: {
    angle: 0,
    userInfo: {
      avatarUrl: 'https://admin.lyzxy.com.cn/images/logoicon.png'
    }
  },
  onLoad: function (options) {
    console.log(options.scene)
  },

  onReady() {
    wx.onAccelerometerChange((res) => {
      let angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (this.data.angle !== angle) {
        this.setData({
          angle: angle
        });
      }
    });
  },

  onShow: function () {
    
  },

  onGotUserInfo: function (e) {
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      util.showErrorToast('请允许授权!');
      return;
    } else{
      wx.reLaunch({
        url: '/pages/index/index',
      });
    }
    wx.setStorageSync('userInfo', e.detail.userInfo);
    user.checkLogin().catch(() => {
      user.loginByWeixin(e.detail.userInfo).then(res => {
        app.globalData.hasLogin = true;
      }).catch((err) => {
        console.log(err)
        app.globalData.hasLogin = false;
        util.showErrorToast(err.msg);
      });
    });
  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})