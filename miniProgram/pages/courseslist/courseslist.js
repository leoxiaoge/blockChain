const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const app = getApp()
Page({
  data: {
    page: 1,
    lists: [],
    reach: true
  },

  onLoad: function (options) {
    let title = options.title
    wx.setNavigationBarTitle({
      title: title,
    })
    let category_id = options.id
    this.setData({
      category_id: category_id,
      title: title,
      icon: options.icon
    })
    wx.showLoading({
      title: '加载中...',
    });
    this.CoursesLists()
  },

  CoursesLists: function () {
    var that = this
    var category_id = this.data.category_id
    var page = that.data.page
    var data = {
      category_id: category_id,
      page: page
    }
    let reach = that.data.reach
    if (reach){
      util.request(api.CoursesLists, data).then(function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          let list = that.data.lists
          for (let i = 0; i < res.data.lists.data.length; i++) {
            list.push(res.data.lists.data[i])
          }
          that.setData({
            lists: list,
            user_type: res.data.user_type,
            none: true
          })
          if (res.data.lists.current_page < res.data.lists.last_page) {
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

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.CoursesLists();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
    this.CoursesLists()
  },

  onLogin: function () {
    wx.navigateTo({
      url: "/pages/login/login"
    });
  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})