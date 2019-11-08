// pages/community/community.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    itemData: '',
    navItem: ['进行中活动', '已结束活动'],
    free: ['免费活动', '付费活动'],
    showItem: 1,
    hidden: false,
    city: '',
    is_free: '',
    keywords: '',
    page: 1,
    reach: true,
    events: [],
    none: false,
    cancel: '/images/cancel.png',
    determine: '/images/determine.png',
    val: [0,0],
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载活动中...',
    });
    this.getLocation()
    this.eventsList()
  },

  onReady: function () {
    
  },

  onShow: function () {
    this.CommonProvince() //请求省列表接口
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

  preventTouchMove: function (e) {
    
  },

  //城市
  workCity: function () {
    this.setData({
      showWorkCity: !this.data.showWorkCity,
      city: this.data.city
    });
  },

  workCitySure: function () {
    this.setData({
      showWorkCity: !this.data.showWorkCity,
      city: this.data.citys,
      page: 1,
      reach: true,
      events: [],
      none: false
    });
    this.eventsList()
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

  getLocation: function () {
    var that = this;
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'JMYBZ-SA7WP-NFNDJ-VCPDB-IGOXQ-XDFIR' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
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
      events: [],
      none: false
    });
    that.eventsList()
  },

  isFree: function (e) {
    let is_free = e.currentTarget.dataset.is_free
    let item = e.currentTarget.dataset.item
    this.setData({
      is_free: is_free,
      item: item,
      hidden: !this.data.hidden,
      page: 1,
      reach: true,
      events: []
    })
    this.eventsList()
  },

  eventsList: function () {
    var that = this
    if (that.data.city == '') {
      var city = wx.getStorageSync('address_arr').city
    } else {
      var city = that.data.city
    }
    var page = that.data.page
    var data = {
      type: that.data.showItem,
      city: city,
      is_free: that.data.is_free,
      keywords: that.data.keywords,
      page: page
    }
    let reach = that.data.reach
    if (reach){
      util.request(api.EventsLists, data).then(function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        if (res.code == 200) {
          let event = that.data.events
          for (let i = 0; i < res.data.events.data.length; i++) {
            event.push(res.data.events.data[i])
          }
          that.setData({
            events: event,
            none: true
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
  // 打开设置
  openSetting: function () {
    var that = this
    wx.openSetting({
      success: function (res) {
        // console.log(res)
        that.getLocation()
      }
    })
  },


  search(e) {
    let types = this.data.showItem
    wx.navigateTo({
      url: '../search/search?types=' + types,
    })
  },

  screen(e) {
    this.setData({
      hidden: !this.data.hidden
    })
  },

  communityDetails: function(e) {
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../community_details/community_details?id=' + id + '&title=' + title,
    })
  },

  release: function() {
    wx.navigateTo({
      url: '../release/release',
    })
  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.eventsList();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function() {
    this.eventsList()
  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})