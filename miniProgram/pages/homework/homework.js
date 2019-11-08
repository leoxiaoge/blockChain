// pages/homework/homework.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const app = getApp()
Page({
  data: {
    homework: false,
    answerwork: true
  },

  onLoad: function(options) {
    this.setData({
      classes_id: options.classes_id
    })
    this.classes()
  },

  onReady: function() {

  },

  classes: function () {
    var that = this
    let data = {
      classes_id: that.data.classes_id
    }
    util.request(api.ClassesQuestions, data).then(function (res) {
      if (res.code == 200) {
        that.setData({
          questions: res.data.questions,
          answer_status: res.data.answer_status
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

  onShow: function() {

  },
  // 提交作业
  radioChange1: function(e) {
    var that = this
    console.log(e)
    let value = (e.detail.value).slice(0, 1)
    let id = e.currentTarget.dataset.id
    let questions = that.data.questions
    questions[id]["key"] = value
    let answer = questions
    console.log(answer)
    this.setData({
      value1: value,
      answer: answer
    })
  },

  radioChange: function (e) {
    var that = this
    console.log(e)
    let value = (e.detail.value).slice(0, 1)
    let id = e.currentTarget.dataset.id
    let questions = that.data.questions
    //正确答案key
    questions[id]["checked"] = true
    that.setData({
      questions: questions,
      value2: value
    })
  },

  submission: function () {
    let that = this
    console.log(that.data.answer)
    let data = {
      classes_id: that.data.classes_id,
      answer: that.data.answer
    }
    util.request(api.ClassesquestionsSubmit, data, 'POST').then(function (res) {
      if (res.code == 200) {
        console.log(res.data)
        that.setData({
          questions: res.data.answer.answer,
          homework: !that.data.homework,
          answerwork: !that.data.answerwork
        })
        that.classes()
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },
  onPullDownRefresh: function() {
    
  },

  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})