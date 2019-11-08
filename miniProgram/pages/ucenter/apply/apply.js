const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const app = getApp()
Page({
  data: {
    selected: true,
    selected1: false,
    remind:{},
    withdraw:{
      amount:0,
      withdraw_type:0,
      open_bank_card:'',
      open_bank_name:'',
      bank_account:''
    }
  },

  onShow: function () {
    this.userUserInfo()
  },

  userUserInfo: function () {
    var that = this
    util.request(api.UserUserInfo).then(function (res) {
      if (res.code == 200) {
        that.setData({
          user: res.data.user_info
        })
      } else {
        util.showNoneToast(res.msg);
      }
    })
  },
  selected: function (e) {
    let withdraw = this.data.withdraw
    withdraw.withdraw_type = 0
    this.setData({
      selected1: false,
      selected:true,
      withdraw: withdraw
    })
  },

  selected1: function (e) {
    let withdraw = this.data.withdraw
    withdraw.withdraw_type = 1
    this.setData({
      selected: false,
      selected1: true,
      withdraw: withdraw
    })
  },

  withdraw:function(){
    let than = this
    util.request(api.UserWithdraw, than.data.withdraw,'POST').then(function(res){
      if(res.code == 200) {
        util.showNoneToast(res.msg);
        setTimeout(function() {
          wx.navigateBack({

          })
        },2000)
      } else{
        util.showNoneToast(res.msg);
      }
    })
  },

  amount:function(e){
    let withdraw = this.data.withdraw
    withdraw.amount = e.detail.value
    this.setData({
      withdraw: withdraw
    })
  },

  open_bank_name: function(e){
    let withdraw = this.data.withdraw
    withdraw.open_bank_name = e.detail.value
    this.setData({
      withdraw: withdraw
    })
  },

  open_bank_card: function (e) {
    let withdraw = this.data.withdraw
    withdraw.open_bank_card = e.detail.value
    this.setData({
      withdraw: withdraw
    })
  },

  bank_account: function (e) {
    let withdraw = this.data.withdraw
    withdraw.bank_account = e.detail.value
    this.setData({
      withdraw: withdraw
    })
  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})