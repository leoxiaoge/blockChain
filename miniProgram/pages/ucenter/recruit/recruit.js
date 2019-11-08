// pages/ucenter/recruit/recruit.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()
Page({
  data: {
    page: 1,
    reach: true,
    posts: []
  },

  onLoad: function (options) {
    
  },

  onReady: function () {

  },

  onShow: function () {
    this.userPosts()
  },

  userPosts: function () {
    var that = this
    var page = that.data.page
    let data = {
      page: page
    }
    let reach = that.data.reach
    if (reach) {
      util.request(api.UserPosts, data).then(function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          var post = that.data.posts
          for (var i = 0; i < res.data.posts.data.length; i++) {
            post.push(res.data.posts.data[i])
          }
          that.setData({
            posts: post
          })
          if (res.data.posts.current_page < res.data.posts.last_page) {
            that.setData({
              page: page + 1
            })
          } else {
            that.setData({
              page: page,
              reach: false
            })
          }
        } else {
          util.showErrorToast(res.msg);
        }
      });
    }
  },

  collegeDetails: function (e) {
    var posts_id = e.currentTarget.dataset.posts_id
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/position_details/position_details?posts_id=' + posts_id + '&title=' + title,
    })
  },

  release: function () {
    wx.navigateTo({
      url: '/pages/release_position/release_position',
    })
  },

  resumeDelete: function (e) {
    var that = this
    let posts_id = e.currentTarget.dataset.posts_id
    console.log(e)
    let data = {
      posts_id: posts_id
    }
    util.request(api.UserPostsDelete, data, 'POST').then(function (res) {
      if (res.code == 200) {
        util.showToast(res.msg);
        that.setData({
          page: 1,
          reach: true,
          posts: []
        })
        that.userPosts()
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  releaseEdit: function (e) {
    let posts_id = e.currentTarget.dataset.posts_id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/position_edit/position_edit?posts_id=' + posts_id + '&title=' + title,
    })
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.userPosts();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
    this.userPosts()
  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})