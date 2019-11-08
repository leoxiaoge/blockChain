// pages/company/company.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var WxParse = require('../../lib/wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
    navItem: ['公司信息', '在招职位'],
    showItem: '1'
  },

  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      company_id: options.company_id
    })
    this.companyDetail()
  },

  onReady: function () {

  },

  onShow: function () {

  },

  companyDetail: function () {
    var that = this
    wx.showLoading({
      title: '加载中...',
    });
    let data = {
      company_id: that.data.company_id
    }
    util.request(api.CompanyDetail, data).then(function (res) {
      wx.hideLoading();
      if (res.code == 200) {
        console.log(res.data.company)
        that.setData({
          company: res.data.company
        })
        WxParse.wxParse('companyDetail', 'html', res.data.company.company_description, that);
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  navToggle: function (e) {
    this.setData({
      showItem: e.target.dataset.id + 1,
    });
  },

  collegeDetails: function (e) {
    var posts_id = e.currentTarget.dataset.posts_id
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/position_details/position_details?posts_id=' + posts_id + '&title=' + title,
    })
  },

  previewImage: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
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