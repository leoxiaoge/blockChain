
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderid: {            // 属性名
      type: Number,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    rule: {
      type: String,
      value: '规则'
    },
    price: {
      type: String,
      value: '价格'
    },
    vip: {
      type: String,
      value: 'vip价格'
    },
    images: {
      type: String,
      value: '图片'
    },
    suk: {
      type: String,
      value: '库存'
    }
  },
 
  /**
   * 组件的初始数据
   */
  data: {
 
  },
 
  /**
   * 组件的方法列表
   */
  methods: {
 
  }
})