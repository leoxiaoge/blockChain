// pages/ucenter/activity/activity.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()
Page({
  data: {
    navItem: ['进行中活动', '已结束活动'],
    showItem: 0,
    page: 1,
    reach: true,
    events: []
  },

  onLoad: function (options) {
    
  },
  
  onReady: function () {

  },

  onShow: function () {
    this.setData({
      page: 1,
      reach: true,
      events: []
    });
    this.userEvents()
  },
  
  navToggle: function (e) {
    var that = this;
    that.setData({
      showItem: e.target.dataset.id,
      page: 1,
      reach: true,
      events: []
    });
    that.userEvents()
  },

  userEvents: function () {
    var that = this
    var page = that.data.page
    var data = {
      type: that.data.showItem,
      page: page
    }
    let reach = that.data.reach
    if (reach) {
      util.request(api.UserEvents, data).then(function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          let event = that.data.events
          for (let i = 0; i < res.data.events.data.length; i++) {
            event.push(res.data.events.data[i])
          }
          that.setData({
            events: event
          })
          if (res.data.events.current_page < res.data.events.last_page) {
            that.setData({
              page: page + 1
            })
          } else {
            that.setData({
              page: page,
              reach: false
            })
          }
        } else if (res.code == 20002) {
          util.showErrorToast(res.msg);
          setTimeout(function () {
            wx.navigateBack({})
          }, 1000)
        } else {
          util.showErrorToast(res.msg);
        }
      });
    }
  },

  communityDetails: function (e) {
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../../community_details/community_details?id=' + id + '&title=' + title,
    })
  },

  release: function () {
    wx.navigateTo({
      url: '../../release/release',
    })
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.onShow();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
    this.userEvents()
  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})