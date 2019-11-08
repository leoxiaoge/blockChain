// pages/release/release.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');
var time = require('../../utils/time.js');
const app = getApp();
Page({
  data: {

  },

  onLoad: function(options) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let newdata = time.formatTime(timestamp, 'Y-M-D h:m')
    this.setData({
      newdata: newdata
    })
  },

  onReady: function() {
    
  },

  onShow: function() {
    this.userEvents()
  },

  userEvents: function () {
    var that = this
    wx.showLoading({
      title: '加载活动中...',
    });
    util.request(api.EventsUserEvents).then(function (res) {
      wx.hideLoading();
      if (res.code == 200) {
        that.setData({
          events: res.data.events,
          none: true
        })
      } else {
        util.showModal(res.msg);
      }
    });
  },

  eventsDelete: function (e) {
    var that = this
    let event_id = e.currentTarget.dataset.id
    let data = {
      event_id: event_id
    }
    util.request(api.EventsDelete, data, 'POST').then(function (res) {
      if (res.code == 200) {
        util.showToast(res.msg);
        that.userEvents()
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  communityDetails: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../community_details/community_details?id=' + id + '&title=' + title,
    })
  },

  release: function () {
    wx.navigateTo({
      url: '../release_describe/release_describe',
    })
  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.userEvents();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})