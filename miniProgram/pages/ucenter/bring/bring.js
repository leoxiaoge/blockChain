// pages/ucenter/bring/bring.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const app = getApp()
Page({
  data: {
    navItem: ['全部', '审核中', '提现成功', '提现失败'],
    showItem: '0',
    none: false,
    status: -1,
    pageSzie: 10,
    pageNum: 0,
    reach: true,
    list: []
  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  onShow: function () {
    this.withdraw()
  },

  navToggle: function (e) {
    let id = e.target.dataset.id
    console.log(id)
    if(id == 0){
      var status = '-1'
    } else if(id == 1) {
      var status = '0'
    } else if (id == 2){
      var status = '4'
    } else if (id == 3){
      var status = '2'
    }
    this.setData({
      showItem: id,
      status: status,
      none: false,
      pageSzie: 20,
      pageNum: 0,
      pagecount: 0,
      reach: true,
      list: []
    });
    this.withdraw()
  },

  withdraw: function () {
    var that = this
    let pagecount = that.data.pagecount
    let list = that.data.list
    var pageNum = that.data.pageNum
    if (pageNum < pagecount) {
      var pageNum = Number(pageNum) + Number(1)
      that.setData({
        pageNum: pageNum
      })
    }
    let data = {
      status: that.data.status,
      pageSzie: that.data.pageSzie,
      pageNum: pageNum
    }
    util.request(api.WithdrawList, data).then(function (res) {
      if (res.code == 200) {
        let lists = that.data.list
        for (let i = 0; i < res.data.list.length; i++){
          lists.push(res.data.list[i])
        } 
        that.setData({
          list: lists,
          pagecount: res.data.pagecount,
          none: true,
          reach: false,
        })
      } else {
        util.showNoneToast(res.msg);
      }
    })
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
    this.withdraw()
  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})