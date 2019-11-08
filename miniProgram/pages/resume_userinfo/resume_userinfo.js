// pages/resume_userinfo/resume_userinfo.js
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
    years: [],
    months: [],
    days: [],
    year: nowYear,
    month: nowMonth,
    day: nowDay,
    value: [9999, 1, 1],
    eduValue: [3, 0, 0],
    jobValue: [1, 0, 0],
    salaryValue: [2, 2],
    openCamera: false,
    release: false,
    personal: false,
    name: false,
    jobs: false,
    school: false,
    sex: '',
    title: '发布简历',
    personalTitle: '个人信息',
    jobTitle: '意向职位',
    cancel: '../../../images/cancel.png',
    determine: '../../../images/determine.png',
    tempFilePaths: '/images/defaultAvatar.png',
    right: '/images/right.png',
    startSalary: ['4', '5', '6', '7', '8'],
    endSalary: ['4', '5', '6', '7', '8'],
    val: [0, 0]
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      resume_id: options.resume_id
    })
    setDate(this.data.year, this.data.month, this.data.day, this)
    let nowYear = date.getFullYear()
    this.setData({
      nowYear: nowYear
    })
    this.CommonProvince() //请求省列表接口
    this.EducationList() //教育列表接口
    this.CommonWorkStatus() //求职状态
    this.CommonExperience()
  },

  onReady: function () {
    var that = this
    let data = {
      resume_id: that.data.resume_id
    }
    util.request(api.UserResumeUserinfo, data).then(function (res) {
      if (res.code == 200) {
        console.log(res.data.user_info)
        that.setData({
          user: res.data.user_info,
          age: res.data.user_info.age,
          avatar: res.data.user_info.avatar,
          city: res.data.user_info.city,
          education: res.data.user_info.education,
          email: res.data.user_info.email,
          experience: res.data.user_info.experience,
          mobile: res.data.user_info.mobile,
          province: res.data.user_info.province,
          real_name: res.data.user_info.real_name,
          sex: res.data.user_info.sex,
          user_id: res.data.user_info.user_id,
          work_status: res.data.user_info.work_status,
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  onShow: function () {
    this.showModal()
  },

  EducationList: function () {
    var that = this
    util.request(api.CommonEducation).then(function (res) {
      if (res.code == 200) {
        that.setData({
          educationdata: res.data.education
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  CommonWorkStatus: function () {
    var that = this
    util.request(api.CommonWorkStatus).then(function (res) {
      if (res.code == 200) {
        that.setData({
          work_statu: res.data.work_status
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  CommonExperience: function () {
    var that = this
    util.request(api.CommonExperience).then(function (res) {
      if (res.code == 200) {
        that.setData({
          experiences: res.data.experience
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  showModal: function () {
    var that = this
    let personal = that.data.personal
    let jobs = that.data.jobs
    if (!personal) {
      var title = that.data.personalTitle
    }
    if (jobs) {
      var title = that.data.jobTitle
    }
    wx.setNavigationBarTitle({
      title: title
    })
  },
  //请求省列表接口
  CommonProvince: function () {
    var that = this
    util.request(api.CommonProvince).then(function (res) {
      if (res.code == 200) {
        var province = res.data.province
        var id = province[[0][0]].id
        that.setData({
          provincedata: province
        })
        console.log(province[[0][0]].name)
        that.CommonCity(id)
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  // 所在城市
  cityBindChange: function (e) {
    var that = this
    let val = e.detail.value
    let id = this.data.provincedata[val[0]].id
    let province = this.data.provincedata[val[0]].name
    this.setData({
      province: province,
      val: val
    })
    that.CommonCity(id)
  },
  //请求城市列表接口
  CommonCity: function (id) {
    var that = this
    let data = {
      id: id
    }
    util.request(api.CommonCity, data).then(function (res) {
      if (res.code == 200) {
        var city = res.data.city
        that.setData({
          citydata: city
        })
        var val = that.data.val
        if (that.data.citydata[val[1]].name) {
          var cityname = that.data.citydata[val[1]].name
          var province = that.data.provincedata[val[0]].name
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
  //城市
  City: function () {
    this.setData({
      showCity: !this.data.showCity
    });
  },
  CitySure: function () {
    this.setData({
      showCity: !this.data.showCity
    });
  },

  bindChange: function (e) {
    let val = e.detail.value
    setDate(this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]], this)
    let age = this.data.nowYear - this.data.years[val[0]] + 1
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      age: age
    })
  },

  //工作年限
  workBindChange: function (e) {
    let val = e.detail.value
    let experience = this.data.experiences[val[0]].name
    console.log(this.data.experiences[val[0]].name)
    this.setData({
      experience: experience
    })
  },
  workStatusBindChange: function (e) {
    let val = e.detail.value
    let work_status = this.data.work_statu[val[0]].name
    console.log(this.data.work_statu[val[0]].name)
    this.setData({
      work_status: work_status
    })
  },
  Working: function () {
    this.setData({
      showWorking: !this.data.showWorking
    });
  },
  WorkingSure: function (e) {
    let work_year = this.data.experiences[[0][0]]
    this.setData({
      work_year: work_year,
      showWorking: !this.data.showWorking
    })
  },
  // 学历
  eduBindChange: function (e) {
    let val = e.detail.value
    console.log(this.data.educationdata[val[0]])
    this.setData({
      education: this.data.educationdata[val[0]].name
    })
  },
  Education: function () {
    this.setData({
      showEducation: !this.data.showEducation
    })
  },
  EducationSure: function () {
    this.setData({
      education: this.data.educationdata[[0][0]].name,
      showEducation: !this.data.showEducation
    })
  },

  salaryBindChange: function (e) {
    let val = e.detail.value
    console.log(this.data.startSalary[val[0]])
    console.log(this.data.endSalary[val[1]])
    this.setData({
      startSalaryNum: this.data.startSalary[val[0]],
      endSalaryNum: this.data.endSalary[val[1]]
    })
  },

  Dialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  Job: function () {
    this.setData({
      showJob: !this.data.showJob
    });
  },

  Salary: function () {
    this.setData({
      showSalary: !this.data.showSalary
    });
  },

  albumchooseimage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        that.setData({
          tempFilePaths: res.tempFilePaths,
          openCamera: !that.data.openCamera,
          files: res.tempFilePaths
        });
        that.upload(res);
      }
    })
  },
  camerachooseimage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function (res) {
        that.setData({
          tempFilePaths: res.tempFilePaths,
          openCamera: !that.data.openCamera,
          files: res.tempFilePaths
        });
        that.upload(res);
      }
    })
  },
  userInfochooseimage: function () {
    var that = this
    let userInfo = wx.getStorageSync('userInfo')
    that.setData({
      avatar: userInfo.avatarUrl,
      openCamera: !this.data.openCamera
    })
  },
  upload: function (res) {
    var that = this;
    const uploadTask = wx.uploadFile({
      url: api.Uploads,
      filePath: res.tempFilePaths[0],
      name: 'image',
      success: function (res) {
        var _res = JSON.parse(res.data);
        console.log(_res)
        if (_res.code === 200) {
          var image = _res.data.image
          that.setData({
            hasPicture: true,
            avatars: image
          })
        }
      },
      fail: function (e) {
        wx.showModal({
          title: '错误',
          content: '上传失败',
          showCancel: false
        })
      },
    })
  },
  //姓名输入
  bindNameInput: function (e) {
    let name = e.detail.value
    this.setData({
      real_name: name
    })
  },
  // 邮箱
  bindEmailInput(event) {
    console.log(event.detail.value)
    let email = event.detail.value
    this.setData({
      email: email
    })
  },
  //手机号码
  bindPhoneInput(event) {
    let mobile = event.detail.value
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var flag = reg.test(mobile);
    if (!flag) {
      wx.showModal({
        content: '请填写正确的手机号码！',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#2BBCD9',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
    this.setData({
      mobile: mobile
    })
  },

  release: function () {
    this.setData({
      openCamera: !this.data.openCamera
    })
  },

  resumeUserInfo: function () {
    var that = this
    console.log(that.data.sex)
    that.data.user.real_name = that.data.real_name
    that.data.user.sex = that.data.sex
    if (that.data.avatars){
      that.data.user.avatar = that.data.avatars
    } else{
      that.data.user.avatar = that.data.avatar
    }
    that.data.user.age = that.data.age
    that.data.user.education = that.data.education
    that.data.user.email = that.data.email
    that.data.user.mobile = that.data.mobile
    that.data.user.province = that.data.province
    that.data.user.city = that.data.city
    that.data.user.experience = that.data.experience
    that.data.user.work_status = that.data.work_status
    console.log(that.data.user)
    let user = that.data.user
    let data = {
      real_name: user.real_name,
      sex: user.sex,
      avatar: user.avatar,
      age: user.age,
      education: user.education,
      email: user.email,
      mobile: user.mobile,
      province: user.province,
      city: user.city,
      experience: user.experience,
      apply_status: user.work_status
    }
    util.request(api.ResumeUserInfo, data, 'POST').then(function (res) {
      if (res.code == 200) {
        wx.navigateBack({

        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },


  jobList: function (e) {
    let idx = e.currentTarget.dataset.idx
    this.setData({
      idx: idx
    })
  },

  personalName: function () {
    this.setData({
      name: !this.data.name,
      personal: !this.data.personal
    })
  },

  personalEmail: function () {
    this.setData({
      Email: !this.data.Email,
      personal: !this.data.personal
    })
  },

  personalPhone: function () {
    this.setData({
      phone: !this.data.phone,
      personal: !this.data.personal
    })
  },

  radioChange: function (e) {
    console.log(e)
    let sex = e.detail.value
    console.log(sex)
    this.setData({
      sex: sex
    })
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})