// pages/ucenter/resume/resume.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()
Page({
  data: {
    item:['显示', '部分隐藏', '隐藏']
  },

  onLoad: function (options) {
    
  },

  onReady: function () {

  },

  onShow: function () {
    this.userResume()
  },

  userResume: function () {
    let that = this;
    util.request(api.UserResume).then(function (res) {
      if (res.code == 200) {
        if (res.data.resume.status == 1) {
          res.data.resume.user.real_name = res.data.resume.user.real_name.substr(0, 1) + "**"
          res.data.resume.user.mobile = res.data.resume.user.mobile.substr(0, 3) + "*******"
          var reg = /(.{2}).+(.{2}@.+)/g;
          console.log(res.data.resume.user.email.replace(reg, "$1****$2"));
          res.data.resume.user.email = res.data.resume.user.email.replace(reg, "$1****$2")
        }
        that.setData({
          resume: res.data.resume
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  collegeDetails: function (e) {
    let resume_id = e.currentTarget.dataset.resume_id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/resume_details/resume_details?resume_id=' + resume_id + '&title=' + title,
    })
  },

  releaseEdit: function (e) {
    let resume_id = e.currentTarget.dataset.resume_id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/release_edit/release_edit?resume_id=' + resume_id + '&title=' + title,
    })
  },

  release: function () {
    wx.navigateTo({
      url: '/pages/release_resume/release_resume',
    })
  },
  //简历删除
  resumeDelete: function (e) {
    let that = this;
    let resume_id = e.currentTarget.dataset.resume_id
    let data = {
      resume_id: resume_id
    }
    util.request(api.UserResumeDelete, data, 'POST').then(function (res) {
      if (res.code == 200) {
        util.showToast(res.msg);
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  bindShow: function () {
    this.setData({
      show: !this.data.show
    })
  },

  isShow: function (e) {
    console.log(e)
    let status = e.currentTarget.dataset.status
    let resume_id = e.currentTarget.dataset.resume_id
    this.setData({
      show: !this.data.show,
      status: status,
      resume_id: resume_id
    })
    this.resumeIsShow()
  },

  resumeIsShow: function () {
    let that = this;
    let status = this.data.status
    let resume_id = this.data.resume_id
    let data = {
      status: status,
      resume_id: resume_id
    }
    util.request(api.ResumeIsShow, data, 'POST').then(function (res) {
      if (res.code == 200) {
        util.showToast(res.msg);
        that.userResume()
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
    this.userResume();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})