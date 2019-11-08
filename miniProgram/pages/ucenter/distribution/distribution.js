// pages/ucenter/distribution/distribution.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const app = getApp()
Page({
  data: {
    poster: false,
    setting: false,
    right:'/images/right.png',
    cancel: '/images/cancel.png',
    determine: '/images/determine.png',
    bg: 'https://admin.lyzxy.com.cn/images/poster.png',
    newbg:'',
    promote_qrcode_path:'',
    head_pic:'',
    ready:'',
  },

  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    wx.getImageInfo({
      src: that.data.bg,
      success: function (ress) {
        var bg = ress.path
        that.setData({
          newbg: bg
        })
      }
    });
    util.request(api.UserUserInfo).then(function (res) {
      if (res.code == 200) {
        that.setData({
          userinfo: res.data.user_info,
        })
        wx.getImageInfo({
          src: res.data.user_info.head_pic,
          success: function (ress) {
            var head_pic = ress.path
            that.setData({
              head_pic: head_pic
            })
          }
        });
        wx.getImageInfo({
          src: res.data.user_info.promote_qrcode_path,
          success: function (ress) {
            var promote_qrcode_path = ress.path
            that.setData({
              promote_qrcode_path: promote_qrcode_path
            })
          }
        });
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  onReady: function () {
    
  },

  onShow: function () {
    var that = this
    that.data.setInter = setInterval(
      function () {
        that.btnOpClick()
      }, 500);
  },

  preventTouchMove: function (e) {

  },

  team: function () {
    wx.navigateTo({
      url: '/pages/ucenter/team/team',
    })
  },

  distributionData: function () {
    wx.navigateTo({
      url: '/pages/ucenter/distribution_data/distribution_data',
    })
  },

  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  goPoster: function () {
    this.setData({
      showDialog: !this.data.showDialog,
      poster: !this.data.poster
    });
    wx.showLoading({
      title: '加载中...',
    });
    this.btnOpClick();
  },

  noposter: function () {
    this.setData({
      poster: !this.data.poster
    });
  },

  btnOpClick: function(e) {
    var that = this;
    let ctxW = that.data.windowWidth;
    let ctxH = that.data.windowHeight;
    let user = that.data.userinfo
    let head_pic = that.data.head_pic
    let promote_qrcode_path = that.data.promote_qrcode_path
    console.log(head_pic)
    console.log(promote_qrcode_path)
    // 屏幕系数比，以设计稿375*667（iphone7）为例
    let XS = that.data.windowWidth / 375;
    let ctx = wx.createCanvasContext('myCanvas');
    ctx.fillRect(0, 0, ctxW, ctxH);
    ctx.drawImage(that.data.newbg, ctxW / 2 - 188 * XS, 0 * XS, ctxW / 2 + 80 * XS, ctxH / 2 + 80 * XS);
    ctx.setFontSize(10 * XS);
    ctx.setFillStyle('#eeeeee');
    that.fontLineFeed(ctx, user.nickname, 10 * XS, 10 * XS, ctxW / 2 - 120 * XS, ctxH / 2 - 20 * XS);
    that.fontLineFeed(ctx, user.mobile, 11 * XS, 10 * XS, ctxW / 2 - 120 * XS, ctxH / 2 * XS);
    ctx.drawImage(promote_qrcode_path, ctxW / 2 - 20 * XS, ctxH / 2 - 60 * XS, 80 * XS, 80 * XS);
    ctx.setTextAlign('center');
    ctx.setTextBaseline('middle');
    ctx.setFontSize(10 * XS);
    ctx.setFillStyle('#eeeeee');
    that.fontLineFeed(ctx, '长按图片识别二维码', 9, ctxH / 2 - 80 * XS, ctxW / 2 + 20 * XS, ctxH / 2 - 190 * XS);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(40 / 2 + ctxW / 2 - 172 * XS, 40 / 2 + ctxH / 2 - 22 * XS, 40 / 2, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.beginPath();
    ctx.drawImage(head_pic, ctxW / 2 - 172 * XS, ctxH / 2 - 22 * XS, 40 * XS, 40 * XS);
    ctx.restore();
    ctx.draw();
    wx.hideLoading();
    clearInterval(that.data.setInter)
  },

  /**
   * ctx,画布对象
   * str,需要绘制的文字
   * splitLen,切割的长度字符串
   * strHeight,每行文字之间的高度
   * x,位置
   * y
   */
  fontLineFeed: function(ctx, str, splitLen, strHeight, x, y) {
    let strArr = [];
    for (let i = 0, len = str.length / splitLen; i < len; i++) {
      strArr.push(str.substring(i * splitLen, i * splitLen + splitLen));
    }
    let s = 0;
    for (let j = 0, len = strArr.length; j < len; j++) {
      s = s + strHeight;
      ctx.fillText(strArr[j], x, y + s);
    }
  },
  // 保存图片
  saveImage: function(e) {
    var that = this
    var setting = that.data.setting
    if (setting) {
      wx.openSetting({
        success(settingdata) {
          if (settingdata.authSetting["scope.writePhotosAlbum"]) {
            util.showNoneToast('获取权限成功，请再次点击保存图片！');
            that.setData({
              setting: false
            })
          } else {
            util.showNoneToast('请允许获取保存到相册');
          }
        }
      })
    }
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(result) {
            util.showToast('图片保存成功');
          },
          fail(result) {
            if (result.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              that.setData({
                setting: true
              })
            } else if (result.errMsg === "saveImageToPhotosAlbum:fail cancel") {
              that.setData({
                setting: false
              })
            }
            if (setting == false) {
              util.showErrorToast('图片保存失败');
            }
          }
        })
      }
    })
  },
  onShareAppMessage: function () {
    let nickName = '';
    try {
      nickName = wx.getStorageSync('userInfo').nickName;
    } catch (e) {
      nickName = app.globalData.userInfo.nickName;
    }
    let title = `[${nickName}@我]21天读懂区块链`;
    let user_id = wx.getStorageSync('user_id');
    let path = '/pages/index/index?first_puser_id=' + user_id;
    let shareCallBack = () => {

    };
    return util.onShareAppMessage(title, path, shareCallBack);
  },
});