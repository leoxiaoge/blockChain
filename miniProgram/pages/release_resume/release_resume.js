// pages/release_resume/release_resume.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
// const content = require('../position_content/position_content.js');
const date = new Date()
const nowYear = date.getFullYear()
const nowMonth = date.getMonth() + 1
const nowDay = date.getDate()
let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
// 根据年月 获取当月的总天数
let getDays = function(year, month) {
  if (month === 2) {
    return ((year % 4 === 0) && ((year % 100) !== 0)) || (year % 400 === 0) ? 29 : 28
  } else {
    return daysInMonth[month - 1]
  }
}
// 根据年月日设置当前月有多少天 并更新年月日数组
let setDate = function(year, month, day, _th) {
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
    salaryValue: [5, 5],
    openCamera: false,
    release: false,
    personal: false,
    name: false,
    jobs: false,
    school: false,
    title: '发布简历',
    sex: '1',
    cancel: '/images/cancel.png',
    determine: '/images/determine.png',
    tempFilePaths: '/images/defaultAvatar.png',
    right: '/images/right.png',
    working: ['0', '1', '2', '3', '4', '5'],
    job: ['应届毕业生', '离职-立即到岗', '在职-尽快到岗', '在职-考虑机会', '在职-暂不考虑'],
    jobList: ['运营', '金融', '设计', '物流', '市场', '市场'],
    startSalary: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    endSalary: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    education: [],
    work: [],
    project: [],
    language: [],
    skill: [],
    val: [0, 0],
  },
  onLoad: function(options) {
    setDate(this.data.year, this.data.month, this.data.day, this)
    let nowYear = date.getFullYear()
    this.setData({
      nowYear: nowYear,
    })
    this.CommonProvince() //请求省列表接口
    this.EducationList()
    this.TradeLists() //行业接口
  },

  onReady: function () {

  },

  onShow: function () {
    var user = wx.getStorageSync('user')
    this.showModal()
    this.setData({
      user: user
    })
    this.userinfo()
  },

  preventTouchMove: function (e) {

  },

  userinfo: function () {
    var that = this
    util.request(api.UserResumeUserinfo).then(function (res) {
      if (res.code == 200) {
        that.setData({
          user: res.data.user_info,
        })
      } else {
        
      }
    });
  },

  showModal: function () {
    var that = this
    var title = that.data.title
    wx.setNavigationBarTitle({
      title: title
    })
  },

  EducationList: function() {
    var that = this
    util.request(api.CommonEducation).then(function(res) {
      if (res.code == 200) {
        that.setData({
          educationdata: res.data.education
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  //请求省列表接口
  CommonProvince: function() {
    var that = this
    util.request(api.CommonProvince).then(function(res) {
      if (res.code == 200) {
        var province = res.data.province
        var id = province[[0][0]].id
        that.setData({
          provincedata: province
        })
        that.CommonCity(id)
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  TradeLists: function() {
    var that = this
    util.request(api.PostsIsCompany).then(function(res) {
      if (res.code == 200) {
        that.setData({
          trade: res.data.trade
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  // 所在城市
  cityBindChange: function(e) {
    var that = this
    let val = e.detail.value
    let id = this.data.provincedata[val[0]].id
    let province = this.data.provincedata[val[0]].name
    this.setData({
      provinceid: id,
      val: val,
    })
    that.CommonCity(id)
  },
  //请求城市列表接口
  CommonCity: function(id) {
    var that = this
    let data = {
      id: id
    }
    util.request(api.CommonCity, data).then(function(res) {
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
  City: function() {
    this.setData({
      showCity: !this.data.showCity
    });
  },
  CitySure: function() {
    this.setData({
      showCity: !this.data.showCity
    });
  },
  bindChange: function(e) {
    let val = e.detail.value
    setDate(this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]], this)
    let age = this.data.nowYear - this.data.years[val[0]] + 1
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      age: age
    })
  },
  // 学校名称
  bindSchoolInput(event) {
    let school_name = event.detail.value
    this.setData({
      school_name: school_name
    })
  },
  //学校
  School: function() {
    this.setData({
      eduExperience: !this.data.eduExperience,
      eduExperienceSchool: !this.data.eduExperienceSchool
    })
  },
  diplomaEducation: function() {
    this.setData({
      showEducation: !this.data.showEducation
    })
  },
  diploma: function() {
    this.setData({
      showEducation: !this.data.showEducation
    })
  },
  // 学历
  eduBindChange: function(e) {
    let val = e.detail.value
    this.setData({
      diploma: this.data.educationdata[val[0]].name
    })
  },
  //专业
  Major: function() {
    this.setData({
      eduExperience: !this.data.eduExperience,
      eduExperienceMajor: !this.data.eduExperienceMajor
    })
  },
  bindMajorInput(event) {
    let major = event.detail.value
    this.setData({
      major: major
    })
  },
  Enrolment: function() {
    this.setData({
      showEnrolment: !this.data.showEnrolment
    })
  },
  End: function() {
    this.setData({
      showEnd: !this.data.showEnd
    })
  },
  Experience: function() {
    this.setData({
      Experiencetext: !this.data.Experiencetext,
      eduExperience: !this.data.eduExperience
    })
  },
  bindexperienceInput(event) {
    let experience = event.detail.value
    this.setData({
      experience: experience
    })
  },
  // 教育经历开始时间
  bindEnrolmentChange: function(e) {
    let val = e.detail.value
    let start_time = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    this.setData({
      start_time: start_time
    })
  },
  bindEndChange: function(e) {
    let val = e.detail.value
    let end_time = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    this.setData({
      end_time: end_time
    })
  },
  // 教育经历确定
  releaseExperienceSure: function() {
    let school_name = this.data.school_name
    let major = this.data.major
    let diploma = this.data.diploma
    let experience = this.data.experience
    let start_time = this.data.start_time
    let end_time = this.data.end_time
    if (school_name == undefined) {
      util.showErrorToast('请填写学校名称！');
    } else if (major == undefined){
      util.showErrorToast('请填写专业！');
    } else if (diploma == undefined) {
      util.showErrorToast('请选择学历！');
    } else if (experience == undefined) {
      util.showErrorToast('请填写在校经历！');
    } else if (start_time == undefined) {
      util.showErrorToast('请选择开始时间！');
    } else if (end_time == undefined) {
      util.showErrorToast('请选择结束时间！');
    } else {
      var education = new Array({})
      var educations = this.data.education
      for (let i = 0; i < education.length; i++) {
        education[i]['school_name'] = school_name
        education[i]['major'] = major
        education[i]['diploma'] = diploma
        education[i]['experience'] = experience
        education[i]['start_time'] = start_time
        education[i]['end_time'] = end_time
      }
      for (let i = 0; i < education.length; i++) {
        educations.push(education[i])
      }
      this.setData({
        education: educations
      })
      this.setData({
        eduExperience: !this.data.eduExperience,
        release: !this.data.release
      })
    }
  },
  // 工作经历内容--开始
  releaseWork: function() {
    this.setData({
      release: !this.data.release,
      works: !this.data.works
    })
  },
  //公司名称
  companyName: function() {
    this.setData({
      works: !this.data.works,
      companyname: !this.data.companyname
    })
  },
  //工作经历公司名称
  bindCompanyInput(event) {
    let company_name = event.detail.value
    this.setData({
      company_name: company_name
    })
  },
  //所属行业
  Trade: function() {
    this.setData({
      works: !this.data.works,
      trades: !this.data.trades
    })
  },
  //搜索工作经历行业
  bindJobInput: function(e) {
    var that = this
    let duty_keywords = e.detail.value
    let data = {
      duty_keywords: duty_keywords
    }
    util.request(api.PostsIsCompany, data).then(function(res) {
      if (res.code == 200) {
        that.setData({
          dataset: res.data
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  // 工作经历行业名称
  tradeList: function(e) {
    let name = e.currentTarget.dataset.name
    let trade_id = e.currentTarget.dataset.id
    this.setData({
      trade_name: name,
      trade_id: trade_id
    })
  },
  //工作经历开始时间
  startTime: function() {
    this.setData({
      showStartTime: !this.data.showStartTime
    })
  },
  //工作经历开始时间选择
  bindStartTimeChange: function(e) {
    let val = e.detail.value
    let start_times = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    this.setData({
      start_times: start_times
    })
  },
  //工作经历结束时间
  EndTime: function() {
    this.setData({
      showEndTime: !this.data.showEndTime
    })
  },
  //工作经历结束时间选择
  bindEndTimeChange: function(e) {
    let val = e.detail.value
    let end_times = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    this.setData({
      end_times: end_times
    })
  },
  //工作经历简历职位名称显示
  workName: function() {
    this.setData({
      works: !this.data.works,
      WorkName: !this.data.WorkName
    })
  },
  //工作经历简历职位名称名称
  bindWorNameInput(event) {
    let work_name = event.detail.value
    this.setData({
      work_name: work_name
    })
  },
  //工作经历工作内容显示
  workContent: function() {
    this.setData({
      works: !this.data.works,
      WorkContent: !this.data.WorkContent
    })
  },
  //工作经历工作内容
  bindWorkContentInput(event) {
    let work_content = event.detail.value
    this.setData({
      work_content: work_content
    })
  },
  // 工作内容数组确定按钮--结束
  releaseWorkContent: function() {
    let company_name = this.data.company_name
    let trade_id = this.data.trade_id
    let start_time = this.data.start_times
    let end_time = this.data.end_times
    let work_name = this.data.work_name
    let work_content = this.data.work_content
    if (company_name == undefined) {
      util.showErrorToast('请填写公司名称！');
    } else if (trade_id == undefined){
      util.showErrorToast('请选择行业！');
    } else if (start_time == undefined) {
      util.showErrorToast('请选择开始时间！');
    } else if (end_time == undefined) {
      util.showErrorToast('请选择结束时间！');
    } else if (work_name == undefined) {
      util.showErrorToast('请填写工作名称!');
    } else if (work_content == undefined) {
      util.showErrorToast('请填写工作内容!');
    } else {
      var work = new Array({})
      var works = this.data.work
      for (let i = 0; i < work.length; i++) {
        work[i]['company_name'] = company_name
        work[i]['trade_id'] = trade_id
        work[i]['start_time'] = start_time
        work[i]['end_time'] = end_time
        work[i]['work_name'] = work_name
        work[i]['work_content'] = work_content
      }
      for (let i = 0; i < work.length; i++) {
        works.push(work[i])
      }
      this.setData({
        work: works,
        release: !this.data.release,
        works: !this.data.works
      })
    }
  },
  // 项目经验--开始
  releaseProject: function() {
    this.setData({
      release: !this.data.release,
      projectExperience: !this.data.projectExperience
    })
  },
  // 项目经验项目名称
  projectName: function() {
    this.setData({
      ProjectName: !this.data.ProjectName,
      projectExperience: !this.data.projectExperience
    })
  },
  // 项目经验项目名称值
  bindProjectNameInput(event) {
    let project_name = event.detail.value
    this.setData({
      project_name: project_name
    })
  },
  // 项目经验担任角色
  projectRole: function() {
    this.setData({
      ProjectRole: !this.data.ProjectRole,
      projectExperience: !this.data.projectExperience
    })
  },
  // 项目经验担任角色值
  bindProjectRoleInput(event) {
    let project_role = event.detail.value
    this.setData({
      project_role: project_role
    })
  },
  //项目经验开始时间
  ProjectStartTime: function() {
    this.setData({
      showStartProject: !this.data.showStartProject
    })
  },
  //项目经验开始时间选择
  bindStartProjectChange: function(e) {
    let val = e.detail.value
    let start_timesp = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    this.setData({
      start_timesp: start_timesp
    })
  },
  //项目经验结束时间
  ProjectEndTime: function() {
    this.setData({
      showProjectEndTime: !this.data.showProjectEndTime
    })
  },
  //项目经验结束时间选择
  bindEndProjectChange: function(e) {
    let val = e.detail.value
    let end_timesp = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    this.setData({
      end_timesp: end_timesp
    })
  },
  // 项目描述
  projectDescription: function() {
    this.setData({
      projectExperience: !this.data.projectExperience,
      ProjectDescription: !this.data.ProjectDescription
    })
  },
  // 项目描述内容
  bindProjectDescriptionInput(event) {
    let project_description = event.detail.value
    this.setData({
      project_description: project_description
    })
  },
  // 项目经验数组内容
  releaseProjectContent: function() {
    let project_name = this.data.project_name
    let project_role = this.data.project_role
    let start_time = this.data.start_timesp
    let end_time = this.data.end_timesp
    let project_description = this.data.project_description
    if (project_name == undefined) {
      util.showErrorToast('请填写项目名称！');
    } else if (project_role == undefined){
      util.showErrorToast('请填写项目角色！');
    } else if (start_time == undefined) {
      util.showErrorToast('请选择开始时间!');
    } else if (end_time == undefined) {
      util.showErrorToast('请选择结束时间！');
    } else if (project_description == undefined) {
      util.showErrorToast('请填写项目描述！');
    } else {
      var project = new Array({})
      var projects = this.data.project
      for (let i = 0; i < project.length; i++) {
        project[i]['project_name'] = project_name
        project[i]['project_role'] = project_role
        project[i]['start_time'] = start_time
        project[i]['end_time'] = end_time
        project[i]['project_description'] = project_description
      }
      for (let i = 0; i < project.length; i++) {
        projects.push(project[i])
      }
      this.setData({
        project: projects,
        release: !this.data.release,
        projectExperience: !this.data.projectExperience
      })
    }
  },
  // 项目经验结束
  // 语言能力开始
  releaseLanguage: function() {
    this.setData({
      release: !this.data.release,
      Language: !this.data.Language
    })
  },
  // 语言能力内容
  bindLanguageInput(event) {
    let language_name = event.detail.value
    this.setData({
      language_name: language_name
    })
  },
  releaseLanguageSure: function() {
    let language_name = this.data.language_name
    if (language_name == undefined){
      util.showErrorToast('请填写语言能力名称！');
    } else{
      var language = new Array({})
      var languages = this.data.language
      for (let i = 0; i < language.length; i++) {
        language[i]['language_name'] = language_name
      }
      for (let i = 0; i < language.length; i++) {
        languages.push(language[i])
      }
      this.setData({
        language: languages,
        release: !this.data.release,
        Language: !this.data.Language
      })
    }
  },
  // 技能证书开始
  releaseSkill: function() {
    this.setData({
      release: !this.data.release,
      Skill: !this.data.Skill
    })
  },
  bindSkillInput(event) {
    let skill_name = event.detail.value
    this.setData({
      skill_name: skill_name
    })
  },
  releaseSkillSure: function() {
    let skill_name = this.data.skill_name
    if (skill_name == undefined) {
      util.showErrorToast('请填写技能证书名称！');
    } else{
      var skill = new Array({})
      var skills = this.data.skill
      for (let i = 0; i < skill.length; i++) {
        skill[i]['skill_name'] = skill_name
      }
      for (let i = 0; i < skill.length; i++) {
        skills.push(skill[i])
      }
      this.setData({
        skill: skills,
        release: !this.data.release,
        Skill: !this.data.Skill
      })
    }
  },
  // 自我介绍
  resumeDescription: function() {
    this.setData({
      release: !this.data.release,
      ResumedDescription: !this.data.ResumedDescription
    })
  },
  bindResumedDescriptionInput(event) {
    let resume_description = event.detail.value
    this.setData({
      resume_description: resume_description
    })
  },
  salaryBindChange: function(e) {
    let val = e.detail.value
    let min_salary = this.data.startSalary[val[0]]
    let max_salary = this.data.endSalary[val[1]]
    if (parseInt(min_salary) <= parseInt(max_salary)) {
      this.setData({
        min_salary: min_salary,
        max_salary: max_salary
      })
    } else {
      util.showErrorToast('请选择正确范围！');
    }
  },
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  toggleWorking: function() {
    this.setData({
      showWorking: !this.data.showWorking
    });
  },
  toggleJob: function() {
    this.setData({
      showJob: !this.data.showJob
    });
  },
  Salary: function() {
    this.setData({
      showSalary: !this.data.showSalary
    });
  },
  SalarySure: function() {
    this.setData({
      showSalary: !this.data.showSalary
    });
  },

  albumchooseimage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function(res) {
        that.setData({
          tempFilePaths: res.tempFilePaths,
          openCamera: !that.data.openCamera,
          files: res.tempFilePaths
        });
        that.upload(res);
      }
    })
  },
  camerachooseimage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function(res) {
        that.setData({
          tempFilePaths: res.tempFilePaths,
          openCamera: !that.data.openCamera,
          files: res.tempFilePaths
        });
        that.upload(res);
      }
    })
  },
  userInfochooseimage: function() {
    var that = this
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      avatar_logo: userInfo.avatarUrl,
      openCamera: !this.data.openCamera
    })
    wx.uploadFile({
      url: api.Uploads,
      filePath: userInfo.avatarUrl[0],
      name: 'image',
      formData: {
        'user': 'test'
      },
      success(res) {
        const data = res.data
      },
      fail: function(e) {
        wx.showModal({
          title: '错误',
          content: '上传失败',
          showCancel: false
        })
      }
    })
    const uploadTask = wx.uploadFile({
      url: api.Uploads,
      filePath: userInfo.avatarUrl[0],
      name: 'image',
      success: function(res) {
        var _res = JSON.parse(res.data);
        if (_res.code === 200) {
          var image = _res.data.image
          that.setData({
            hasPicture: true,
            avatar_logo: image
          })
        }
      },
      fail: function(e) {
        wx.showModal({
          title: '错误',
          content: '上传失败',
          showCancel: false
        })
      },
    })
  },
  upload: function(res) {
    var that = this;
    const uploadTask = wx.uploadFile({
      url: api.Uploads,
      filePath: res.tempFilePaths[0],
      name: 'image',
      success: function(res) {
        var _res = JSON.parse(res.data);
        if (_res.code === 200) {
          var image = _res.data.image
          that.setData({
            hasPicture: true,
            avatar_logo: image
          })
        }
      },
      fail: function(e) {
        wx.showModal({
          title: '错误',
          content: '上传失败',
          showCancel: false
        })
      },
    })
  },

  release: function() {
    this.setData({
      openCamera: !this.data.openCamera
    })
  },

  releasePersonal: function() {
    wx.navigateTo({
      url: '/pages/resume_user_info/resume_user_info',
    })
  },

  // 意向职位显示页
  releaseJob: function() {
    this.setData({
      expectation: !this.data.expectation,
      release: !this.data.release,
    })
  },
  releaseJobSure: function() {
    let duty_name = this.data.duty_name
    let city = this.data.city
    let min_salary = this.data.min_salary
    let max_salary = this.data.max_salary
    if (duty_name == undefined){
      util.showErrorToast('请填写意向职位！');
    } else if (city == undefined){
      util.showErrorToast('请选择工作城市！');
    } else if (min_salary == undefined || max_salary == undefined ){
      util.showErrorToast('请选择期望薪资！');
    } else{
      this.setData({
        expectation: !this.data.expectation,
        release: !this.data.release,
      })
    }
  },
  // 意向职位
  IntentionalPosition: function() {
    this.setData({
      position: !this.data.position,
      expectation: !this.data.expectation
    })
  },
  // 意向职位输入
  bindPositionInput(event) {
    let duty_name = event.detail.value
    this.setData({
      duty_name: duty_name
    })
  },
  //意向职位工作城市
  workCity: function() {
    this.setData({
      showWorkCity: !this.data.showWorkCity
    });
  },
  //确定初始工作城市数据
  workCitySure: function() {
    this.setData({
      showWorkCity: !this.data.showWorkCity
    })
  },

  //教育经历
  releaseExperience: function() {
    this.setData({
      eduExperience: !this.data.eduExperience,
      release: !this.data.release
    })
  },

  jobList: function(e) {
    let idx = e.currentTarget.dataset.idx
    this.setData({
      idx: idx
    })
  },

  personalName: function() {
    this.setData({
      name: !this.data.name,
      personal: !this.data.personal
    })
  },

  personalEmail: function() {
    this.setData({
      email: !this.data.email,
      personal: !this.data.personal
    })
  },

  personalPhone: function() {
    this.setData({
      phone: !this.data.phone,
      personal: !this.data.personal
    })
  },

  radioChange: function(e) {
    
  },

  bindNameInput: function(e) {
    let name = e.detail.value
    this.setData({
      nameInput: name
    })
  },


  //编辑教育经历
  editEducation: function (e) {
    let idx = e.target.dataset.index;
    this.setData({
      release: !this.data.release,
      eduExperience: !this.data.eduExperience
    })
    this.data.education[idx].school_name = '0';
    this.setData({
      education: this.data.education
    });
  },
  // 预览
  formReset: function () {
    var that = this
    var user = that.data.user
    let resume = {
      duty_name: that.data.duty_name,
      city: that.data.city,
      province: that.data.province,
      min_salary: that.data.min_salary,
      max_salary: that.data.max_salary,
      resume_description: that.data.resume_description,
      educations: that.data.education,
      works: that.data.work,
      projects: that.data.project,
      language: that.data.language,
      skill: that.data.skill,
      user: user
    }
    that.setData({
      resume: !this.data.resume,
      release: !this.data.release,
      resume: resume
    })
  },
  //返回
  Return: function () {
    this.setData({
      resume: !this.data.resume,
      release: !this.data.release
    })
  },
  // 个人信息提交
  resumeUserInfo: function() {
    var that = this
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
    util.request(api.ResumeUserInfo, data, 'POST').then(function(res) {
      if (res.code == 200) {
        that.setData({
          dataset: res.data
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  // 发布简历
  formSubmit: function() {
    var that = this
    let data = {
      duty_name: that.data.duty_name,
      city: that.data.city,
      province: that.data.province,
      min_salary: that.data.min_salary,
      max_salary: that.data.max_salary,
      resume_description: that.data.resume_description,
      education: that.data.education,
      work: that.data.work,
      project: that.data.project,
      language: that.data.language,
      skill: that.data.skill
    }
    util.request(api.ResumeSubmit, data, 'POST').then(function(res) {
      if (res.code == 200) {
        util.showToast(res.msg);
        that.setData({
          dataset: res.data
        })
        wx.navigateTo({
          url: '/pages/ucenter/resume/resume',
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