// pages/ucenter/ucenter.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const app = getApp();
Page({
  data: {
    ucenter: [{
      id: '0',
      name: '我的学籍卡',
      url: '../ucenter/card/card'
    }, {
      id: '1',
      name: '我的课程',
      url: '../ucenter/curriculum/curriculum'
    }, {
      id: '2',
      name: '我的消息',
      url: '../ucenter/news/news'
    }, {
      id: '3',
      name: '我的收藏',
      url: '../ucenter/collection/collection'
    }, {
      id: '4',
      name: '我的简历',
      url: '../ucenter/resume/resume'
    }, {
      id: '5',
      name: '我的招聘',
      url: '../ucenter/recruit/recruit'
    }, {
      id: '6',
      name: '我的活动',
      url: '../ucenter/activity/activity'
    }, {
      id: '7',
      name: '分销中心',
      url: '../ucenter/distribution/distribution'
    }, {
      id: '8',
      name: '我的钱包',
      url: '../ucenter/wallet/wallet'
    }]
  },

  onLoad: function(options) {
    
  },

  onReady: function() {

  },

  onShow: function() {
    let mobile = wx.getStorageSync('mobile')
    this.setData({
      mobile: mobile
    })
  },

  ucenter: function(e) {
    let url = e.currentTarget.dataset.url
    util.navigate(url);
  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})