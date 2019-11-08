var debug = getApp().debug || true;
var yxxruiSliderData = {
  datas: [],
  blankWidth: 12,
  newImgWidth: 18,
  totalWidth: 0,
  x: 0,
  firstX: 0,
  curPage: 1,
  indicateDots: []
};
var that = null;
var durection = 'left';
var autoRun = true;
var duration = 200;
var interval = 2000;
var startSlideCallback = null;
var endSlideCallback = null;
var autiRunTimer;
var slideTimer;
var lastX;
var firstX;
var firstPointX = 0;
var sliderLock = 0;
function initMySlider(opt) {
  if (opt.that == null) {
    return;
  }
  that = opt.that;
  yxxruiSliderData.data = opt.datas || yxxruiSliderData.datas;
  yxxruiSliderData.blankWidth = opt.blankWidth == undefined ?
    yxxruiSliderData.blankWidth : opt.blankWidth;
  yxxruiSliderData.newImgWidth = opt.newImgWidth == undefined ?
    yxxruiSliderData.newImgWidth : opt.newImgWidth;
  autoRun = opt.autoRun;
  interval = opt.interval || interval;
  duration = opt.duration || duration;
  startSlideCallback = opt.startSlide || startSlideCallback;
  endSlideCallback = opt.endSlide || endSlideCallback;
  var len = yxxruiSliderData.datas.length;
  if (len < 1) {
    return;
  }
  for (var i = 0; i < len; i++) {
    yxxruiSliderData.indicateDots.push(i + 1);
  }
  var fistImg = yxxruiSliderData.datas[0];
  var lastImg = yxxruiSliderData.datas[len - 1];
  yxxruiSliderData.datas.unshift(lastImg);
  yxxruiSliderData.datas.push(fistImg);
  var w = wx.getStorageInfoSync().screenWidth;
  var kx = yxxruiSliderData.blankWidth;
  var nx = yxxruiSliderData.newImgWidth;
  var ox = kx + nx * 2;
  var pageWidth = w - ox;
  var fx = pageWidth - nx;
  yxxruiSliderData.totalWidth = yxxruiSliderData.datas.length * pageWidth
  yxxruiSliderData.firstX = -fx;
  yxxruiSliderData.x = -fx;
  that.setData({
    yxxruiSliderData: yxxruiSliderData
  })
  dealEvent(that);
  startSlideCallback && startSlideCallback(1);
  endSlideCallback && endSlideCallback(1);
}

function dealEvent() {
  that.sliderTouchStart = function(opt) {
    slideTimer && clearInterval(slideTimer);
    sliderLock = 0;
    autiRunTimer && clearInterval(autoRunTimer);
    lastX = yxxruiSliderData.x;
    firstPointX = opt.touches[0].clienX;
  };
  that.sliderTouchMove = function(opt) {
    var pointx = opt.touches[0].clienX;

    yxxruiSliderData.x = lastX + (pointx - firstPointX);
    that.setData({
      yxxruiSliderData: yxxruiSliderData
    });
  };
  that.sliderTouchEnd = function(opt) {
    slidePage(that, 0);
    if (autoRun) {
      autoRunMyslider(that.interval);
    }
  };
  that.sliderTouchCancel = this.sliderTouchEnd;
  that.onHide = function() {
    autoRunTimer && clearInterval(autoRunTimer);
  };
  that.onShow = function() {
    if (autoRun) {
      autoRunMyslider(that, interval);
    }
  }
}

function autoRunMyslider(that, t) {
  autoRunTimer && clearInterval(autoRunTimer);
  autoRunTimer = setInterval(function() {
    var dir = direction == 'right' ? 1 : -1;
    slidePage(that, dir);
  }, t);
}

function slidePage(that, page) {
  var lastX = yxxruiSliderData.x - yxxruiSliderData.newImgWidth;
  var totalWidth = yxxruiSliderData.totalWidth;
  var perScreenX = totalWidth / yxxruiSliderData.datas.length;
  var remain = (perScreenX - Math.abs(lastx % perScreenX)) % perScreenX;
  if (remain > 0) {
    if (remain < perScreenX / 2) {
      slideTo(that, -remain);
    } else {
      slideTo(that, perScreenX - remain);
    }
  } else {
    slideTo(that, perScreenX * page);
  }
}

function slideTo(that, x){
  if (sliderLock == 1) return;
  sliderLock = 1;
  var i = 0;
  var timeStep = 20;
  var lastx = yxxruiSliderData.x;
  var perScreenX = yxxruiSliderData.totalWidth / yxxruiSliderData.datas
  var totalWidth = yxxruiSliderData.totalWidth;
  slideTimer = setInterval(function (){
    var curPage = 0;
    if (i == 0){
      curPage = Math.abs(Math.round((lastx + x - 18) / perScreenX),0);
      curPage = curPage == yxxruiSliderData.datas.length-1?1:curPage;
      curPage = curPage == 0 ? yxxruiSliderData.datas.length - 2:curPage
      startSlideCallback && startSlideCallback(curPage);
    }
    if (i >= Math.abs(x)) {
      slideTimer && clearInterval(slideTimer);
      if (lastX + x >= yxxruiSliderData.newImgWidth){
        yxxruiSliderData.x = yxxruiSliderData.newImgWidth - (totalWidth)
      }
      if (lastX + x + totalWidth - perScreenX <= yxxruiSliderData.newImgWidth){
        yxxruiSliderData.x = yxxruiSliderData.firstX;
      }
      lastX = yxxruiSliderData.x;
      curPage = Math.abs(Math.floor((lastx + perScreenX) / perScreenX))
      yxxruiSliderData.curPage = curPage;
      that.setData({
        yxxruiSliderData: yxxruiSliderData
      });
      endSlideCallback && endSlideCallback(curPage);
      sliderLock = 0;
      return;
    }
    if (Math.abs(x) - i > step) {
      i += step;
    } else {
      i = Math.abs(x);
    }
    if (x > 0) {
     yxxruiSliderData.x = lastx + i; 
    } else {
      yxxruiSliderData.x = lastx - i;
    }
    that.setData({
      yxxruiSliderData: yxxruiSliderData
    });
  }, timeStep);
}

module.exports = {
  initMySlider: initMySlider
}