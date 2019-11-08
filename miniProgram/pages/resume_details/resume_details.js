// pages/resume_details/resume_details.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const content = require('../position_content/position_content.js');
var WxParse = require('../../lib/wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
    
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      resume_id: options.resume_id
    })
    wx.showLoading({
      title: '加载中...',
    });
  },

  onReady: function () {

  },

  onShow: function () {
    this.postsList()
  },

  postsList: function () {
    var that = this
    let data = {
      resume_id: that.data.resume_id
    }
    util.request(api.ResumeDetail, data).then(function (res) {
      wx.hideLoading();
      if (res.code == 200) {
        if (res.data.status == 1){
          res.data.resume.user.real_name = res.data.resume.user.real_name.substr(0, 1) + "**"
          res.data.resume.user.mobile = res.data.resume.user.mobile.substr(0, 3) + "*******"
          var reg = /(.{2}).+(.{2}@.+)/g;
          res.data.resume.user.email = res.data.resume.user.email.replace(reg, "$1****$2")
        }  
        that.setData({
          resume: res.data.resume,
          apply_status: res.data.apply_status,
          collect_status: res.data.collect_status,
          recommend: res.data.recommend
        })
        console.log(res.data.resume)
        WxParse.wxParse('resume_description', 'html', res.data.resume.resume_description, that);
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  company: function (e) {
    let title = e.currentTarget.dataset.title
    let company_id = e.currentTarget.dataset.company_id
    wx.navigateTo({
      url: '/pages/company/company?company_id=' + company_id + '&title=' + title,
    })
  },

  collegeDetails: function (e) {
    let resume_id = e.currentTarget.dataset.resume_id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/resume_details/resume_details?resume_id=' + resume_id + '&title=' + title,
    })
  },

  resumeApply: function () {
    var that = this
    let data = {
      resume_id: that.data.resume_id
    }
    util.request(api.ResumeApply, data, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.code == 200) {
        util.showToast(res.msg);
        that.postsList()
      } else {
        util.showNoneToast(res.msg);
      }
    });
  },

  // 简历收藏/取消收藏
  collect: function (e) {
    var that = this
    let data = {
      resume_id: that.data.resume_id
    }
    util.request(api.ResumeCollect, data, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.code == 200) {
        util.showToast(res.msg);
        let data = {
          resume_id: that.data.resume_id
        }
        that.postsList()
      } else {
        util.showErrorToast(res.msg);
      }
    });
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
    wx.showNavigationBarLoading()
    this.postsList();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})