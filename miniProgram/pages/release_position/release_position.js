// pages/release_position/release_position.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const content = require('../position_content/position_content.js');
var WxParse = require('../../lib/wxParse/wxParse.js');
const app = getApp()
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
    natValue: [1],
    eduValue: [2],
    jobValue: [1, 0, 0],
    salaryValue: [5, 5],
    openCamera: false,
    release: false,
    personal: false,
    name: false,
    jobs: false,
    school: false,
    jobDescription: false,
    teamDescription: false,
    postsName: false,
    trade: false,
    companyDescription: false,
    companyName: false,
    releaseMsg: false,
    title: '发布职位',
    cancel: '/images/cancel.png',
    determine: '/images/determine.png',
    tempFilePaths: '/images/defaultAvatar.png',
    right: '/images/right.png',
    working: ['0', '1', '2', '3', '4', '5'],
    startSalary: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'],
    endSalary: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
  },

  onLoad: function(options) {
    setDate(this.data.year, this.data.month, this.data.day, this)
    let nowYear = date.getFullYear()
    this.setData({
      nowYear: nowYear
    })
  },

  preventTouchMove: function (e) {

  },

  time: function () {
    this.setData({
      showTime: !this.data.showTime
    })
  },

  timeSure: function () {
    let set_time = this.data.year + '-' + this.data.month + '-' + this.data.day
    this.setData({
      set_time: set_time,
      showTime: !this.data.showTime
    })
  },

  bindChange: function (e) {
    let val = e.detail.value
    setDate(this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]], this)
    let set_time = this.data.years[val[0]] + '-' + this.data.months[val[1]] + '-' + this.data.days[val[2]]
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      set_time: set_time
    })
  },

  onReady: function() {
    this.isCompany();
  },

  onShow: function() {
    this.showModal()
  },
  // 设置导航标题
  showModal: function() {
    var that = this
    var title = that.data.title
    wx.setNavigationBarTitle({
      title: title
    })
  },
  bindJobInput: function (e) {
    var that = this
    let duty_keywords = e.detail.value
    let data = {
      duty_keywords: duty_keywords
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
  binddutyInput: function (e) {
    var that = this
    let duty_keywords = e.detail.value
    let data = {
      duty_category: that.data.duty_category,
      duty_keywords: duty_keywords
    }
    util.request(api.DutyLists, data).then(function (res) {
      if (res.code == 200) {
        console.log(res.data.duty)
        that.setData({
          dutydata: res.data.duty
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  // 判断用户公司
  isCompany: function() {
    let that = this;
    util.request(api.PostsIsCompany).then(function(res) {
      if (res.code == 200) {
        that.setData({
          dataset: res.data,
          company: res.data.company
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  // 职位描述
  bindjobDescription(event) {
    let posts_description = event.detail.value
    this.setData({
      posts_description: posts_description
    })
  },
  // 团队介绍
  Team: function() {
    this.setData({
      release: !this.data.release,
      teamDescription: !this.data.teamDescription
    });
  },
  // 团队介绍输入
  bindteamDescription(event) {
    let team_description = event.detail.value
    this.setData({
      team_description: team_description
    })
  },
  // 人员规模
  StaffSize: function () {
    this.setData({
      eduExperience: !this.data.eduExperience,
      staffSize: !this.data.staffSize
    });
  },
  bindStaffInput(event){
    let staff_size = event.detail.value
    this.setData({
      staff_size: staff_size
    })
  },
  // 注册资本
  RegisteredCapital: function () {
    this.setData({
      eduExperience: !this.data.eduExperience,
      registeredCapital: !this.data.registeredCapital
    });
  },
  //注册资本内容
  bindCapitalInput(event){
    let registered_capital = event.detail.value
    this.setData({
      registered_capital: registered_capital
    })
  },
  // 法人代表
  LegalPerson: function () {
    this.setData({
      eduExperience: !this.data.eduExperience,
      legalPerson: !this.data.legalPerson
    });
  },
  // 法人代表内容
  bindPersonInput(event){
    let legal_person = event.detail.value
    this.setData({
      legal_person: legal_person
    })
  },
  // 公司联系电话
  Mobile: function () {
    this.setData({
      eduExperience: !this.data.eduExperience,
      mobiles: !this.data.mobiles
    });
  },
  // 公司联系电话内容
  bindMobileInput(event) {
    let mobile = event.detail.value
    this.setData({
      mobile: mobile
    })
  },
  // 公司邮箱
  Email: function () {
    this.setData({
      eduExperience: !this.data.eduExperience,
      emails: !this.data.emails
    });
  },
  // 公司邮箱内容
  bindEmailInput(event) {
    let email = event.detail.value
    this.setData({
      email: email
    })
  },
  //公司名称
  Company: function() {
    this.setData({
      eduExperience: !this.data.eduExperience,
      companyName: !this.data.companyName
    })
  },
  // 公司简介
  CompanyDescription: function() {
    this.setData({
      eduExperience: !this.data.eduExperience,
      companyDescription: !this.data.companyDescription
    })
  },
  bindCompanyDescription(event) {
    let company_description = event.detail.value
    this.setData({
      company_description: company_description
    })
  },
  // 工作年限名称
  workBindChange: function(e) {
    let val = e.detail.value
    console.log(this.data.dataset.experience[val[0]].name)
    this.setData({
      experience: this.data.dataset.experience[val[0]].name
    })
  },
  // 工作年限
  Working: function() {
    this.setData({
      showWorking: !this.data.showWorking
    });
  },
  // 默认初始工作年限
  WorkingSure: function(e) {
    if (this.data.experience) {
      this.setData({
        showWorking: !this.data.showWorking
      })
    } else {
      this.setData({
        experience: this.data.dataset.experience[[0][0]].name,
        showWorking: !this.data.showWorking
      })
    }
  },
  // 默认初始学历
  EducationSure: function(e) {
    if (this.data.education) {
      this.setData({
        showEducation: !this.data.showEducation
      })
    } else {
      this.setData({
        education: this.data.dataset.education[[0][0]].name,
        showEducation: !this.data.showEducation
      })
    }
  },
  // 学历名称选择
  eduBindChange: function(e) {
    let val = e.detail.value
    console.log(val)
    console.log(this.data.dataset.education[val[0]].name)
    this.setData({
      education: this.data.dataset.education[val[0]].name
    })
  },
  // 选择学历
  Education: function() {
    this.setData({
      showEducation: !this.data.showEducation
    })
  },
  // 默认初始工作性质
  NatureSure: function() {
    if (this.data.work_nature) {
      this.setData({
        showNature: !this.data.showNature
      })
    } else {
      this.setData({
        work_nature: this.data.dataset.nature[[0][0]].name,
        showNature: !this.data.showNature
      })
    }
  },
  // 工作性质
  Nature: function() {
    this.setData({
      showNature: !this.data.showNature
    });
  },
  // 工作性质选择
  natureBindChange: function(e) {
    let val = e.detail.value
    console.log(this.data.dataset.nature[val[0]].name)
    this.setData({
      work_nature: this.data.dataset.nature[val[0]].name
    })
  },
  // 确定薪资范围
  SalarySure: function() {
    if (this.data.min_salary && this.data.max_salary) {
      this.setData({
        showSalary: !this.data.showSalary
      })
    } else {
      this.setData({
        min_salary: this.data.startSalary[this.data.salaryValue[0]],
        max_salary: this.data.endSalary[this.data.salaryValue[1]],
        showSalary: !this.data.showSalary
      })
    }
  },
  // 薪资范围
  salaryBindChange: function(e) {
    var val = e.detail.value
    console.log(this.data.startSalary[val[0]])
    console.log(this.data.endSalary[val[1]])
    let min_salary = this.data.startSalary[val[0]]
    let max_salary = this.data.endSalary[val[1]]
    console.log(min_salary, max_salary)
    if (parseInt(min_salary) <= parseInt(max_salary)) {
      this.setData({
        min_salary: min_salary,
        max_salary: max_salary
      })
    } else{
      util.showErrorToast('请选择正确范围！');
    }
  },
  // 弹出融资阶段框
  Financing: function() {
    this.setData({
      showFinancing: !this.data.showFinancing
    })
  },
  FinancingSure: function(e) {
    if (this.data.financing) {
      this.setData({
        showFinancing: !this.data.showFinancing
      })
    } else {
      this.setData({
        financing: this.data.dataset.financing[[0][0]].name,
        showFinancing: !this.data.showFinancing
      })
    }
  },
  // 融资阶段选择
  financingBindChange: function(e) {
    let val = e.detail.value
    console.log(this.data.dataset.financing[val[0]].name)
    this.setData({
      financing: this.data.dataset.financing[val[0]].name
    })
  },

  // 所属行业
  Trade: function() {
    this.setData({
      eduExperience: !this.data.eduExperience,
      trade: !this.data.trade
    })
  },
  // 行业名称
  tradeList: function(e) {
    let name = e.currentTarget.dataset.name
    let trade_id = e.currentTarget.dataset.id
    this.setData({
      trade_name: name,
      trade_id: trade_id
    })
  },
  Salary: function() {
    this.setData({
      showSalary: !this.data.showSalary
    });
  },

  Description: function() {
    this.setData({
      release: !this.data.release,
      jobDescription: !this.data.jobDescription
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
  upload: function (res) {
    var that = this;
    const uploadTask = wx.uploadFile({
      url: api.Uploads,
      filePath: res.tempFilePaths[0],
      name: 'image',
      success: function (res) {
        console.log(res)
        var _res = JSON.parse(res.data);
        console.log(_res)
        if (_res.code === 200) {
          var image = _res.data.image
          console.log(_res.data.image)
          that.setData({
            hasPicture: true,
            company_logo: image
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

  map: function() { //打开微信地图选择地址
    var that = this;
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res.address)
        that.setData({
          addressname: res.address
        })
        var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
        var REGION_PROVINCE = [];
        var addressBean = {
          REGION_PROVINCE: null,
          REGION_COUNTRY: null,
          REGION_CITY: null,
          ADDRESS: null
        };

        function regexAddressBean(address, addressBean) {
          regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
          var addxress = regex.exec(address);
          addressBean.REGION_CITY = addxress[1];
          addressBean.REGION_COUNTRY = addxress[2];
          addressBean.ADDRESS = addxress[3] + "(" + res.name + ")";
        }
        if (!(REGION_PROVINCE = regex.exec(res.address))) {
          regex = /^(.*?(省|自治区))(.*?)$/;
          REGION_PROVINCE = regex.exec(res.address);
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(REGION_PROVINCE[3], addressBean);
        } else {
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(res.address, addressBean);
        }
        that.setData({
          ADDRESS_1_STR: addressBean.REGION_PROVINCE + " " +
            addressBean.REGION_CITY + "" +
            addressBean.REGION_COUNTRY,
          province: addressBean.REGION_PROVINCE,
          city: addressBean.REGION_CITY,
          zone: addressBean.REGION_COUNTRY,
          address: addressBean.ADDRESS
        });
      },
      fail: function() {
        wx.showModal({
          content: "您好，如果需要使用此服务需要您对小程序进行授权。",
          showCancel: false,
          confirmText: "确定",
          confirmColor: '#2BBCD9',
          success: function() {
            wx.openSetting({
              success: function(res) {
                that.map();
              }
            })
          }
        });
      }
    })
  },

  userInfochooseimage: function() {
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      tempFilePaths: userInfo.avatarUrl,
      openCamera: !this.data.openCamera
    })
  },

  release: function() {
    this.setData({
      openCamera: !this.data.openCamera
    })
  },

  releaseJob: function() {
    this.setData({
      jobs: !this.data.jobs,
      release: !this.data.release,
      posts_name: '',
      dutydataindex: '999'
    })
  },

  //教育经历
  releaseExperience: function() {
    this.setData({
      eduExperience: !this.data.eduExperience,
      release: !this.data.release
    })
  },

  releasePostsName: function() {
    this.setData({
      postsName: !this.data.postsName,
      release: !this.data.release
    })
  },

  jobList: function(e) {
    var that = this
    let name = e.currentTarget.dataset.name
    let dutyindex = e.currentTarget.dataset.index
    let duty_category = e.currentTarget.dataset.id
    that.setData({
      duty_category: duty_category,
      dutyindex: dutyindex,
      duty_category_name: name
    })
    let data = {
      duty_category: duty_category
    }
    util.request(api.DutyLists, data).then(function(res) {
      if (res.code == 200) {
        console.log(res.data.duty)
        that.setData({
          dutydata: res.data.duty
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  // 职位名称
  dutyList: function(e) {
    let name = e.currentTarget.dataset.name
    let dutyindex = e.currentTarget.dataset.index
    let duty_child = e.currentTarget.dataset.id
    this.setData({
      dutydataindex: dutyindex,
      posts_name: name,
      duty_child: duty_child
    })
  },

  bindCompanyNameInput: function(e) {
    let company_name = e.detail.value
    this.setData({
      company_name: company_name
    })
  },

  releaseSuccess: function () {
    this.setData({
      releaseMsg: !this.data.releaseMsg
    })
  },

  formReset: function () {
    var that = this
    let posts = {
      posts_name: that.data.posts_name,
      posts_description: that.data.posts_description,
      team_description: that.data.team_description,
      min_salary: that.data.min_salary,
      max_salary: that.data.max_salary,
      education: that.data.education,
      experience: that.data.experience,
      work_nature: that.data.work_nature,
      province: that.data.province,
      city: that.data.city,
      zone: that.data.zone,
      address: that.data.address,
      duty_category: that.data.duty_category,
      duty_child: that.data.duty_child,
      company_id: that.data.company_id,
      company_name: that.data.company_name,
      company_logo: that.data.company_logo,
      company_description: that.data.company_description,
      company_province: that.data.province,
      company_city: that.data.city,
      company_zone: that.data.zone,
      company_address: that.data.address,
      set_time: that.data.set_time,
      registered_capital: that.data.registered_capital,
      legal_person: that.data.legal_person,
      staff_size: that.data.staff_size,
      financing: that.data.financing,
      mobile: that.data.mobile,
      email: that.data.email,
      trade_id: that.data.trade_id,
      company:{
        company_logo: that.data.company_logo,
        financing: that.data.financing,
        staff_size: that.data.staff_size,
        company_name: that.data.company_name
      },
      duty: {
        title: that.data.trade_name
      }
    }
    WxParse.wxParse('postsDetail', 'html', that.data.team_description, that);
    WxParse.wxParse('postsTeamDetail', 'html', that.data.team_description, that);
    console.log(posts)
    this.setData({
      posts: posts,
      release: !that.data.release,
      content: !that.data.content
    })
  },
  postsSubmit: function() {
    var that = this
    let data = {
      posts_name: that.data.posts_name,
      posts_description: that.data.posts_description,
      team_description: that.data.team_description,
      min_salary: that.data.min_salary,
      max_salary: that.data.max_salary,
      education: that.data.education,
      experience: that.data.experience,
      work_nature: that.data.work_nature,
      province: that.data.province,
      city: that.data.city,
      zone: that.data.zone,
      address: that.data.address,
      duty_category: that.data.duty_category,
      duty_child: that.data.duty_child,
      company_id: that.data.company_id,
      company_name: that.data.company_name,
      company_logo: that.data.company_logo,
      company_description: that.data.company_description,
      company_province: that.data.province,
      company_city: that.data.city,
      company_zone: that.data.zone,
      company_address: that.data.address,
      set_time: that.data.set_time,
      registered_capital: that.data.registered_capital,
      legal_person: that.data.legal_person,
      staff_size: that.data.staff_size,
      financing: that.data.financing,
      // mobile: that.data.mobile,
      // email: that.data.email,
      trade_id: that.data.trade_id
    }
    util.request(api.PostsSubmit, data, 'POST').then(function(res) {
      console.log(res)
      if (res.code == 200) {
        that.setData({
          msg:res.msg,
          releaseMsg: !that.data.releaseMsg
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})