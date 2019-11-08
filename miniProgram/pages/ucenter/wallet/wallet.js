// pages/ucenter/wallet/wallet.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const app = getApp()
Page({
  data: {
    
  },

  onLoad: function(options) {

  },

  onReady: function() {

  },

  onShow: function() {
    this.userUserInfo()
    this.accountList()
  },

  userUserInfo: function () {
    var that = this
    util.request(api.UserUserInfo).then(function (res) {
      if (res.code == 200) {
        that.setData({
          user: res.data.user_info
        })
      } else {
        util.showNoneToast(res.msg);
      }
    })
  },

  accountList: function () {
    var that = this
    util.request(api.AccountList).then(function (res) {
      if (res.code == 200) {
        that.setData({
          list: res.data
        })
      } else {
        util.showNoneToast(res.msg);
      }
    })
  },

  apply: function () {
    wx.navigateTo({
      url: '/pages/ucenter/apply/apply',
    })
  },

  bring: function () {
    wx.navigateTo({
      url: '/pages/ucenter/bring/bring',
    })
  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.accountList();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function() {

  },
  
  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})