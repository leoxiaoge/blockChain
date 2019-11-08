// pages/resume_content/resume_content.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: {
      name: '王小二',
      name1: '离职-随时到岗',
      name2: '男',
      name3: '24岁',
      name4: '本科',
      name5: '2年经验',
      name6: '本科',
      name7: '深圳',
      name8: '13866666666',
      name9: '13866666666@163.com',
      name10: '区块链分析师',
      name11: '深圳',
      name12: '8K-12K',
      name13: '华中科技大学',
      name14: '金融学',
      name15: '本科',
      name16: '2012-2016',
      name17: '在校经历在校经历在校经历在校经历在校经历在校荣誉在校经历在校经历在校经历在校经历在校经历在校荣誉在校经历在校经历在校经历在校经历在校经历在校荣誉在校经历在校经历在校经历在校经历在校经历在校荣誉在校经历在校经。',
      name18: '深圳市必链科技有限公司',
      name19: '2016.06-2018.06',
    },
    datass: [{
        deviceId: "19:2E:CB:15:DF:0D",
        name: "未知设备",
        RSSI: -70,
        advertisData: ArrayBuffer,
        advertisServiceUUIDs: Array(0),
      },
      {
        deviceId: "3C:A3:08:A2:88:18",
        name: "SX-BP-000000178B ",
        RSSI: 0,
        advertisData: "",
        advertisServiceUUIDs: Array(0),
      },
      {
        deviceId: "3C:A3:08:A2:8B:17",
        name: "SX-BP-00585252 ",
        RSSI: 0,
        advertisData: "",
        advertisServiceUUIDs: Array(0),
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // var words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
    var words = this.data.datass;
    
    var result = words.filter(word => word.length > 6);

    var devices = [];
    for (let i = 0; i < words.length; i++) {
      var mid = words[i].name.indexOf('SX') != -1
      if (mid == true) {
        console.log('11122', words[i])
        words[i] = words[i]
        devices.push(words[i]);
        // console.log(words[i].name.split(','))
      }
    }
    console.log(words)
    console.log(devices)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return util.onShareAppMessage();
  }
})