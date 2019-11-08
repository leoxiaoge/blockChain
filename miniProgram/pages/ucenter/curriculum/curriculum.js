// pages/ucenter/curriculum/curriculum.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItem: ['学习中课程', '已完成课程'],
    showItem: '1'
  },

  onLoad: function (options) {
    this.userCourses()
  },

  onReady: function () {

  },

  onShow: function () {

  },

  navToggle: function (e) {
    this.setData({
      showItem: e.target.dataset.id + 1,
    });
  },

  userCourses: function () {
    var that = this
    util.request(api.UserCourses).then(function (res) {
      if (res.code == 200) {
        let yes = res.data.yes
        let no = res.data.no
        console.log(yes)
        that.setData({
          yes: yes,
          no: no
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  content: function (e) {
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    let classes_id = e.currentTarget.dataset.classes_id
    wx.navigateTo({
      url: '/pages/details/details?id=' + id + "&title=" + title + "&classes_id=" + classes_id,
    })
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})