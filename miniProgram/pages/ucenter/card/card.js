// pages/ucenter/card/card.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()
Page({
  data: {
    card: '/images/card.png',
    chat: '/images/chat.png',
    path1: '',
    id: '',
    setting: false
  },

  onLoad: function(options) {
    var that = this
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })
    }
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
    this.UserCard()
  },
  UserCard: function() {
    var that = this
    util.request(api.UserCard).then(function(res) {
      if (res.code == 200) {
        var cards = res.data.card
        that.setData({
          cards: cards
        })
        wx.getImageInfo({
          src: cards.constellation_img,
          success: function(ress) {
            var path2 = ress.path
            that.setData({
              path2: path2
            })
          }
        });
        wx.getImageInfo({
          src: cards.head_pic,
          success: function(res) {
            var path1 = res.path
            that.setData({
              path1: path1
            })
          }
        });
      } else if (res.code == 20001) {
        wx.showModal({
          title: '提示',
          content: res.msg,
          cancelText: '取消',
          confirmText: '去报名',
          confirmColor: '#2BBCD9',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/application/application',
              })
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  onReady: function() {
    var that = this
    wx.showLoading({
      title: '加载学籍卡中...',
    });
    that.data.setInter = setInterval(
      function() {
        that.Canvas()
      }, 500);
  },
  onShow: function() {

  },
  Canvas: function() {
    var that = this
    let ctxW = that.data.windowWidth;
    let ctxH = that.data.windowHeight;
    // 屏幕系数比，以设计稿375*667（iphone7）为例
    let XS = that.data.windowWidth / 375;
    let XH = that.data.windowHeight / 375;
    const ctx = wx.createCanvasContext('myCanvas')
    var cards = that.data.cards
    //获取网络图片本地路径
    ctx.fillRect(0, 0, ctxW, ctxH);
    ctx.drawImage(that.data.card, 0, 0, ctxW, ctxH);
    ctx.setFontSize(24 * XS);
    ctx.setTextAlign('center');
    ctx.setTextBaseline('middle');
    ctx.setFillStyle('#FFFFFF');
    that.fontLineFeed(ctx, cards.constellation, 10, 10, (ctxW / 2 - 6) * XS, (ctxH / 6.5) * XS / 2);
    ctx.setFontSize(15 * XS);
    ctx.setTextAlign('left');
    ctx.setFillStyle('#FFFFFF');
    that.fontLineFeed(ctx, cards.nickname, 20 * XS, 10 * XS, (ctxW / 2 - 20) * XS, (ctxH / 2) * XS / 2);
    that.fontLineFeed(ctx, '我的学籍是' + cards.constellation, 20 * XS, 10 * XS, ctxW / 2 - 20 * XS, (ctxH / 2 - 40) / 2);
    ctx.drawImage(that.data.path2, ctxW / 2 - 36 * XS, ctxH / 2 - 20 * XS, 68 * XS, 68 * XS)
    that.fontLineFeed(ctx, cards.keyword[0], 20 * XS, 10 * XS, ctxW / 2 - 16 * XS, ctxH / 2 - 80 * XS);
    that.fontLineFeed(ctx, cards.keyword[1], 20 * XS, 10 * XS, ctxW / 2 + 66 * XS, ctxH / 2 - 34 * XS);
    that.fontLineFeed(ctx, cards.keyword[2], 20 * XS, 10 * XS, ctxW / 2 + 66 * XS, ctxH / 2 + 34 * XS);
    that.fontLineFeed(ctx, cards.keyword[3], 20 * XS, 10 * XS, ctxW / 2 - 100 * XS, ctxH / 2 - 34 * XS);
    that.fontLineFeed(ctx, cards.keyword[4], 20 * XS, 10 * XS, ctxW / 2 - 100 * XS, ctxH / 2 + 34 * XS);
    that.fontLineFeed(ctx, cards.keyword[5], 20 * XS, 10 * XS, ctxW / 2 - 16 * XS, ctxH / 2 + 80 * XS);
    ctx.drawImage(that.data.chat, ctxW / 2 + 78 * XS, (ctxH - (ctxH / 3.2)) * XS, 68 * XS, 68 * XS);
    ctx.setFontSize(10 * XS);
    ctx.setTextAlign('left');
    ctx.setTextBaseline('middle')
    that.fontLineFeed(ctx, '二十一天从区块链小白成长到资深玩家最搭星座陪伴式学习', 10, 16, ctxW / 2 - 140 * XS, ctxH - (ctxH / 3.28));;
    ctx.setFontSize(12 * XS);
    ctx.setTextAlign('left');
    that.fontLineFeed(ctx, '扫码进入大学', 6, ctxW / 2 + 190 * XS, ctxW / 2 + 76 * XS, (ctxH - (ctxH / 1.4)));
    ctx.setFontSize(12 * XS);
    ctx.setTextAlign('left');
    that.fontLineFeed(ctx, '宇宙区块链大学学籍卡', 20, ctxW / 2 + 190 * XS, ctxW / 2 - 150 * XS, ctxH / 2 - (ctxH / 5));
    that.fontLineFeed(ctx, '全宇宙颜值最高的区块链短视频系统课程', 20, ctxW / 2 + 190 * XS, ctxW / 2 - 150 * XS, ctxH / 2 - (ctxH / 6));
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(((68 * XS / 2 + ctxW - 68 * XS) / 3.2) * XS, (ctxH / 2 + 10) * XS / 2, 68 / 2 * XS, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.beginPath();
    console.log((ctxH / 2 - 60) * XS / 2)
    ctx.drawImage(that.data.path1, ((ctxW - 70 * 2) / 3.2) * XS, (ctxH / 2 - 60) * XS / 2, 68 * XS, 68 * XS)
    ctx.restore();
    ctx.save();
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
  saveImage: function() {
    var that = this
    var setting = that.data.setting
    if (setting) {
      wx.openSetting({
        success(settingdata) {
          if (settingdata.authSetting["scope.writePhotosAlbum"]) {
            util.showNoneToast('获取权限成功，再次点击图片保存到相册');
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
      success: function(res) {
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

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.Canvas();
    this.onShow();
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }

})