// pages/search/search.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()
Page({
  data: {
    searchStatus: false,
    city: '',
    page: 1,
    reach: true,
    events: [],
    posts: [],
    lists: [],
    type:'',
    types: ''
  },
  onLoad: function (options) {
    let city = wx.getStorageSync('address_arr').city
    if (options.types == 1 || options.types == 2) {
      var type = 'events'
    }
    if (options.id == 1){
      var type = 'posts'
    }
    if (options.id == 2) {
      var type = 'resume'
    }
    this.setData({
      city: city,
      types: options.types,
      id: options.id,
      type: type
    })
  },
  onShow: function (){
    this.getSearchKeyword();
  },
  getSearchKeyword: function() {
    let that = this;
    let data = {
      type: that.data.type
    }
    util.request(api.SearchRecord, data).then(function (res) {
      if (res.code == 200) {
        that.setData({
          record: res.data.record,
          suggest: res.data.suggest
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  eventsList: function () {
    var that = this
    wx.showLoading({
      title: '加载活动中...',
    });
    var citys = wx.getStorageSync('address_arr').city
    if (citys) {
      var city = citys
    } else {
      var city = that.data.city
    }
    var data = {
      type: that.data.types,
      city: city,
      keywords: that.data.keyword
    }
    util.request(api.EventsLists, data).then(function (res) {
      wx.hideLoading();
      if (res.code == 200) {
        that.setData({
          events: res.data.events
        })
      } else if (res.code == 20002) {
        util.showErrorToast(res.msg);
        setTimeout(function () {
          wx.navigateBack({})
        }, 1000)
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  //事件处理函数
  closeSearch: function() {
    wx.navigateBack()
  },
  clearKeyword: function() {
    this.setData({
      keyword: '',
      searchStatus: false,
      events: [],
      posts: [],
      lists: [],
    });
    this.getSearchKeyword();
  },
  //建议关键词列表
  onKeywordTap: function (e) {
    let searchId = e.target.dataset.id
    let keyword = e.target.dataset.keyword
    this.setData({
      searchId: searchId,
      keyword: keyword,
      reach: true,
      events: []
    })
    if (this.data.types){
      this.eventsList()
    }
    if (this.data.id == 1) {
      this.postsList()
    } else if (this.data.id == 2) {
      this.resumeList()
    }
    this.searchSubmit()
  },
  onKeywordTapUp: function (e) {
    console.log(e.currentTarget.dataset)
    let id = e.currentTarget.dataset.id
    let keyword = e.currentTarget.dataset.keyword
    this.setData({
      keyword: keyword,
      reach: true,
      events: []
    })
    if (this.data.types) {
      this.eventsList()
    }
    if (this.data.id == 1) {
      this.postsList()
    } else if (this.data.id == 2) {
      this.resumeList()
    }
    this.searchSubmit()
  },
  bindBlur: function(e) {
    console.log(e)
    let keyword = e.detail.value
    this.setData({
      keyword: keyword,
      searchStatus: false,
      reach: true,
      events: [],
      posts: [],
      lists: [],
    });
    if (this.data.types) {
      this.eventsList()
    }
    if (this.data.id == 1) {
      this.postsList()
    } else if (this.data.id == 2) {
      this.resumeList()
    }
    this.searchSubmit()
  },
  
  clearHistory: function() {
    var that = this
    let data = {
      type: this.data.type
    }
    util.request(api.SearchDelete, data, 'POST')
      .then(function(res) {
        console.log('清除成功');
        that.getSearchKeyword()
      });
  },
  eventsList: function () {
    var that = this
    console.log('搜索词', that.data.keyword)
    var citys = wx.getStorageSync('address_arr').city
    if (citys) {
      var city = citys
    } else {
      var city = that.data.city
    }
    var data = {
      type: that.data.types,
      city: that.data.city,
      keywords: that.data.keyword
    }
    var page = that.data.page
    let reach = that.data.reach
    console.log(reach)
    if (reach) {
      util.request(api.EventsLists, data).then(function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          let event = that.data.events
          for (let i = 0; i < res.data.events.data.length; i++) {
            event.push(res.data.events.data[i])
          }
          console.log(event)
          that.setData({
            events: event,
            searchStatus: true,
          })
          if (res.data.events.current_page < res.data.events.last_page) {
            that.setData({
              page: page + 1
            })
          } else {
            that.setData({
              page: page,
              reach: false
            })
          }
        } else if (res.code == 20002) {
          util.showErrorToast(res.msg);
          setTimeout(function () {
            wx.navigateBack({})
          }, 1000)
        } else {
          util.showErrorToast(res.msg);
        }
      });
    }
  },
  searchSubmit: function () {
    let data = {
      search_name: this.data.keyword,
      type: this.data.type
    }
    util.request(api.SearchSubmit, data, 'POST')
      .then(function (res) {
        console.log('成功', res);
      });
  },

  //职位列表
  postsList: function () {
    var that = this
    var page = that.data.page
    let data = {
      keywords: that.data.keyword,
      page: page
    }
    let reach = that.data.reach
    if (reach) {
      util.request(api.PostsLists, data).then(function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          var post = that.data.posts
          for (var i = 0; i < res.data.posts.data.length; i++) {
            post.push(res.data.posts.data[i])
          }
          that.setData({
            posts: post,
            educations: res.data.education,
            experiences: res.data.experience,
            searchStatus: true,
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
    let data = {
      keywords: that.data.keyword,
      page: page
    }
    let reach = that.data.reach
    if (reach) {
      util.request(api.ResumeLists, data).then(function (res) {
        wx.hideLoading();
        if (res.code == 200) {
          var list = that.data.lists
          for (var i = 0; i < res.data.lists.data.length; i++) {
            list.push(res.data.lists.data[i])
          }
          that.setData({
            lists: list,
            searchStatus: true,
          })
          console.log(that.data.lists)
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

  collegeDetails: function (e) {
    var id = this.data.id
    if (id == '1') {
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


  communityDetails: function (e) {
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../community_details/community_details?id=' + id + '&title=' + title,
    })
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.getSearchKeyword();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  
  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})