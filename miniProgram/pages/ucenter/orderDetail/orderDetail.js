var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var time = require('../../../utils/time.js');
Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    expressInfo: {},
    flag: false,
    handleOption: {},
    Time: ''
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
    var timestamp = Date.parse(new Date());
    this.setData({
      timestamp: timestamp
    })
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getOrderDetail();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  getOrderExpress: function() {
    let that = this;
    util.request(api.ExpressQuery, {
      expCode: that.data.orderInfo.expCode,
      expNo: that.data.orderInfo.expNo
    }, 'POST').then(function(res) {
      console.log(res.data)
      if (res.errno === 0) {
        that.setData({
          expressInfo: res.data
        });

      }
    });
  },
  expandDetail: function() {
    let that = this;
    this.setData({
      flag: !that.data.flag
    })
  },
  getOrderDetail: function() {
    let that = this;
    util.request(api.OrderDetail, {
      orderId: that.data.orderId
    }).then(function(res) {
      if (res.errno === 0) {
        let endTime = res.data.orderInfo.addTime + 30 * 60 * 1000
        let intervalTime = (endTime - that.data.timestamp) / 1000
        let addTime = time.formatTime(res.data.orderInfo.addTime / 1000, 'Y-M-D h:m:s')
        let mTime = Math.floor(intervalTime / 60) % 60; //分
        let sTime = intervalTime % 60
        if (intervalTime > 0) {
          var Time = mTime + ":" + sTime
        } else {
          var Time = "00" + ":" + "00"
        }
        that.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          handleOption: res.data.orderInfo.handleOption,
          addTime: addTime,
          Time: Time,
          intervalTime: intervalTime
        });
        var interval = setInterval(function () {
          intervalTime--;
          let addTime = time.formatTime(res.data.orderInfo.addTime / 1000, 'Y-M-D h:m:s')
          let mTime = Math.floor(intervalTime / 60) % 60; //分
          let sTime = intervalTime % 60
          if (intervalTime > 0) {
            var Time = mTime + ":" + sTime
          } else {
            clearInterval(interval);
            var Time = "00" + ":" + "00"
          }
          that.setData({
            orderInfo: res.data.orderInfo,
            orderGoods: res.data.orderGoods,
            handleOption: res.data.orderInfo.handleOption,
            addTime: addTime,
            Time: Time
          });
        }, 1000)
        // 请求物流信息,仅当订单状态为发货时才请求
        if (res.data.orderInfo.handleOption.confirm) {
          that.getOrderExpress();
        }
      }
    });
  },
  // “去付款”按钮点击效果
  payOrder: function() {
    let that = this;
    util.request(api.OrderPrepay, {
      orderId: that.data.orderId
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
  // “取消订单”点击效果
  cancelOrder: function() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      confirmColor: '#1ca6f8',
      success: function(res) {
        if (res.confirm) {
          util.request(api.OrderCancel, {
            orderId: orderInfo.id
          }, 'POST').then(function(res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '取消订单成功'
              });
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “取消订单并退款”点击效果
  refundOrder: function() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.OrderRefund, {
            orderId: orderInfo.id
          }, 'POST').then(function(res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '取消订单成功'
              });
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “删除”点击效果
  deleteOrder: function() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确定要删除此订单？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.OrderDelete, {
            orderId: orderInfo.id
          }, 'POST').then(function(res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '删除订单成功'
              });
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “确认收货”点击效果
  confirmOrder: function() {
    let that = this;
    let orderInfo = that.data.orderInfo;
    wx.showModal({
      title: '',
      content: '确认收货？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.OrderConfirm, {
            orderId: orderInfo.id
          }, 'POST').then(function(res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '确认收货成功！'
              });
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})