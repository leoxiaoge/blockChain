// pages/community_details/community_details.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
var WxParse = require('../../lib/wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
    indicatorDots: true,
    circular: true,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    swiperCurrent: 0,
    next: false, //下一步
    participate: false, //参加活动
    payment: false, //立即支付
    openAttr: false, //费用
    openReg: false, //报名信息
    apply_num: 1, //数量
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载详情中...',
    });
    let title = options.title
    wx.setNavigationBarTitle({
      title: title
    })
    let event_id = options.id
    this.setData({
      event_id: event_id
    })
  },

  onReady: function () {

  },

  onShow: function () {
    this.eventsDetail()
  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  eventsDetail: function () {
    var that = this
    let data = {
      event_id: that.data.event_id
    }
    util.request(api.EventsDetail, data).then(function (res) {
      wx.hideLoading();
      if (res.code == 200) {
        that.setData({
          events: res.data.events,
          residual: res.data.events.join_num - res.data.events.apply_num,
          event_fee: res.data.events.event_fee,
          event_fees: res.data.events.event_fee
        })
        WxParse.wxParse('eventsDetail', 'html', res.data.events.description, that);
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  participate: function () {
    this.setData({
      next: !this.data.next,
      participate: !this.data.participate,
      openAttr: !this.data.openAttr,
    })
  },
  //关闭弹窗
  closeInformation: function () {
    this.setData({
      openAttr: !this.data.openAttr,
      openAttr: !this.data.openAttr
    })
  },
  closeEvent: function () {
    this.setData({
      openReg: !this.data.openReg,
      openAttr: !this.data.openAttr,
    })
  },
  nextStep: function () {
    this.setData({
      next: !this.data.next,
      payment: !this.data.payment,
      openAttr: !this.data.openAttr,
      openReg: !this.data.openReg
    })
  },
  //姓名
  bindNameInput(event){
    let real_name = event.detail.value
    this.setData({
      real_name: real_name
    })
  },
  //联系电话
  bindMobileInput(event){
    let mobile = event.detail.value;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var flag = reg.test(mobile);
    if (!flag) {
      // util.showNoneToast('请填写正确的手机号码！')
    } else {
      this.setData({
        mobile: mobile
      })
    }
  },

  payment: function () {
    var that = this
    let real_name = that.data.real_name
    console.log(real_name)
    let mobile = that.data.mobile
    if (!real_name){
      util.showErrorToast('请填写姓名！');
    }
    if (real_name){
      let data = {
        event_id: that.data.event_id,
        real_name: real_name,
        mobile: mobile,
        apply_num: that.data.apply_num
      }
      util.request(api.EventsApply, data, 'POST').then(function (res) {
        if (res.code == 200) {
          setTimeout(function () {
            that.setData({
              order_id: res.data.order.order_id
            })
            that.addOrder()
          }, 1000)
        } else {
          util.showErrorToast(res.msg);
        }
      });
      this.setData({
        openReg: !this.data.openReg
      })
    }
  },

  // 活动支付
  addOrder: function () {
    var that = this
    let data = {
      order_id: that.data.order_id
    }
    util.request(api.EventsPay, data, 'POST').then(function (res) {
      if (res.code == 200) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            util.showToast("支付过程成功");
            that.eventsDetail()
          },
          'fail': function (res) {
            util.showErrorToast("支付过程失败");
          }
        });
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  closeAttr: function () {
    this.setData({
      openAttr: !this.data.openAttr,
    });
  },
  //添加数量
  cutNumber: function () {
    var apply_num = (this.data.apply_num - 1 > 1) ? this.data.apply_num - 1 : 1
    var event_fees = (this.data.event_fee * apply_num).toFixed(2)
    this.setData({
      apply_num: apply_num,
      event_fees: event_fees
    });
  },
  addNumber: function () {
    var apply_num = this.data.apply_num + 1
    var event_fees = (this.data.event_fee * apply_num).toFixed(2)
    this.setData({
      apply_num: apply_num,
      event_fees: event_fees
    });
  },

  initiator: function () {
    let user_id = this.data.events.user_id
    let admin_id = this.data.events.admin_id
    wx.navigateTo({
      url: '../initiator/initiator?user_id=' + user_id + '&admin_id=' + admin_id,
    })
  },
  
  //发布评论
  replylayer: function (e) {
    let nickname = ''
    this.setData({
      replyLayer: !this.data.replyLayer,
      nickname: nickname
    })
  },

  //评论页隐藏
  subreplylayer: function (e) {
    let comment_id = e.currentTarget.dataset.comment_id
    let nickname = e.currentTarget.dataset.nickname
    this.setData({
      replyLayer: !this.data.replyLayer,
      comment_id: comment_id,
      nickname: nickname
    })
  },

  textContent: function (e) {
    var that = this
    console.log(e.detail.value)
    that.setData({
      textcontent: e.detail.value
    })
    console.log(that.data.textcontent)
  },

  //提交评论
  formSubmit: function () {
    var that = this
    var content = that.data.textcontent
    console.log(content)
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var event_id = that.data.event_id
    var comment_id = that.data.comment_id
    if (comment_id) {
      var data = {
        event_id: event_id,
        content: content,
        comment_time: timestamp,
        comment_id: comment_id
      }
    } else {
      var data = {
        event_id: event_id,
        content: content,
        comment_time: timestamp,
      }
    }
    util.request(api.EventsComment, data, 'POST').then(function (res) {
      if (res.code == 200) {
        setTimeout(function () {
          util.showToast(res.msg);
        }, 1000)
        that.setData({
          replyLayer: !that.data.replyLayer
        })
        that.eventsDetail()
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  //图片点击事件
  previewImage: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.eventsDetail();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})