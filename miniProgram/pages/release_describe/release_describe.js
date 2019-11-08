// pages/release_describe/release_describe.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({
  data: {
    indicatorDots: true,
    circular: true,
    indicatorDots: false,
    autoplay: true,
    interval: 10000,
    duration: 1000,
    swiperCurrent: 0,
    openCamera: false,
    date: '',
    time: '',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    display: '',
    disabled: false,
    cancel: '../../../images/cancel.png',
    determine: '../../../images/determine.png',
    files: [],
    image: [],
  },

  onLoad: function(options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
      start_time: obj.dateTimeArray[0][obj.dateTime[0]] + '-' + obj.dateTimeArray[1][obj.dateTime[1]] + '-' + obj.dateTimeArray[2][obj.dateTime[2]] + ' ' + obj.dateTimeArray[3][obj.dateTime[3]] + ':' + obj.dateTimeArray[4][obj.dateTime[4]],
      end_time: obj.dateTimeArray[0][obj.dateTime[0]] + '-' + obj.dateTimeArray[1][obj.dateTime[1]] + '-' + obj.dateTimeArray[2][obj.dateTime[2]] + ' ' + obj.dateTimeArray[3][obj.dateTime[3]] + ':' + obj.dateTimeArray[4][obj.dateTime[4]]
    });
  },

  onReady: function() {

  },

  onShow: function() {

  },

  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  swiperClose: function (e) {
    var that = this
    let index = that.data.swiperCurrent
    let file = that.data.files
    file.splice(index, 1);
    that.setData({
      files: file,
      swiperCurrent: 0,
      tempFilePaths: true
    })
    console.log(file)
  },

  toggleDate: function() {
    this.setData({
      showDate: !this.data.showDate
    })
  },

  dateBindChange: function(e) {
    let val = e.detail.value
    this.setData({
      year: this.data.years[val[0]]
    })
  },

  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    console.log(dateArr[2][arr[2]])
    if (dateArr[2][arr[2]] == undefined) {
      dateArr[2][arr[2]] = '01'
    }
    var start_time = dateArr[0][arr[0]] + '-' + dateArr[1][arr[1]] + '-' + dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]]
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr,
      start_time: start_time
    });
  },

  changeDateTimeColumn(e) {
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    if (dateArr[2][arr[2]] == undefined) {
      dateArr[2][arr[2]] = '01'
    }
    var end_time = dateArr[0][arr[0]] + '-' + dateArr[1][arr[1]] + '-' + dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]]
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      end_time: end_time
    });
  },

  albumchooseimage: function(e) {
    if (this.data.files.length >= 5) {
      util.showErrorToast('最多上传五张图片')
      return false;
    }
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function(res) {
        that.setData({
          tempFilePaths: res.tempFilePaths,
          openCamera: !that.data.openCamera,
          files: that.data.files.concat(res.tempFilePaths)
        });
        that.upload(res);
      }
    })
  },
  camerachooseimage: function(e) {
    if (this.data.files.length >= 5) {
      util.showErrorToast('最多上传五张图片')
      return false;
    }
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function(res) {
        that.setData({
          tempFilePaths: res.tempFilePaths,
          openCamera: !that.data.openCamera,
          files: that.data.files.concat(res.tempFilePaths)
        });
        that.upload(res);
      }
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
            images: image
          })
          that.data.image.push(image)
          that.setData({
            hasPicture: true,
            image: that.data.image
          })
        }
      },
      fail: function(e) {
        util.showErrorToast('上传失败')
      },
    })
  },

  addImages: function() {
    this.setData({
      openCamera: !this.data.openCamera
    })
  },

  //主题
  bindinputTitle(event) {
    this.setData({
      title: event.detail.value
    })
  },

  //费用
  bindinputFee(event) {
    this.setData({
      event_fee: event.detail.value
    })
  },

  //报名人数
  bindinputFee(event) {
    this.setData({
      join_num: event.detail.value
    })
  },
  
  //联系电话
  bindinputMobile(event) {
    let phoneNum = event.detail.value;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var flag = reg.test(phoneNum);
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
      mobile: event.detail.value
    })
  },

  bindinputDescription(event) {
    this.setData({
      description: event.detail.value
    })
  },

  formReset: function (e) {
    this.setData({
      disabled: !this.data.disabled
    })
  },

  map: function() { //打开微信地图选择地址
    var that = this;
    var that = this;
    wx.chooseLocation({
      success: function(res) {
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

  formSubmit: function(e) {
    var that = this
    let title = that.data.title
    let start_time = that.data.start_time
    let end_time = that.data.end_time
    let address = that.data.address
    let province = that.data.province
    let city = that.data.city
    let zone = that.data.zone
    let event_fee = that.data.event_fee
    let join_num = that.data.join_num
    let mobile = that.data.mobile
    let description = that.data.description
    let images = that.data.image
    let data = {
      title: title,
      start_time: start_time,
      end_time: end_time,
      address: address,
      province: province,
      city: city,
      zone: zone,
      event_fee: event_fee,
      join_num: join_num,
      mobile: mobile,
      description: description,
      images: images
    }
    util.request(api.EventsSubmit, data, 'POST').then(function(res) {
      if (res.code == 200) {
        wx.showModal({
          content: res.msg,
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#2BBCD9',
          success: function (res) {
            if (res.confirm) {
              setTimeout(function () {
                wx.navigateBack()
              }, 1000)
            }
          }
        })
      } else {
        util.showModal(res.msg);
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