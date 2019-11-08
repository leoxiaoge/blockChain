// pages/college/college.js
// 引入SDK核心类
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    itemData: '',
    navItem: ['企业职位', '学员简历'],
    showItem: '1',
    hidden: false,
    page: 1,
    reach: true,
    posts: [],
    lists: [],
    cancel: '/images/cancel.png',
    determine: '/images/determine.png',
    val: [0, 0],
    salary: [{
        id: '0',
        min_salary: '0',
        max_salary: '999',
        name: '全部'
      },
      {
        id: '1',
        min_salary: '0',
        max_salary: '3',
        name: '3K以下'
      },
      {
        id: '2',
        min_salary: '3',
        max_salary: '5',
        name: '3K-5K'
      },
      {
        id: '3',
        min_salary: '5',
        max_salary: '10',
        name: '5K-10K'
      },
      {
        id: '4',
        min_salary: '10',
        max_salary: '20',
        name: '10K-20K'
      },
      {
        id: '5',
        min_salary: '20',
        max_salary: '50',
        name: '20K-50K'
      },
      {
        id: '6',
        min_salary: '50',
        max_salary: '999',
        name: '50K以上'
      }
    ],

    keywords: '',
    eduid: '',
    expid: '',
    min_salary: '',
    max_salary: ''
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载服务中...',
    });
  },

  onReady: function() {

  },

  onShow: function() {
    this.getLocation()
    this.postsList()
    this.CommonProvince() //请求省列表接口
  },

  preventTouchMove: function (e) {
    
  },

  //请求省列表接口
  CommonProvince: function () {
    var that = this
    util.request(api.CommonProvince).then(function (res) {
      if (res.code == 200) {
        var province = res.data.province
        var val = that.data.val
        var id = province[val[0]].id
        that.setData({
          provincedata: province
        })
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
        var city = res.data.city
        that.setData({
          citydata: city
        })
        var val = that.data.val
        if (that.data.citydata[val[1]].name) {
          var cityname = that.data.citydata[val[1]].name
          var province = that.data.provincedata[val[0]].name
          that.setData({
            citys: cityname,
            province: province,
            val: val
          })
        }
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  //城市
  workCity: function () {
    this.setData({
      showWorkCity: !this.data.showWorkCity,
      city: this.data.city
    });
  },

  workCitySure: function () {
    var that = this
    this.setData({
      showWorkCity: !this.data.showWorkCity,
      city: this.data.citys,
      page: 1,
      reach: true,
      posts: [],
      lists: [],
      none: false
    });
    if (that.data.showItem == 1) {
      that.postsList()
    } else if (that.data.showItem == 2) {
      that.resumeList()
    }
  },

  // 所在城市
  cityBindChange: function (e) {
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

  getLocation: function() {
    var that = this;
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'JMYBZ-SA7WP-NFNDJ-VCPDB-IGOXQ-XDFIR' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {
            //获取地址
            var address_arr = addressRes.result.ad_info;
            // console.log(address_arr)
            wx.setStorageSync('address_arr', address_arr);
            that.setData({
              city: address_arr.city
            })
          }
        })
      }
    })
  },

  navToggle: function (e) {
    var that = this;
    wx.showNavigationBarLoading();
    that.setData({
      showItem: e.target.dataset.id + 1,
      page: 1,
      reach: true,
      posts: [],
      lists: [],
      none: false
    });
    if (e.target.dataset.id == 0) {
      that.postsList()
    } else if (e.target.dataset.id == 1) {
      that.resumeList()
    }
  },
  // 重置筛选
  postsReset: function () {
    let eduid = ''
    let expid = ''
    let salid = ''
    let min_salary = ''
    let max_salary = ''
    this.setData({
      eduid: eduid,
      expid: expid,
      salid: salid,
      min_salary: min_salary,
      max_salary: max_salary,
      page: 1,
      reach: true,
      posts: [],
      lists: []
    })
  },
  postsSubmit: function () {
    var that = this
    that.setData({
      hidden: !that.data.hidden,
      page: 1,
      reach: true,
      posts: [],
      lists: []
    })
    if (that.data.showItem == 1) {
      that.postsList()
    } else if (that.data.showItem == 2) {
      that.resumeList()
    }
  },

  //职位列表
  postsList: function() {
    var that = this
    var page = that.data.page
    if (that.data.city == undefined){
      var city = wx.getStorageSync('address_arr').city
    } else {
      var city = that.data.city
    }
    let data = {
      keywords: that.data.keywords,
      education: that.data.eduid,
      experience: that.data.expid,
      min_salary: that.data.min_salary,
      max_salary: that.data.max_salary,
      city: city,
      page: page
    }
    let reach = that.data.reach
    if (reach) {
      util.request(api.PostsLists, data).then(function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        if (res.code == 200) {
          var post = that.data.posts
          for (var i = 0; i < res.data.posts.data.length; i++) {
            post.push(res.data.posts.data[i])
          }
          that.setData({
            posts: post,
            educations: res.data.education,
            experiences: res.data.experience,
            none: true
          })
          if (res.data.posts.current_page < res.data.posts.last_page) {
            that.setData({
              page: page + 1
            })
          } else {
            that.setData({
              page: page,
              reach: false
            })
          }
        } else {
          util.showErrorToast(res.msg);
        }
      });
    }
  },

  //简历列表
  resumeList: function () {
    var that = this
    var page = that.data.page
    if (that.data.city == undefined) {
      var city = wx.getStorageSync('address_arr').city
    } else {
      var city = that.data.city
    }
    let data = {
      keywords: that.data.keywords,
      education: that.data.eduid,
      experience: that.data.expid,
      min_salary: that.data.min_salary,
      max_salary: that.data.max_salary,
      city: city,
      page: page
    }
    let reach = that.data.reach
    if (reach) {
      util.request(api.ResumeLists, data).then(function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        if (res.code == 200) {
          var list = that.data.lists
          for (var i = 0; i < res.data.lists.data.length; i++) {
            if (res.data.lists.data[i].status == 1) {
              res.data.lists.data[i].user.real_name = res.data.lists.data[i].user.real_name.substr(0, 1) + "**"
            }
            list.push(res.data.lists.data[i])
          }
          that.setData({
            lists: list,
            none: true
          })
          if (res.data.lists.current_page < res.data.lists.last_page) {
            that.setData({
              page: page + 1
            })
          } else {
            that.setData({
              page: page,
              reach: false
            })
          }
        } else {
          util.showErrorToast(res.msg);
        }
      });
    }
  },

  search(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/search/search?id=' + id,
    })
  },

  collegeDetails: function(e) {
    var showItem = this.data.showItem
    if (showItem == '1') {
      var posts_id = e.currentTarget.dataset.posts_id
      var title = e.currentTarget.dataset.title
      wx.navigateTo({
        url: '/pages/position_details/position_details?posts_id=' + posts_id + '&title=' + title,
      })
    } else {
      var resume_id = e.currentTarget.dataset.resume_id
      var title = e.currentTarget.dataset.title
      wx.navigateTo({
        url: '/pages/resume_details/resume_details?resume_id=' + resume_id + '&title=' + title,
      })
    }
  },

  screen(e) {
    // console.log(this.data.salid)
    this.setData({
      hidden: !this.data.hidden
    })
  },

  communityDetails: function() {
    wx.navigateTo({
      url: '../community_details/community_details',
    })
  },

  release: function() {
    let showItem = this.data.showItem
    if (showItem == '1') {
      wx.navigateTo({
        url: '/pages/release_position/release_position',
      })
    } else {
      wx.navigateTo({
        url: '/pages/release_resume/release_resume',
      })
    }
  },

  education: function(e) {
    let id = e.currentTarget.dataset.idx
    this.setData({
      eduid: id
    })
  },

  experienc: function(e) {
    let id = e.currentTarget.dataset.idx
    this.setData({
      expid: id
    })
  },

  salary: function(e) {
    let id = e.currentTarget.dataset.idx
    let min_salary = e.currentTarget.dataset.min
    let max_salary = e.currentTarget.dataset.max
    this.setData({
      salid: id,
      min_salary: min_salary,
      max_salary: max_salary
    })
  },

  // 打开设置
  openSetting: function () {
    var that = this
    wx.openSetting({
      success: function (res) {
        that.getLocation()
      }
    })
  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    if (this.data.showItem == 0) {
      that.postsList()
    } else if (this.data.showItem == 1) {
      that.resumeList()
    }
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})