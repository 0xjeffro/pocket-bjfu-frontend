import bus from 'iny-bus';
Component({
    data: {
      show: true,
      selected: 0,
      color: "#333",
      selectedColor: "#333",
      list: [
        {
            pagePath: "/pages/index/index",
            iconPath: "/static/img/shouye.png",
            selectedIconPath: "/static/img/refresh.png",
            text: "刷新"
        },
        {
            pagePath: "/pages/gongneng/gongneng",
            iconPath: "/static/img/gongneng.png",
            selectedIconPath: "/static/img/gongneng-active.png",
            text: "聚合"
        }
      ]
    },
    attached() {
      bus.on('tabBarHide', () => {
        this.setData({
          show: false
        })
      })

      bus.on('tabBarShow', () => {
        this.setData({
          show: true
        })
      })
    },
    methods: {
      switchTab(e) {
        const data = e.currentTarget.dataset
        const url = data.path
        const index = data.index
        console.log('!!!', index, this.data.selected)
        if (index === 0 && this.data.selected === 0) {
          wx.pageScrollTo({
            scrollTop: 0,
          })
          wx.startPullDownRefresh({
            success: (res) => {},
          })
          wx.uma.trackEvent('click_forum')
        }
        // if (index === 0) {
        //   this.setData({
        //     ['list[0].text']: "刷新"
        //   })
        //   console.log(this.data.list[0].iconPath)
        // }
        console.log(data)
        
        wx.switchTab({url})
        wx.vibrateShort()
      }
    }
  })