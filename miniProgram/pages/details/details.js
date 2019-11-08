// pages/details/details.js
var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');
Page({
  data: {
    current: '0',
    indicatorDots: false,
    circular: true,
    swiperCurrent: '0',
    comment_id: '',
    brands: ['课程介绍', '课程目录'],
    idx: "0",
    noclasses: ['','']
  },
  
  onLoad: function(options) {
    let title = options.title
    wx.setNavigationBarTitle({
      title: title
    })
    let courses_id = options.id
    if (options.classes_id){
      let classes_id = options.classes_id
      this.setData({
        classes_id: classes_id,
        current: '1'
      })
    }
    this.setData({
      courses_id: courses_id
    })
    wx.showLoading({
      title: '加载详情中...',
    });
  },

  onReady: function() {
    
  },

  onShow: function () {
    this.detail()
    this.watchGoon()
  },

  bindtap: function (e) {
    this.setData({
      idx: e.currentTarget.id
    });
  },

  watchGoon: function () {
    var that = this
    let courses_id = that.data.courses_id
    let data = {
      courses_id: courses_id 
    }
    util.request(api.CoursesWatchGoon, data, 'POST').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        that.setData({
          classes_id: res.data.classes_id
        })
        that.detail()
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  bindplay: function(e) {
    console.log(e)
    let that = this
    let classes_id = e.currentTarget.dataset.id
    let data = {
      classes_id: classes_id
    }
    util.request(api.CoursesWatchClasses, data, 'POST').then(function(res) {
      if (res.code == 200) {

      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  bindended: function(e) {
    let classes_id = e.currentTarget.dataset.id
    let watch_time = this.data.watch_time
    let data = {
      classes_id: classes_id,
      watch_time: watch_time
    }
    util.request(api.CoursesWatchEnd, data, 'POST').then(function(res) {
      if (res.code == 200) {

      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  bindtimeupdate: function(e) {
    console.log('播放进度', e)
    console.log(e.detail.currentTime)
    this.setData({
      watch_time: e.detail.currentTime
    })
  },

  audioPause: function (e) {
    console.log('暂停', e)
    let classes_id = e.currentTarget.dataset.id
    let watch_time = this.data.watch_time
    let data = {
      classes_id: classes_id,
      watch_time: watch_time
    }
    util.request(api.CoursesWatchPass, data, 'POST').then(function (res) {
      if (res.code == 200) {

      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  detail: function() {
    let that = this
    let courses_id = that.data.courses_id
    let data = {
      courses_id: courses_id
    }
    util.request(api.CoursesDetail, data).then(function(res) {
      wx.hideLoading();
      if (res.code == 200) {
        that.setData({
          courses: res.data.courses,
          classes: res.data.courses.classes,
          user_type: res.data.user_type
        })
        WxParse.wxParse('coursesDetail', 'html', res.data.courses.courses_description, that);
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  switchNav: function(e) {
    let current = e.currentTarget.dataset.current
    this.setData({
      current: current
    })
  },

  signUp: function(e) {
    let courses_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/application/application?courses_id=' + courses_id,
    })
  },

  homework: function(e) {
    console.log(e)
    let classes_id = e.currentTarget.dataset.classes_id
    wx.navigateTo({
      url: '../homework/homework?classes_id=' + classes_id,
    })
  },

  //发布评论
  replylayer: function(e) {
    let nickname = ''
    this.setData({
      replyLayer: !this.data.replyLayer,
      nickname: nickname
    })
  },

  //评论页隐藏
  subreplylayer: function(e) {
    let comment_id = e.currentTarget.dataset.comment_id
    let nickname = e.currentTarget.dataset.nickname
    this.setData({
      replyLayer: !this.data.replyLayer,
      comment_id: comment_id,
      nickname: nickname
    })
  },

  textContent: function(e) {
    var that = this
    console.log(e.detail.value)
    that.setData({
      textcontent: e.detail.value
    })
    console.log(that.data.textcontent)
  },

  //提交评论
  formSubmit: function() {
    var that = this
    var content = that.data.textcontent
    console.log(content)
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var courses_id = that.data.courses_id
    var comment_id = that.data.comment_id
    if (comment_id) {
      var data = {
        courses_id: courses_id,
        content: content,
        comment_time: timestamp,
        comment_id: comment_id
      }
    } else {
      var data = {
        courses_id: courses_id,
        content: content,
        comment_time: timestamp,
      }
    }
    util.request(api.CoursesComment, data, 'POST').then(function(res) {
      if (res.code == 200) {
        setTimeout(function() {
          util.showToast(res.msg);
        }, 1000)
        that.setData({
          replyLayer: !that.data.replyLayer
        })
        that.detail()
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  //下载文件资源到本地，客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径
  DownloadTask: function(e) {
    let txt = e.currentTarget.dataset.txt
    wx.downloadFile({
      url: txt,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },

  addFast: function() {
    var that = this
    let data = {
      courses_id: that.data.courses_id
    }
    util.request(api.CoursesApply, data, 'POST').then(function(res) {
      if (res.code == 200) {
        let order_id = res.data.order_id
        let courses_id = that.data.courses_id
        setTimeout(function() {
          wx.navigateTo({
            url: '../payment/payment?order_id=' + order_id + '&courses_id=' + courses_id,
          })
        }, 1000)
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  previewImage: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.detail();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onLogin: function () {
    wx.navigateTo({
      url: "/pages/login/login"
    });
  },
  
  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})