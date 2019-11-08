var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    status: '0'
  },
  onLoad: function (options) {

  },
  onReady: function () {
    
  },
  switchTab: function (e) {
    console.log(e.currentTarget.dataset.index)
    let status = e.currentTarget.dataset.index
    this.setData({
      status: status
    })
    this.onShow()
  },
  onShow: function () {
    var that = this
    var data = {
      status: that.data.status
    }
    util.request(api.Mylist, data)
      .then(function (res) {
        console.log(res.data)
        that.setData({
          conpon: res.data,
        })
      });
  },
  go: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../category/category?id=' + id,
    })
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})