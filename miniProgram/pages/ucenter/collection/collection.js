// pages/ucenter/collection/collection.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()
Page({
  data: {
    navItem: ['简历', '职位'],
    showItem: '0',
    page: '1',
    lists: [],
    reach: true,
    type: '0'
  },

  onLoad: function (options) {
    
  },

  onReady: function () {
    
  },

  onShow: function () {
    this.setData({
      page: '1',
      lists: [],
      reach: true,
    });
    this.userCollect()
  },

  navToggle: function (e) {
    this.setData({
      showItem: e.target.dataset.id,
      page: '1',
      lists: [],
      reach: true,
    });
    this.userCollect()
  },

  //收藏列表
  userCollect: function () {
    var that = this
    var page = that.data.page
    let data = {
      type: that.data.showItem,
      page: page
    }
    let reach = that.data.reach
    if (reach) {
      util.request(api.UserCollect, data).then(function (res) {
        if (res.code == 200) {
          var list = that.data.lists
          for (var i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i])
          }
          that.setData({
            lists: list,
          })
          console.log(that.data.lists)
          if (res.data.current_page < res.data.last_page) {
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
    var showItem = this.data.showItem
    if (showItem == '1') {
      var posts_id = e.currentTarget.dataset.posts_id
      var title = e.currentTarget.dataset.title
      wx.navigateTo({
        url: '/pages/position_details/position_details?posts_id=' + posts_id + '&title=' + title,
      })
    } else {
      var resume_id = e.currentTarget.dataset.resume_id
      var title = e.currentTarget.dataset.title
      wx.navigateTo({
        url: '/pages/resume_details/resume_details?resume_id=' + resume_id + '&title=' + title,
      })
    }
  },

  collection: function () {
    wx.switchTab({
      url: '../../college/college',
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

  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})