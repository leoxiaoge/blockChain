var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var time = require("../../../utils/time.js");
var timer = require('../../../utils/wxTimer.js');
Page({
  data: {
    orderList: [],
    showType: 0,
    setInter: '',
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if (options.showType) {
      that.setData({
        showType: parseInt(options.showType)
      });
    }
    //获取当前时间戳
    var timestamp = Date.parse(new Date());
    that.setData({
      timestamp: timestamp
    })
    this.getOrderList();
  },
  onShow: function() {
    
  },

  getOrderList() {
    var that = this;
    var timestamp = that.data.timestamp
    util.request(api.OrderList, {
      showType: that.data.showType
    }).then(function(res) {
      if (res.errno === 0) {
        //处理时间戳
        let datas = res.data.data
        that.setData({
          orderList: res.data.data,
          dataSourcesArray: res.data.data,
          datas: res.data.data
        });
        for (let i = 0; i < datas.length; i++) {
          datas[i]["endTime"] = datas[i]["addTime"] + 30 * 60 * 1000
          datas[i]["intervalTime"] = (datas[i]["endTime"] - that.data.timestamp) / 1000
          datas[i]["intervalTimes"] = (datas[i]["endTime"] - that.data.timestamp) / 1000
          datas[i]["intervalTime"] = that.data.time
          datas[i]["intervalTime"] = datas[i]["intervalTimes"] / 60
          datas[i]["mTime"] = Math.floor(datas[i]["intervalTimes"] / 60) % 60; //分
          datas[i]["sTime"] = datas[i]["intervalTimes"] % 60 //秒
          if (datas[i]["intervalTime"] > 0) {
            datas[i]["Time"] = datas[i]["mTime"] + ":" + datas[i]["sTime"] //30:00判断是否超过30分钟
          } else {
            datas[i]["Time"] = "00" + ":" + "00"
          }
          that.setData({
            datas: datas
          })
        }
        for (let i = 0; i < datas.length; i++) {
          datas[i]["endTime"] = datas[i]["addTime"] + 30 * 60 * 1000
          datas[i]["intervalTime"] = (datas[i]["endTime"] - that.data.timestamp) / 1000
          datas[i]["intervalTimes"] = (datas[i]["endTime"] - that.data.timestamp) / 1000
          var interval = setInterval(function() {
            datas[i]["intervalTimes"]--;
            that.setData({
              time: datas[i]["intervalTimes"] + '秒'
            })
            datas[i]["intervalTime"] = that.data.time
            datas[i]["intervalTime"] = datas[i]["intervalTimes"] / 60
            datas[i]["mTime"] = Math.floor(datas[i]["intervalTimes"] / 60) % 60; //分
            datas[i]["sTime"] = datas[i]["intervalTimes"] % 60 //秒
            if (datas[i]["intervalTime"] > 0) {
              datas[i]["Time"] = datas[i]["mTime"] + ":" + datas[i]["sTime"] //30:00判断是否超过30分钟
            } else {
              clearInterval(interval);
              datas[i]["Time"] = "00" + ":" + "00"
            }
            that.setData({
              datas: datas
            })
          }, 1000)
        }
      }
    });
  },

  // “去付款”按钮点击效果
  payOrder: function(e) {
    let that = this;
    let orderId = e.currentTarget.dataset.id;
    util.request(api.OrderPrepay, {
      orderId: orderId
    }, 'POST').then(function(res) {
      if (res.errno === 0) {
        const payParam = res.data;
        console.log("支付过程开始");
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.packageValue,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function(res) {
            console.log("支付过程成功");
            util.redirect('/pages/ucenter/order/order');
          },
          'fail': function(res) {
            console.log("支付过程失败");
            util.showErrorToast('支付失败');
          },
          'complete': function(res) {
            console.log("支付过程结束")
          }
        });
      }
    });
  },
  switchTab: function(event) {
    let showType = event.currentTarget.dataset.index;
    this.setData({
      showType: showType
    });
    this.getOrderList();
  },
  //取消订单
  cancelOrder: function(e) {
    let that = this;
    let orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      confirmColor: '#1ca6f8',
      success: function(res) {
        if (res.confirm) {
          util.request(api.OrderCancel, {
            orderId: orderId
          }, 'POST').then(function(res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '取消订单成功'
              });
              that.getOrderList();
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getOrderList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})