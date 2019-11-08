// pages/ucenter/distribution_data/distribution_data.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItem: ['一级粉丝', '二级粉丝'],
    showItem: '1',

    data: [{
      avatar: '/images/avatar.png',
      name: '这是粉丝昵称'
    },
    {
      avatar: '/images/avatar.png',
      name: '这是粉丝昵称'
    }, {
      avatar: '/images/avatar.png',
      name: '这是粉丝昵称'
    }
    ]
  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  onShow: function () {
    this.myTeam()
  },

  navToggle: function (e) {
    this.setData({
      showItem: e.target.dataset.id + 1,
    });
    this.myTeam()
  },

  myTeam: function () {
    var that = this
    let data = {
      level: that.data.showItem
    }
    util.request(api.UserMyTeam, data).then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        that.setData({
          data: res.data
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.myTeam();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})