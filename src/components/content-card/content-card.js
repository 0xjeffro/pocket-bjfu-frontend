// components/content-card/content-card.js
Component({
    options:{
      multipleSlots:true
    },
    externalClasses: ['l-content'],
    /**
     * 组件的属性列表
     */
    properties: {
      name: {
        type: String
      },
      cardPadding: {
        type: Boolean,
        value: true
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
});