// pages/payment/payment.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');
const app = getApp();
Page({
  data: {

  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      order_id: options.order_id,
      courses_id: options.courses_id
    })
    this.detail()
  },

  onReady: function () {

  },

  onShow: function () {

  },
  detail: function () {
    let that = this
    wx.showLoading({
      title: '加载详情中...',
    });
    let courses_id = that.data.courses_id
    let data = {
      courses_id: courses_id
    }
    util.request(api.CoursesDetail, data).then(function (res) {
      wx.hideLoading();
      if (res.code == 200) {
        that.setData({
          courses: res.data.courses
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  addFast: function () {
    var that = this
    let data = {
      order_id: that.data.order_id
    }
    util.request(api.CoursesPay, data, 'POST').then(function (res) {
      if (res.code == 200) {
        const payParam = res.data;
        console.log("支付过程开始", payParam)
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            util.showToast("支付过程成功");
            wx.navigateBack({
              
            })
          },
          'fail': function (res) {
            util.showErrorToast("支付过程失败");
          }
        });
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

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})