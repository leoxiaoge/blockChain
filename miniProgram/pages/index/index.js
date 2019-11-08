const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const app = getApp()
Page({
  data: {
    swiperCurrent: 0,
    indicatorDots: true,
    circular: true,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },

  onLoad: function(options) {
    var that = this;
    if (options.first_puser_id) {
      var first_puser_id = options.first_puser_id
      wx.setStorageSync('first_puser_id', first_puser_id);
    }
    if (wx.getStorageSync('first_puser_id')) {
      var scene = wx.getStorageSync('first_puser_id');
      wx.setStorageSync('first_puser_id', scene);
    }
    if (decodeURIComponent(options.scene)){
      var scene = decodeURIComponent(options.scene);
      wx.setStorageSync('first_puser_id', scene);
    }
    console.log('分销数据', options, decodeURIComponent(options.scene))
    console.log(decodeURIComponent(options.scene))
    if (!wx.getStorageSync('access_token') && !wx.getStorageSync('userInfo')) {
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }
    wx.showLoading({
      title: '加载中...',
    });
  },

  onReady: function () {
    
  },
  
  onShow: function () {
    this.getIndexData()
  },

  getIndexData: function() {
    let that = this;
    util.request(api.IndexHome).then(function(res) {
      if (res.code == 200) {
        that.setData({
          banner: res.data.banner,
          category: res.data.category,
          courses: res.data.courses,
          user_type: res.data.user_type
        })
        that.login()
      } else {
        util.showErrorToast(res.msg);
      }
      wx.hideLoading();
    });
  },

  login: function () {
    var that = this
    if (that.data.user_type == 2 && wx.getStorageSync('userInfo') && wx.getStorageSync('access_token')) {
      let userInfo = wx.getStorageSync('userInfo')
      user.loginByWeixin(userInfo).then(res => {
        app.globalData.hasLogin = true;
        that.getIndexData()
      }).catch((err) => {
        console.log(err)
        app.globalData.hasLogin = false;
        util.showErrorToast(err.msg);
      });
    }
  },

  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  swiperTap: function(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '/pages/details/details?id=' + url,
    })
  },

  channel: function(e) {
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    let icon = e.currentTarget.dataset.icon
    wx.navigateTo({
      url: '/pages/courseslist/courseslist?id=' + id + "&title=" + title + "&icon=" + icon,
    })
  },

  content: function(e) {
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/details/details?id=' + id + "&title=" + title,
    })
  },

  signUp: function(e) {
    let courses_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/application/application?courses_id=' + courses_id,
    })
  },

  onReachBottom: function() {
    
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.getIndexData();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onLogin: function () {
    wx.navigateTo({
      url: "/pages/login/login"
    });
  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  },
})