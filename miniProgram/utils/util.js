var api = require('../config/api.js');
var app = getApp();

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封装微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'x-access-token': wx.getStorageSync('access_token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 40005) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('access_token');
            } catch (e) {
              // Do something when catch error
            }
            wx.login({
              success: function (res) {
                wx.request({
                  url: api.AuthLoginByWeixin,
                  method: 'POST',
                  data: {
                    avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
                    nickName: wx.getStorageSync('userInfo').nickName,
                    gender: wx.getStorageSync('userInfo').gender,
                    code: res.code
                  },
                  success: (ress) => {
                    wx.setStorageSync('access_token', ress.data.data.access_token);
                    wx.request({
                      url: url,
                      data: data,
                      method: method,
                      header: {
                        'Content-Type': 'application/json',
                        'x-access-token': wx.getStorageSync('access_token')
                      },
                      success: function (res) {
                        console.log(res)
                        resolve(res.data);
                      }
                    })
                  }
                });
              }
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

function navigate(url) {
  //判断页面是否需要登录
  if (false) {
    wx.navigateTo({
      url: '/pages/login/login'
    });
    return false;
  } else {
    wx.navigateTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/images/warning.png'
  })
}

function showToast(msg) {
  wx.showToast({
    title: msg,
    icon: 'success',
    duration: 2000
  })
}

function showNoneToast(msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  })
}

function showModal(msg) {
  wx.showModal({
    content: msg,
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

/**
 * 封装微信的的分享功能
 */
function onShareAppMessage(title, path, callback, imageUrl) {
  let defaultImageUrl = 'https://admin.lyzxy.com.cn/images/share.jpg';
  let user_id = wx.getStorageSync('user_id');
  var nickName = wx.getStorageSync('userInfo').nickName;
  var title = `[${nickName}@我]21天读懂区块链`;
  var path = '/pages/index/index?first_puser_id=' + user_id;
  return {
    title: title,
    path: path,
    imageUrl: imageUrl || defaultImageUrl,
    success(res) {
      if (!res.shareTickets) {
        //分享到个人
        api.shareFriend().then(() => {
          //执行转发成功以后的回调函数
          callback && callback();
        });
      } else {
        //分享到群
        let st = res.shareTickets[0];
        wx.getShareInfo({
          shareTicket: st,
          success(res) {
            let iv = res.iv
            let encryptedData = res.encryptedData;
            api.groupShare(encryptedData, iv).then(() => {
              console.warn("groupShareSuccess!");
              //执行转发成功以后的回调函数
              callback && callback();
            });
          }
        });
      }
    },
    fail: function (res) {
      console.log("转发失败！");
    }
  };
}

module.exports = {
  formatTime,
  request,
  navigate,
  showErrorToast,
  showToast,
  showModal,
  showNoneToast,
  onShareAppMessage: onShareAppMessage
}


