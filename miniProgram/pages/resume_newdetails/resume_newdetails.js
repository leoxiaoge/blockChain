// pages/resume_newdetails/resume_newdetails.js
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

  /**
   * 页面的初始数据
   */
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
    title: '发布简历',
    personalTitle: '个人信息',
    jobTitle: '意向职位',
    cancel: '../../../images/cancel.png',
    determine: '../../../images/determine.png',
    tempFilePaths: '/images/defaultAvatar.png',
    right: '/images/right.png',
    education: ['初中及以下', '中专/中技', '高中', '大专', '本科', '硕士', '博士'],
    working: ['0', '1', '2', '3', '4', '5'],
    job: ['应届毕业生', '离职-立即到岗', '在职-尽快到岗', '在职-考虑机会', '在职-暂不考虑'],
    jobList: ['运营', '金融', '设计', '物流', '市场', '市场'],
    startSalary: ['4', '5', '6', '7', '8'],
    endSalary: ['4', '5', '6', '7', '8'],
  },

  onLoad: function (options) {
    setDate(this.data.year, this.data.month, this.data.day, this)
    let nowYear = date.getFullYear()
    this.setData({
      nowYear: nowYear
    })
    this.CommonProvince() //请求省列表接口
  },

  onReady: function () {

  },

  onShow: function () {
    this.showModal()
  },

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
  //请求城市列表接口
  CommonCity: function (id) {
    var that = this
    let data = {
      id: id
    }
    util.request(api.CommonCity, data).then(function (res) {
      if (res.code == 200) {
        let city = res.data.city
        console.log(city[[0][0]].name)
        that.setData({
          city: city
        })
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
    console.log(this.data.provincedata[val[0]])
    console.log(this.data.city[val[1]].name)
    this.setData({
      province: province,
      provinceid: id,
      city: this.data.city[val[1]].name
    })
    that.CommonCity(id)
  },
  
  bindChange: function (e) {
    let val = e.detail.value
    setDate(this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]], this)
    let age = this.data.nowYear - this.data.years[val[0]] + 1
    console.log(age)
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      age: age
    })
  },

  toggleEducation: function () {
    this.setData({
      showEducation: !this.data.showEducation
    })
  },

  //学校
  toggleschool: function () {
    this.setData({
      eduExperience: this.data.eduExperience,
      school: this.data.school
    })
  },

  // 学历
  eduBindChange: function (e) {
    let val = e.detail.value
    console.log(this.data.education[val[0]])
    this.setData({
      educationName: this.data.education[val[0]]
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

  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  toggleWorking: function () {
    this.setData({
      showWorking: !this.data.showWorking
    });
  },

  toggleCity: function () {
    this.setData({
      showCity: !this.data.showCity
    });
  },

  toggleJob: function () {
    this.setData({
      showJob: !this.data.showJob
    });
  },

  toggleSalary: function () {
    this.setData({
      showSalary: !this.data.showSalary
    });
  },

  showModal: function () {
    var that = this
    let personal = that.data.personal
    let release = that.data.release
    let jobs = that.data.jobs
    if (!release) {
      var title = that.data.title
    }
    if (personal) {
      var title = that.data.personalTitle
    }
    if (jobs) {
      var title = that.data.jobTitle
    }
    wx.setNavigationBarTitle({
      title: title
    })
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
    this.setData({
      avatar_logo: userInfo.avatarUrl,
      openCamera: !this.data.openCamera
    })
    wx.uploadFile({
      url: api.Uploads, //仅为示例，非真实的接口地址
      filePath: userInfo.avatarUrl[0],
      name: 'image',
      formData: {
        'user': 'test'
      },
      success(res) {
        console.log(res)
        const data = res.data
      },
      fail: function (e) {
        wx.showModal({
          title: '错误',
          content: '上传失败',
          showCancel: false
        })
      }
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
            avatar_logo: image
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

  release: function () {
    this.setData({
      openCamera: !this.data.openCamera
    })
  },

  releasePersonal: function () {
    var that = this
    this.setData({
      release: !this.data.release,
      personal: !this.data.personal
    })
    let data = {
      real_name: that.data.real_name,
      sex: that.data.sex,
      avatar: that.data.avatar,
      age: that.data.age,
      education: that.data.education,
      email: that.data.email,
      mobile: that.data.mobile,
      province: that.data.province,
      city: that.data.city,
      work_year: that.data.work_year,
      apply_status: that.data.apply_status
    }
    util.request(api.PostsIsCompany, data).then(function (res) {
      if (res.code == 200) {
        that.setData({
          dataset: res.data
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  //发布个人信息
  resumeUserInfo: function () {
    this.setData({
      release: !this.data.release,
      personal: !this.data.personal
    })
  },

  //教育经历
  releaseExperience: function () {
    this.setData({
      eduExperience: !this.data.eduExperience,
      release: !this.data.release
    })
    // this.showModal()
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
      email: !this.data.email,
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
    console.log(e.detail.value)
  },
  //姓名输入
  bindNameInput: function (e) {
    let name = e.detail.value
    this.setData({
      real_name: name
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