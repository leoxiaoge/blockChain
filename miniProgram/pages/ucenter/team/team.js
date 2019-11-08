// pages/ucenter/team/team.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItem: ['一级粉丝', '二级粉丝'],
    showItem: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.myTeam();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})