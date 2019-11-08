// pages/initiator/initiator.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
var time = require('../../utils/time.js');
const app = getApp()
Page({
  data: {
    navItem: ['活动', '课程'],
    showItem: 1
  },

  onLoad: function(options) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let newdata = time.formatTime(timestamp, 'Y-M-D h:m')
    this.setData({
      newdata: newdata
    })
    this.setData({
      user_id: options.user_id,
      admin_id: options.admin_id
    })
    this.getInitiatorData()
  },

  getInitiatorData: function () {
    let that = this;
    let data = {
      user_id: that.data.user_id,
      admin_id: that.data.admin_id
    }
    util.request(api.EventsSponsor, data).then(function (res) {
      if (res.code == 200) {
        that.setData({
          courses: res.data.courses,
          events: res.data.events,
          user_type: res.data.user_type,
          head_pic: res.data.head_pic
        })
      } else {
        util.showErrorToast(res.msg);
      }
      wx.hideLoading();
    });
  },

  onReady: function() {

  },

  onShow: function() {

  },

  navToggle: function(e) {
    var that = this;
    that.setData({
      showItem: e.target.dataset.id + 1,
    });
  },

  communityDetails: function (e) {
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../community_details/community_details?id=' + id + '&title=' + title,
    })
  },

  content: function (e) {
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/details/details?id=' + id + "&title=" + title,
    })
  },

  signUp: function (e) {
    let courses_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/application/application?courses_id=' + courses_id,
    })
  },

  onLogin: function () {
    wx.navigateTo({
      url: "/pages/auth/login/login"
    });
  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.getInitiatorData();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})