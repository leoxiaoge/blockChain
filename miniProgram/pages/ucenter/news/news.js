// pages/ucenter/news/news.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const app = getApp()
Page({
  data: {
    delBtnWidth: 140,
  },

  onLoad: function(options) {

  },

  onReady: function() {

  },

  onShow: function() {
    this.userMessage()
    this.initEleWidth();
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  
  touchM: function (e) {
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {
        txtStyle = "left:0px";
      } else if (disX > 0) {
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      this.setData({
        list: list
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      this.setData({
        list: list
      });
    }
  },

  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
    }
  },

  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  delItem: function (e) {
    var that = this
    var index = e.target.dataset.index;
    var list = this.data.list;
    list.splice(index, 1);
    this.setData({
      list: list
    });
    var id = e.target.dataset.id
    let data = {
      id: id
    }
    util.request(api.UserMessageDelete,data,'POST').then(function (res) {
      if (res.code == 200) {
        util.showToast(res.msg);
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  userMessage: function () {
    var that = this
    util.request(api.UserMessage).then(function (res) {
      if (res.code == 200) {
        let list = res.data.message
        that.setData({
          list: list
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  resumeApply: function (e) {
    console.log(e.currentTarget.dataset.id)
    var that = this
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    var send_time = e.currentTarget.dataset.send_time
    var content = e.currentTarget.dataset.content
    wx.showModal({
      title: '我的消息',
      content: name + '-' + send_time + content,
      cancelText: '不同意',
      confirmText: '同意',
      confirmColor: '#2BBCD9',
      success(res) {
        if (res.confirm) {
          let data = {
            id: id,
            type: 1
          }
          util.request(api.UserResumeApply, data, 'POST').then(function (res) {
            if (res.code == 200) {
              util.showToast(res.msg);
            } else {
              util.showErrorToast(res.msg);
            }
          });
        } else if (res.cancel) {
          let data = {
            id: id,
            type: 2
          }
          util.request(api.UserResumeApply, data, 'POST').then(function (res) {
            if (res.code == 200) {
              util.showToast(res.msg);
            } else {
              util.showErrorToast(res.msg);
            }
          });
        }
      }
    })
  },

  showModal: function (e) {
    var that = this
    var name = e.currentTarget.dataset.name
    var send_time = e.currentTarget.dataset.send_time
    var content = e.currentTarget.dataset.content
    util.showModal(name + '-' + send_time + content);
  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.userMessage();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})