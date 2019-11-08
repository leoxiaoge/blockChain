// pages/application/application.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const date = new Date()
const nowYear = date.getFullYear()
const nowMonth = date.getMonth() + 1
const nowDay = date.getDate()
let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
// 根据年月 获取当月的总天数
let getDays = function (year, month) {
  if (month === 2) {
    return ((year % 4 === 0) && ((year % 100) !== 0)) || (year % 400 === 0) ? 29 : 28
  } else {
    return daysInMonth[month - 1]
  }
}
// 根据年月日设置当前月有多少天 并更新年月日数组
let setDate = function (year, month, day, _th) {
  let daysNum = year === nowYear && month === nowMonth ? nowDay : getDays(year, month)
  day = day > daysNum ? 1 : day
  let monthsNum = year === nowYear ? nowMonth : 12
  let years = []
  let months = []
  let days = []
  let yearIdx = 9999
  let monthIdx = 0
  let dayIdx = 0
  // 重新设置年份列表
  for (let i = 1900; i <= nowYear; i++) {
    years.push(i)
  }
  years.map((v, idx) => {
    if (v === year) {
      yearIdx = idx
    }
  })
  // 重新设置月份列表
  for (let i = 1; i <= monthsNum; i++) {
    months.push(i)
  }
  months.map((v, idx) => {
    if (v === month) {
      monthIdx = idx
    }
  })
  // 重新设置日期列表
  for (let i = 1; i <= daysNum; i++) {
    days.push(i)
  }
  days.map((v, idx) => {
    if (v === day) {
      dayIdx = idx
    }
  })
  _th.setData({
    years: years, //年份列表
    months: months, //月份列表
    days: days, //日期列表
    value: [yearIdx, monthIdx, dayIdx],
    year: year,
    month: month,
    day: day
  })
}
Page({
  data: {
    scrollindex: 0, //当前页面的索引值
    totalnum: 5, //总共页面数
    starty: 0, //开始的位置x
    endy: 0, //结束的位置y
    critical: 100, //触发翻页的临界值
    margintop: 0, //滑动下拉距离
    fail: false,
    title: '入学申请',
    cancel: '/images/cancel.png',
    determine: '/images/determine.png',
    years: [],
    months: [],
    days: [],
    year: nowYear,
    month: nowMonth,
    day: nowDay,
    value: [9999, 1, 1],
    val: [0, 0],
    id: '0'
  },

  onLoad: function(options) {
    var that = this
    setDate(this.data.year, this.data.month, this.data.day, this)
    let nowYear = date.getFullYear()
    let birthday = nowYear + '-' + nowMonth + '-' + nowDay
    that.setData({
      nowYear: nowYear,
      birthday: birthday,
      courses_id: options.courses_id,
    })
    util.request(api.CommonProvince).then(function (res) {
      if (res.code == 200) {
        that.setData({
          provinces: res.data.province
        })
        let id = res.data.province[[0][0]].id
        that.CommonCity(id)
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  onReady: function() {
    this.commonTeacher() //讲师团
  },

  onShow: function() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    var next = true;
    //连续动画关键步骤
    setInterval(function() {
      if (next) {
        this.animation.scale(1).step()
        next = !next;
      } else {
        this.animation.scale(1.68).step()
        next = !next;
      }
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 500)
  },

  onUnload: function () {
    
  },

  //开始触摸
  scrollTouchstart: function(e) {
    let py = e.touches[0].pageY;
    this.setData({
      starty: py
    })
  },
  //触摸移动
  scrollTouchmove: function(e) {
    let py = e.touches[0].pageY;
    let d = this.data;
    this.setData({
      endy: py,
    })
    if (py - d.starty < 200 && py - d.starty > -100) {
      this.setData({
        margintop: py - d.starty
      })
    }
  },
  //触摸结束
  scrollTouchend: function(e) {
    let d = this.data;
    if (d.endy - d.starty > 200 && d.scrollindex > 0) {
      this.setData({
        scrollindex: d.scrollindex - 1
      })
    } else if (d.endy - d.starty < -100 && d.scrollindex < this.data.totalnum - 1) {
      this.setData({
        scrollindex: d.scrollindex + 1
      })
    }
    this.setData({
      starty: 0,
      endy: 0,
      margintop: 0
    })
  },
  commonTeacher: function () {
    var that = this
    util.request(api.CommonTeacher).then(function (res) {
      if (res.code == 200) {
        that.setData({
          teacher: res.data.teacher
        })
      } else {
        
      }
    });
  },

  obtainFail: function(e) {
    this.setData({
      fail: !this.data.fail
    })
  },

  inputName: function (event) {
    let name = event.detail.value
    this.setData({
      real_name: name
    })
  },

  //手机号码
  inputMobile(event) {
    let mobile = event.detail.value;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var flag = reg.test(mobile);
    if (!flag) {
      wx.showModal({
        content: '请填写正确的手机号码！',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#2BBCD9',
        success: function (res) {
          
        }
      })
    } else{
      this.setData({
        mobile: mobile
      })
    }
  },
  
  // 出生日期
  Birthday: function () {
    var that = this
    that.setData({
      showDate: !that.data.showDate
    })
  },
  bindChange: function (e) {
    let val = e.detail.value
    setDate(this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]], this)
    if (this.data.days[val[2]] == undefined) {
      var daynum = 1
    } else{
      var daynum = this.data.days[val[2]]
    }
    let birthday = this.data.years[val[0]] + '-' + this.data.months[val[1]] + '-' + daynum
    this.setData({
      birthday: birthday
    })
  },
  //选择城市点击事件
  provinceCity: function () {
    var that = this
    that.setData({
      showCity: !that.data.showCity
    })
  },
  //城市列表
  CommonCity: function (id) {
    var that = this
    let data = {
      id: id
    }
    util.request(api.CommonCity, data).then(function (res) {
      if (res.code == 200) {
        var city = res.data.city
        that.setData({
          citys: city
        })
        var val = that.data.val
        if (that.data.citys[val[1]].name){
          var cityname = that.data.citys[val[1]].name
          var province = that.data.provinces[val[0]].name
          that.setData({
            city: cityname,
            province: province
          })
        }
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  // 所在城市
  cityBindChange: function (e) {
    var that = this
    let val = e.detail.value
    let id = that.data.provinces[val[0]].id
    that.setData({
      val: val
    })
    that.CommonCity(id)
  },

  //学籍卡提交
  obtain: function (e) {
    var that = this
    let title = that.data.title
    let id = that.data.id
    wx.setStorageSync('mobile', that.data.mobile);
    let data = {
      real_name: that.data.real_name,
      birthday: that.data.birthday,
      province: that.data.province,
      city: that.data.city,
      mobile: that.data.mobile
    }
    util.request(api.UserSubmitCard, data, 'POST').then(function (res) {
      if (res.code == 200) {
        wx.navigateTo({
          url: '../ucenter/card/card?title=' + title + '&id=' + id,
        })
      } else {
        that.setData({
          fail: !that.data.fail,
          msg: res.msg
        })
      }
    });
  },
  onReachBottom: function() {

  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})