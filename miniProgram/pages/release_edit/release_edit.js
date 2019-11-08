// pages/release_edit/release_edit.js
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
    title: '',
    personalTitle: '个人信息',
    jobTitle: '意向职位',
    sex: '1',
    cancel: '/images/cancel.png',
    determine: '/images/determine.png',
    tempFilePaths: '/images/defaultAvatar.png',
    edit: '/images/edit.png',
    right: '/images/right.png',
    working: ['0', '1', '2', '3', '4', '5'],
    job: ['应届毕业生', '离职-立即到岗', '在职-尽快到岗', '在职-考虑机会', '在职-暂不考虑'],
    jobList: ['运营', '金融', '设计', '物流', '市场', '市场'],
    startSalary: ['4', '5', '6', '7', '8'],
    endSalary: ['4', '5', '6', '7', '8'],
    education: [],
    work: [],
    project: [],
    language: [],
    skill: [],
    val: [],
    resume_description: '',
  },
  onLoad: function (options) {
    this.setData({
      resume_id: options.resume_id,
      title: options.title
    })
    setDate(this.data.year, this.data.month, this.data.day, this)
    let nowYear = date.getFullYear()
    this.setData({
      nowYear: nowYear
    })
  },

  onReady: function () {

  },

  onShow: function () {
    this.userResumeDetail()// 简历编辑详情
    this.CommonProvince() //请求省列表接口
    this.EducationList()
    this.TradeLists() //行业接口
    this.showModal()
  },

  preventTouchMove: function (e) {

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

  // 简历编辑详情跟简历个人信息接口
  userResumeDetail: function () {
    var that = this
    let data= {
      resume_id: that.data.resume_id
    }
    util.request(api.UserResumeDetail,data).then(function (res) {
      if (res.code == 200) {
        that.setData({
          resume: res.data.resume,
          education: res.data.resume.educations,
          work: res.data.resume.works,
          project: res.data.resume.projects,
          language: res.data.resume.language,
          skill: res.data.resume.skill,
          duty_name: res.data.resume.duty_name,
          province: res.data.resume.province,
          city: res.data.resume.city,
          min_salary: res.data.resume.min_salary,
          max_salary: res.data.resume.min_salary,
          resume_description: res.data.resume.resume_description
        })
        console.log(res.data.resume)
      } else {
        util.showErrorToast(res.msg);
      }
    });
    //个人信息
    util.request(api.UserResumeUserinfo, data).then(function (res) {
      if (res.code == 200) {
        console.log(res.data.user_info)
        that.setData({
          user: res.data.user_info
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
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
        that.CommonCity(id)
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  TradeLists: function () {
    var that = this
    util.request(api.PostsIsCompany).then(function (res) {
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
  cityBindChange: function (e) {
    var that = this
    let val = e.detail.value
    let id = this.data.provincedata[val[0]].id
    let province = this.data.provincedata[val[0]].name
    this.setData({
      provinceid: id,
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
    console.log(age)
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
  School: function () {
    this.setData({
      eduExperience: !this.data.eduExperience,
      eduExperienceSchool: !this.data.eduExperienceSchool
    })
  },
  diplomaEducation: function () {
    this.setData({
      showEducation: !this.data.showEducation
    })
  },
  diploma: function () {
    this.setData({
      showEducation: !this.data.showEducation
    })
  },
  // 学历
  eduBindChange: function (e) {
    let val = e.detail.value
    console.log(this.data.educationdata[val[0]])
    this.setData({
      diploma: this.data.educationdata[val[0]].name
    })
  },
  //专业
  Major: function () {
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
  Enrolment: function () {
    this.setData({
      showEnrolment: !this.data.showEnrolment
    })
  },
  End: function () {
    this.setData({
      showEnd: !this.data.showEnd
    })
  },
  Experience: function () {
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
  bindEnrolmentChange: function (e) {
    let val = e.detail.value
    let start_time = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    this.setData({
      start_time: start_time
    })
  },
  bindEndChange: function (e) {
    let val = e.detail.value
    let end_time = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    console.log(end_time)
    this.setData({
      end_time: end_time
    })
  },
  //公司名称
  companyName: function () {
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
  Trade: function () {
    this.setData({
      works: !this.data.works,
      trades: !this.data.trades
    })
  },
  //搜索工作经历行业
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
  // 工作经历行业名称
  tradeList: function (e) {
    let name = e.currentTarget.dataset.name
    let trade_id = e.currentTarget.dataset.id
    this.setData({
      trade_name: name,
      trade_id: trade_id
    })
  },
  //工作经历开始时间
  startTime: function () {
    this.setData({
      showStartTime: !this.data.showStartTime
    })
  },
  //工作经历开始时间选择
  bindStartTimeChange: function (e) {
    let val = e.detail.value
    let start_times = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    this.setData({
      start_times: start_times
    })
  },
  //工作经历结束时间
  EndTime: function () {
    this.setData({
      showEndTime: !this.data.showEndTime
    })
  },
  //工作经历结束时间选择
  bindEndTimeChange: function (e) {
    console.log(e)
    let val = e.detail.value
    let end_times = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    console.log(end_times)
    this.setData({
      end_times: end_times
    })
  },
  //工作经历简历职位名称显示
  workName: function () {
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
  workContent: function () {
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
  
  
  // 项目经验项目名称
  projectName: function () {
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
  projectRole: function () {
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
  ProjectStartTime: function () {
    this.setData({
      showStartProject: !this.data.showStartProject
    })
  },
  //项目经验开始时间选择
  bindStartProjectChange: function (e) {
    let val = e.detail.value
    let start_timesp = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    this.setData({
      start_timesp: start_timesp
    })
  },
  //项目经验结束时间
  ProjectEndTime: function () {
    this.setData({
      showProjectEndTime: !this.data.showProjectEndTime
    })
  },
  //项目经验结束时间选择
  bindEndProjectChange: function (e) {
    let val = e.detail.value
    let end_timesp = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    this.setData({
      end_timesp: end_timesp
    })
  },
  // 项目描述
  projectDescription: function () {
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
  
  // 项目经验结束
  bindSkillInput(event) {
    let skill_name = event.detail.value
    this.setData({
      skill_name: skill_name
    })
  },
  releaseSkillSure: function () {
    let skill_name = this.data.skill_name
    if (skill_name == undefined) {
      util.showErrorToast('请填写技能证书名称！');
    } else {
      var skill = new Array({})
      var skills = this.data.skill
      for (let i = 0; i < skill.length; i++) {
        skill[i]['skill_name'] = skill_name
      }
      console.log(skill)
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
  resumeDescription: function () {
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
  salaryBindChange: function (e) {
    let val = e.detail.value
    let min_salary = this.data.startSalary[val[0]]
    let max_salary = this.data.endSalary[val[1]]
    if (min_salary <= max_salary) {
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
  toggleWorking: function () {
    this.setData({
      showWorking: !this.data.showWorking
    });
  },
  toggleJob: function () {
    this.setData({
      showJob: !this.data.showJob
    });
  },
  Salary: function () {
    this.setData({
      showSalary: !this.data.showSalary
    });
  },
  SalarySure: function () {
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
    const uploadTask = wx.uploadFile({
      url: api.Uploads,
      filePath: userInfo.avatarUrl[0],
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

  releasePersonal: function (e) {
    let resume_id = e.currentTarget.dataset.resume_id
    wx.navigateTo({
      url: '/pages/resume_userinfo/resume_userinfo?resume_id=' + resume_id,
    })
  },

  // 意向职位显示页
  releaseJob: function () {
    this.setData({
      expectation: !this.data.expectation,
      release: !this.data.release,
    })
  },
  
  // 意向职位
  IntentionalPosition: function () {
    this.setData({
      position: !this.data.position,
      expectation: !this.data.expectation
    })
  },
  // 意向职位输入
  bindPositionInput(event) {
    console.log(event.detail.value)
    let duty_name = event.detail.value
    this.setData({
      duty_name: duty_name
    })
  },
  //意向职位工作城市
  workCity: function () {
    this.setData({
      showWorkCity: !this.data.showWorkCity
    });
  },
  //确定初始工作城市数据
  workCitySure: function () {
    this.setData({
      showWorkCity: !this.data.showWorkCity
    })
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
  bindNameInput: function (e) {
    let name = e.detail.value
    this.setData({
      nameInput: name
    })
  },
  //教育经历
  releaseExperience: function () {
    this.setData({
      eduExperience: !this.data.eduExperience,
      release: !this.data.release,
      eduindex: '',
      school_name: '',
      major: '',
      diploma: '',
      experience: '',
      start_time: '',
      end_time: '',
    })
  },
  //编辑教育经历
  editEducation: function (e) {
    let eduindex = e.currentTarget.dataset.index;
    this.setData({
      release: !this.data.release,
      eduExperience: !this.data.eduExperience,
      eduindex: eduindex,
      school_name: this.data.education[eduindex].school_name,
      major: this.data.education[eduindex].major,
      diploma: this.data.education[eduindex].diploma,
      experience: this.data.education[eduindex].experience,
      start_time: this.data.education[eduindex].start_time,
      end_time: this.data.education[eduindex].end_time,
    })
  },
  // 编辑修改教育经历 
  editreleaseExperience: function (e) {
    console.log(e)
    let eduindex = this.data.eduindex;
    console.log(this.data.education[eduindex].school_name)
    let school_name = this.data.school_name
    let major = this.data.major
    let diploma = this.data.diploma
    let experience = this.data.experience
    let start_time = this.data.start_time
    let end_time = this.data.end_time
    if (school_name){
      this.data.education[eduindex].school_name = school_name;
    }
    if (major){
      this.data.education[eduindex].major = major;
    }
    if (diploma) {
      this.data.education[eduindex].diploma = diploma;
    }
    if (experience) {
      this.data.education[eduindex].experience = experience;
    }
    if (start_time) {
      this.data.education[eduindex].start_time = start_time;
    }
    if (end_time) {
      this.data.education[eduindex].end_time = end_time;
    }
    this.setData({
      release: !this.data.release,
      eduExperience: !this.data.eduExperience,
      education: this.data.education
    });
    console.log(this.data.education)
  },
  // 意向职位确定编辑求职期望
  releaseJobSure: function () {
    var that = this
    this.setData({
      expectation: !this.data.expectation,
      release: !this.data.release,
    })
    that.data.resume.duty_name = that.data.duty_name
    that.data.resume.city = that.data.city
    that.data.resume.max_salary = that.data.max_salary
    that.data.resume.min_salary = that.data.min_salary
    console.log("编辑后的数据", that.data.resume)
    this.setData({
      resume: that.data.resume
    })
  },
  // 教育经历确定
  releaseExperienceSure: function () {
    let school_name = this.data.school_name
    let major = this.data.major
    let diploma = this.data.diploma
    let experience = this.data.experience
    let start_time = this.data.start_time
    let end_time = this.data.end_time
    if (!school_name) {
      util.showErrorToast('请填写学校名称！');
    } else if (!major) {
      util.showErrorToast('请填写专业！');
    } else if (!diploma) {
      util.showErrorToast('请选择学历！');
    } else if (!experience) {
      util.showErrorToast('请填写在校经历！');
    } else if (!start_time) {
      util.showErrorToast('请选择开始时间！');
    } else if (!end_time) {
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
        education: educations,
        eduExperience: !this.data.eduExperience,
        release: !this.data.release
      })
    }
  },
  // 工作经历内容--开始
  editWork: function (e) {
    var windex = e.currentTarget.dataset.index;
    this.setData({
      release: !this.data.release,
      works: !this.data.works,
      windex: windex,
      company_name: this.data.work[windex].company_name,
      trade_id: this.data.work[windex].trade_id,
      trade_name: this.data.work[windex].trade_name,
      title: this.data.work[windex].title,
      start_time: this.data.work[windex].start_time,
      end_time: this.data.work[windex].end_time,
      work_name: this.data.work[windex].work_name,
      work_content: this.data.work[windex].work_content
    })
  },
  releaseWork: function () {
    this.setData({
      release: !this.data.release,
      works: !this.data.works,
      windex: 'index',
      company_name: '',
      trade_id: '',
      title: '',
      start_time:'',
      end_time: '',
      work_name: '',
      work_content: ''
    })
  },
  editreleaseWorkContent: function () {
    var that = this
    let windex = that.data.windex
    let company_name = this.data.company_name
    let trade_id = this.data.trade_id
    let title = this.data.title
    let start_time = this.data.start_time
    let end_time = this.data.end_time
    let work_name = this.data.work_name
    let work_content = this.data.work_content
    console.log(this.data.work)
    if (company_name) {
      this.data.work[windex].company_name = company_name;
    }
    if (trade_id) {
      this.data.work[windex].trade_id = trade_id;
    }
    if (title) {
      this.data.work[windex].diploma = title;
    }
    if (start_time) {
      this.data.work[windex].start_time = start_time;
    }
    if (end_time) {
      this.data.work[windex].end_time = end_time;
    }
    if (work_name) {
      this.data.work[windex].end_time = work_name;
    }
    if (work_content) {
      this.data.work[windex].work_content = work_content;
    }
    this.setData({
      work: that.data.work,
      release: !this.data.release,
      works: !this.data.works
    })
  },
  // 工作内容数组确定按钮--结束
  releaseWorkContent: function () {
    let company_name = this.data.company_name
    let trade_id = this.data.trade_id
    let start_time = this.data.start_times
    let end_time = this.data.end_times
    let work_name = this.data.work_name
    let work_content = this.data.work_content
    if (!company_name) {
      util.showErrorToast('请填写公司名称！');
    } else if (!trade_id) {
      util.showErrorToast('请选择行业！');
    } else if (!start_time) {
      util.showErrorToast('请选择开始时间！');
    } else if (!end_time) {
      util.showErrorToast('请选择结束时间！');
    } else if (!work_name) {
      util.showErrorToast('请填写工作名称!');
    } else if (!work_content) {
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
      console.log(work)
      for (let i = 0; i < work.length; i++) {
        works.push(work[i])
      }
      console.log(works)
      this.setData({
        work: works,
        release: !this.data.release,
        works: !this.data.works
      })
      console.log('数据', works)
    }
  },
  // 编辑项目经验--开始
  releaseProject: function () {
    this.setData({
      release: !this.data.release,
      projectExperience: !this.data.projectExperience,
      rindex: 'rindex',
    })
    console.log(this.data.project)
  },
  editProject: function (e) {
    let rindex = e.currentTarget.dataset.index;
    this.setData({
      rindex: rindex,
      project_name: this.data.project[rindex].project_name,
      project_role: this.data.project[rindex].project_role,
      start_time: this.data.project[rindex].start_time,
      end_time: this.data.project[rindex].end_time,
      project_description: this.data.project[rindex].project_description,
      release: !this.data.release,
      projectExperience: !this.data.projectExperience,
    })
  },
  editReleaseProjectContent: function () {
    let rindex = this.data.rindex
    let project_name = this.data.project_name
    let project_role = this.data.project_role
    let start_time = this.data.start_time
    let end_time = this.data.end_time
    let project_description = this.data.project_description
    if (project_name) {
      this.data.project[rindex].project_name = project_name;
    }
    if (project_role) {
      this.data.project[rindex].project_role = project_role;
    }
    if (start_time) {
      this.data.project[rindex].start_time = start_time;
    }
    if (end_time) {
      this.data.project[rindex].end_time = end_time;
    }
    if (project_description) {
      this.data.project[rindex].project_description = project_description;
    }
    this.setData({
      project: this.data.project,
      release: !this.data.release,
      projectExperience: !this.data.projectExperience,
    })
  },
  // 项目经验数组内容
  releaseProjectContent: function () {
    let project_name = this.data.project_name
    let project_role = this.data.project_role
    let start_time = this.data.start_timesp
    let end_time = this.data.end_timesp
    let project_description = this.data.project_description
    if (project_name == undefined) {
      util.showErrorToast('请填写项目名称！');
    } else if (project_role == undefined) {
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
      console.log(project)
      for (let i = 0; i < project.length; i++) {
        projects.push(project[i])
      }
      console.log(projects)
      this.setData({
        project: projects,
        release: !this.data.release,
        projectExperience: !this.data.projectExperience
      })
      console.log('数据', projects)
    }
  },
  // 语言能力
  editLanguage: function (e) {
    let lindex = e.currentTarget.dataset.index;
    this.setData({
      release: !this.data.release,
      Language: !this.data.Language,
      lindex: lindex,
      language_name: this.data.language[lindex].language_name
    })
  },
  // 语言能力开始
  releaseLanguage: function () {
    this.setData({
      release: !this.data.release,
      Language: !this.data.Language,
      lindex: 'lindex',
      language_name: ''
    })
  },
  editreleaseLanguageSure: function (){
    let lindex = this.data.lindex
    this.data.language[lindex].language_name = this.data.language_name
    console.log(this.data.language)
    this.setData({
      language: this.data.language,
      release: !this.data.release,
      Language: !this.data.Language,
    })
  },
  // 语言能力内容
  bindLanguageInput(event) {
    let language_name = event.detail.value
    this.setData({
      language_name: language_name
    })
  },
  //技能证书
  editSkill: function (e) {
    let eindex = e.currentTarget.dataset.index;
    this.setData({
      eindex: eindex,
      skill_name: this.data.skill[eindex].skill_name,
      release: !this.data.release,
      Skill: !this.data.Skill
    })
  },
  // 技能证书开始
  releaseSkill: function () {
    this.setData({
      release: !this.data.release,
      Skill: !this.data.Skill
    })
  },
  releaseLanguageSure: function () {
    let language_name = this.data.language_name
    if (language_name == undefined) {
      util.showErrorToast('请填写语言能力名称！');
    } else {
      var language = new Array({})
      var languages = this.data.language
      for (let i = 0; i < language.length; i++) {
        language[i]['language_name'] = language_name
      }
      console.log(language)
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
  editJob: function () {
    var that = this
    this.setData({
      expectation: !this.data.expectation,
      release: !this.data.release,
    })
  },
  formSubmit: function (e) {
    var that = this
    let resume = that.data.resume
    let resume_id = e.currentTarget.dataset.resume_id
    that.data.resume.duty_name = that.data.duty_name
    that.data.resume.city = that.data.city
    that.data.resume.province = that.data.province
    that.data.resume.min_salary = that.data.min_salary
    that.data.resume.max_salary = that.data.max_salary
    that.data.resume.resume_description = that.data.resume_description
    that.data.resume.educations = that.data.education
    that.data.resume.works = that.data.work
    that.data.resume.projects = that.data.project
    that.data.resume.language = that.data.language
    that.data.resume.skill = that.data.skill
    that.data.resume.resume_id = that.data.resume_id
    console.log(that.data.education)
    console.log('修改数据', resume)
    let data = {
      duty_name: resume.duty_name,
      city: resume.city,
      province: resume.province,
      min_salary: resume.min_salary,
      max_salary: resume.max_salary,
      resume_description: resume.resume_description,
      education: resume.educations,
      work: resume.works,
      project: resume.projects,
      language: resume.language,
      skill: resume.skill,
      resume_id: resume_id
    }
    util.request(api.UserResumeUpdate, data, 'POST').then(function (res) {
      if (res.code == 200) {
        console.log(res)
        util.showToast(res.msg);
        that.userResumeDetail()
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})