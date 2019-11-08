var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var check = require('../../../utils/check.js');

var app = getApp();
Page({
  data: {
    address: {
      id: 0,
      provinceId: 0,
      cityId: 0,
      areaId: 0,
      address: '',
      name: '',
      mobile: '',
      isDefault: 0,
      provinceName: '',
      cityName: '',
      areaName: '',
      inputname: '',
    },
    addressId: 0,
    add: false,
    openSelectRegion: false,
    opentype:false,
    hasPicture: false,
    success:false,
    fail:false,
    audit: false,
    selectRegionList: [
      { id: 0, name: '省份', pid: 1, type: 1 },
      { id: 0, name: '城市', pid: 1, type: 2 },
      { id: 0, name: '区县', pid: 1, type: 3 }
    ],
    regionType: 1,
    regionList: [],
    selectRegionDone: false,

    uploadImg: true,
    img_arr: [],
  },
  onLoad: function (options) {
    var that = this
    // 页面初始化 options为页面跳转所带来的参数
    let isShopauth = options.isShopauth
    if (isShopauth == 0) {
      this.setData({
        add: true,
        audit: false,
        success: false,
        fail: false,
      })
    } else if (isShopauth == 1) {
      this.setData({
        add: false,
        audit: true,
        success: false,
        fail: false,
      })
    } else if (isShopauth == 2) {
      this.setData({
        add: false,
        audit: false,
        success: true,
        fail: false,
      })
    } else if (isShopauth == 3) {
      this.setData({
        add: false,
        audit: false,
        success: false,
        fail: true,
      })
    }
    
    
    if (options.id && options.id != 0) {
      this.setData({
        addressId: options.id
      });
      this.getAddressDetail();
    }
    util.request(api.Myinfo, )
      .then(function (res) {
        that.setData({
          authinfo: res.data.authinfo
        })
      });  

    util.request(api.Shopauth, )
      .then(function (res) {
        that.setData({
          Shopauth: res.data
        })
      });    
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
    
  },
  bindinputMobile(event) {
    let address = this.data.address;
    address.mobile = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputShop(event) {
    let address = this.data.address;
    address.shop = event.detail.value;
    let name = event.detail.value;
    this.setData({
      address: address,
    });
  },
  bindinputName(event) {
    let address = this.data.address;
    address.name = event.detail.value;
    this.setData({
      address: address,
    });
  },
  bindinputAddress(event) {
    this.setData({
      address: address
    });
  },
  bindIsDefault() {
    let address = this.data.address;
    address.isDefault = !address.isDefault;
    this.setData({
      address: address
    });
  },
  
  bindTextAreaBlur: function (e) {
    let address = this.data.address;
    address.value = e.detail.value;
    this.setData({
      address: address
    })
  },  
  bindTextAreaBlurauthinfo: function (e) {
    let address = this.data.address;
    address.value = e.detail.value;
    this.setData({
      address: address
    })
  },  
  getAddressDetail() {
    let that = this;
    util.request(api.AddressDetail, { id: that.data.addressId }).then(function (res) {
      if (res.errno === 0) {
        if (res.data) {
          that.setData({
            address: res.data
          });
        }
      }
    });
  },
  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      return item.id != 0;
    });

    that.setData({
      selectRegionDone: doneStatus
    })
  },
  openType: function () {
    this.setData({
      opentype: !this.data.opentype
    });
  },
  opentype: function (e) {
    let address = this.data.address;
    address.type = e.currentTarget.dataset.name;
    let idx = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    this.setData({
      address: address,
      id: idx,
      name: name
    })
    this.setData({
      opentype: !this.data.opentype
    });
  },
  chooseRegion() {
    let that = this;
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });

    //设置区域选择数据
    let address = this.data.address;
    if (address.provinceId > 0 && address.cityId > 0 && address.areaId > 0) {
      let selectRegionList = this.data.selectRegionList;
      selectRegionList[0].id = address.provinceId;
      selectRegionList[0].name = address.provinceName;
      selectRegionList[0].pid = 0;
      selectRegionList[1].id = address.cityId;
      selectRegionList[1].name = address.cityName;
      selectRegionList[1].pid = address.provinceId;
      selectRegionList[2].id = address.areaId;
      selectRegionList[2].name = address.areaName;
      selectRegionList[2].pid = address.cityId;
      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3
      });
      this.getRegionList(address.cityId);
    } else {
      this.setData({
        selectRegionList: [
          { id: 0, name: '省份', pid: 0, type: 1 },
          { id: 0, name: '城市', pid: 0, type: 2 },
          { id: 0, name: '区县', pid: 0, type: 3 }
        ],
        regionType: 1
      })
      this.getRegionList(0);
    }

    this.setRegionDoneStatus();

  },
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;
    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex - 1].id <= 0)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex + 1
    })

    let selectRegionItem = selectRegionList[regionTypeIndex];

    this.getRegionList(selectRegionItem.pid);

    this.setRegionDoneStatus();

  },
  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = regionItem.type;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;
    if (regionType != 3) {
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1
      })
      this.getRegionList(regionItem.id);
    } else {
      this.setData({
        selectRegionList: selectRegionList
      })
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.id = 0;
        item.name = index == 1 ? '城市' : '区县';
        item.pid = 0;
      }
      return item;
    });

    this.setData({
      selectRegionList: selectRegionList
    })


    that.setData({
      regionList: that.data.regionList.map(item => {

        //标记已选择的
        if (that.data.regionType == item.type && that.data.selectRegionList[that.data.regionType - 1].id == item.id) {
          item.selected = true;
        } else {
          item.selected = false;
        }

        return item;
      })
    });

    this.setRegionDoneStatus();

  },
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let address = this.data.address;
    let selectRegionList = this.data.selectRegionList;
    address.provinceId = selectRegionList[0].id;
    address.cityId = selectRegionList[1].id;
    address.areaId = selectRegionList[2].id;
    address.provinceName = selectRegionList[0].name;
    address.cityName = selectRegionList[1].name;
    address.areaName = selectRegionList[2].name;
    this.setData({
      address: address,
      openSelectRegion: false
    });

  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },
  getRegionList(regionId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(api.RegionList, { pid: regionId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          regionList: res.data.map(item => {

            //标记已选择的
            if (regionType == item.type && that.data.selectRegionList[regionType - 1].id == item.id) {
              item.selected = true;
            } else {
              item.selected = false;
            }

            return item;
          })
        });
      }
    });
  },
  cancelAddress() {
    wx.navigateBack();
  },
  saveAddress() {
    let that = this;
    let address = that.data.address;

    if (address.name == '') {
      util.showErrorToast('请输入姓名');
      return false;
    }

    if (address.mobile == '') {
      util.showErrorToast('请输入手机号码');
      return false;
    }


    if (address.areaId == 0) {
      util.showErrorToast('请输入省市区');
      return false;
    }

    if (address.value == '') {
      util.showErrorToast('请输入详细地址');
      return false;
    }

    if (!check.isValidPhone(address.mobile)) {
      util.showErrorToast('手机号不正确');
      return false;
    }

    if (!that.data.picUrls){
      util.showErrorToast('图片未上传');
      return false;
    }

    
    let addr = address.provinceName + address.cityName + address.areaName + address.value
    util.request(api.Create, {
      moblie: address.mobile,
      realName: address.name,
      shopName: address.shop,
      shopType: address.type,
      addr: address.value,
      province: address.provinceName,
      city: address.cityName,
      area: address.areaName,
      photo: that.data.picUrls,
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.setData({
          add: false,
          audit: true,
          success: false,
          fail: false,
        })
      }
    });

  },
  authinfoName(e) {
    let authinfo = this.data.authinfo
    authinfo.realName = e.detail.value;
  },
  authinfoMobile(e) {
    let authinfo = this.data.authinfo
    authinfo.moblie = e.detail.value;
  },
  authinfoShop(e) {
    let authinfo = this.data.authinfo
    authinfo.shopName = e.detail.value;
  },
  create:function () {
    let address = this.data.address
    let authinfo = this.data.authinfo
    let that = this;
    if (address.value) {
      let addr = address.value
      authinfo.addr = addr
    }
    if (that.data.picUrls){
      let picUrls = that.data.picUrls
      authinfo.photo = picUrls
    }
    if (this.data.name) {
      let shopType = this.data.name
      authinfo.shopType = shopType
    }
    util.request(api.Create, {
      moblie: authinfo.moblie,
      realName: authinfo.realName,
      shopName: authinfo.shopName,
      shopType: authinfo.shopType,
      addr: authinfo.addr,
      province: authinfo.province,
      city: authinfo.city,
      area: authinfo.area,
      photo: authinfo.photo
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.setData({
          add: false,
          audit: true,
          success: false,
          fail: false,
        })

      }
    });
  },
  
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  chooseImage: function (e) {

    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.upload(res);
      }
    })
  },
  upload: function (res) {
    var that = this;
    const uploadTask = wx.uploadFile({
      url: api.StorageUpload,
      filePath: res.tempFilePaths[0],
      name: 'file',
      success: function (res) {
        var _res = JSON.parse(res.data);
        if (_res.errno === 0) {
          var url = _res.data.url
          that.setData({
            hasPicture: true,
            picUrls: url
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
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.files
    })
  },
  onShareAppMessage: function () {
    return util.onShareAppMessage();
  }
})