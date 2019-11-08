// pages/position_details/position_details.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const content = require('../position_content/position_content.js');
var WxParse = require('../../lib/wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
    
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      posts_id: options.posts_id
    })
    wx.showLoading({
      title: '加载中...',
    });
  },

  onReady: function() {

  },

  onShow: function() {
    this.postsList()
  },

  postsList: function() {
    var that = this
    let data = {
      posts_id: that.data.posts_id
    }
    util.request(api.PostsDetail, data).then(function(res) {
      wx.hideLoading();
      if (res.code == 200) {
        that.setData({
          posts: res.data.posts,
          recommend: res.data.recommend,
          is_collect: res.data.is_collect
        })
        console.log(res.data.posts)
        WxParse.wxParse('postsDetail', 'html', res.data.posts.posts_description, that);
        WxParse.wxParse('postsTeamDetail', 'html', res.data.posts.team_description, that);
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  company: function(e) {
    let title = e.currentTarget.dataset.title
    let company_id = e.currentTarget.dataset.company_id
    wx.navigateTo({
      url: '/pages/company/company?company_id=' + company_id + '&title=' + title,
    })
  },

  collegeDetails: function (e) {
    let posts_id = e.currentTarget.dataset.posts_id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/position_details/position_details?posts_id=' + posts_id + '&title=' + title,
    })
  },

  // 职位收藏/取消收藏
  collect: function (e) {
    var that = this
    let data = {
      posts_id: that.data.posts_id
    }
    util.request(api.PostsCollect, data, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.code == 200) {
        util.showToast(res.msg);
        let data = {
          posts_id: that.data.posts_id
        }
        util.request(api.PostsDetail, data).then(function (res) {
          if (res.code == 200) {
            that.setData({
              posts: res.data.posts,
              recommend: res.data.recommend,
              is_collect: res.data.is_collect
            })
          } else {
            util.showErrorToast(res.msg);
          }
        });
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  postsSend: function () {
    var that = this
    let data = {
      posts_id: that.data.posts_id
    }
    util.request(api.PostsSend, data, 'POST').then(function (res) {
      if (res.code == 200) {
        util.showToast(res.msg);
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.postsList();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})