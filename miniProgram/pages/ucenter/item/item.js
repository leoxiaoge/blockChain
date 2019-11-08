var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({
  data: {
    selected: -1,
    pageSzie:8,
    pageNum:0,
    withdrawList:[],
    pageCount:0
  },
  onShow: function(){
    util.checkoutBindJoin();
    this.getList();
  },
  selected: function (e) {
    let id = e.target.dataset.id
    this.setData({
      selected : id,
      pageNum:0,
      withdrawList:[]
    })
    this.getList()
  },
  a: function () {
    wx.navigateTo({
      url: '/pages/order1/order1',
    })
  },
  onPullDownRefresh: function () {
    
  },

  onReachBottom: function () {
    let pageCount = this.data.pageCount
    let pageNum = this.data.pageNum + 1
    if (pageNum <= pageCount){
      this.setData({
        pageNum: pageNum
      })
      this.getList();
    }else{
      wx.showToast({
        title: "数据已加载完",
        icon: 'none',
        duration: 2000
      })
    }
    
  },

  getList:function(){
    let than = this
    util.request(api.UserWithdrawList, { status: this.data.selected, pageSzie: this.data.pageSzie, pageNum: this.data.pageNum}).then(function(res){
      than.setData({
        withdrawList: than.data.withdrawList.concat(res.data.list),
        pageCount: res.data.pagecount
      });
    })
  }

})