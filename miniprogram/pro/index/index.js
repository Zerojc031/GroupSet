const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    tagList: [{
      value: 'one',
      id: 1,
      name: '华南',
      list: []
    }, {
      value: 'two',
      id: 2,
      name: '华中',
      list: []
    }, {
      value: 'three',
      id: 3,
      name: '华北',
      list: []
    }, {
      value: 'four',
      id: 4,
      name: '华东',
      list: []
    }, {
      value: 'five',
      id: 5,
      name: '西南',
      list: []
    }, {
      value: 'six',
      id: 6,
      name: '西北',
      list: []
    }, {
      value: 'seven',
      id: 7,
      name: '东北',
      list: []
    }, {
      value: 'eight',
      id: 8,
      name: '其他',
      list: []
    }],
    // tagList: [{
    //   south: [],
    //   central: [],
    //   north: [],
    //   east: [],
    //   northwest: [],
    //   northeast: [],
    //   southwest: [],
    //   others: []
    // }],
    uniList: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    height: 0,
    curTabIndex: 1,
    toView: '',
    scrollTop: 100,
    listsHeight: [],
    unitPx: 0.5,
    toViewLeft: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadUserInfo()
    var that = this;
    this.loadData()
    wx.getSystemInfo({
      success: function(res) {
        console.log('获取设备信息成功', res)
        that.setData({
          height: res.windowHeight,
          unitPx: res.windowWidth / 750
        })
      }
    })
  },

  onReady: function(options) {
    // var list = this.getListHeight(menu, this.data.unitPx);
    // this.setData({
    //   listsHeight: list
    // });
  },
  /**
   * 用户识别处理函数
   */
  loadUserInfo: function() {
    if (!app.globalData.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 数据载入函数--查询数据库操作
   */
  loadData: function() {
    let that = this
    db.collection('control').doc('university').get({
      success: function(res) {
        console.log('查询成功', res)
        that.data.tagList[0].list = res.data.south
        that.data.tagList[1].list = res.data.central
        that.data.tagList[2].list = res.data.north
        that.data.tagList[3].list = res.data.east
        that.data.tagList[4].list = res.data.southwest
        that.data.tagList[5].list = res.data.northwest
        that.data.tagList[6].list = res.data.northeast
        that.data.tagList[7].list = res.data.others
        // let uniListLength = res.data.uniList.length
        for (let i = 0; i < res.data.uniList.length; i++) {
          that.data.uniList[i] = res.data.uniList[i]
          if (i == res.data.uniList.length - 1) {
            that.setData({
              tagList: that.data.tagList,
              uniList: that.data.uniList,
            })
          }
        }
      },
      fail: function(res) {
        console.log('查询失败', res)
      }
    })
  },
  /**
   * 打开二维码图片
   */
  tap: function(e) {
    console.log('点击学校', e)
    var that = this
    if (e.currentTarget.dataset.id >= 0) {
      if (this.data.uniList[e.currentTarget.dataset.id].isShowQRCode) {
        wx.previewImage({
          urls: [that.data.uniList[e.currentTarget.dataset.id].src],
          success: function() {
            wx.showToast({
              title: '长按扫描二维码',
              duration: 1000
            })
          }
        })
      } else {
        let content = '咨询群已满一百人\n请复制添加负责人微信:\n' + that.data.uniList[e.currentTarget.dataset.id].wechatID
        wx.showModal({
          title: '请复制负责人微信号',
          content: content,
          cancelText: '返回',
          confirmText: '复制',
          success: function(res) {
            if (res.confirm) {
              wx.setClipboardData({
                data: that.data.uniList[e.currentTarget.dataset.id].wechatID,
              })
            }
          },
          fail: function() {
            wx.showToast({
              title: '错误104',
              icon: 'none',
              duration: 500,
            })
          },
        })
      }
    } else {
      wx.showToast({
        title: '错误105',
        icon: 'none',
        duration: 500,
      })
    }
  },
  /**
   * 切换类别
   */
  switchTab: function(e) {
    console.log('切换类别', e)
    this.setData({
      curTabIndex: e.target.dataset.id,
      toView: e.target.dataset.value
    })
  },
  /**
   * 右边列表滚动时触发函数
   */
  scroll: function(e) {
    console.log('列表滚动', e);
    var heights = this.data.listsHeight;
    var tempValue, tempId;
    for (var i in heights) {
      if (e.detail.scrollTop >= heights[i].height) {
        tempValue = heights[i].value;
        tempId = heights[i].id;
      }
    }
    this.setData({
      curTabIndex: tempId,
      toViewLeft: tempValue
    });
  },
  toSighup: function() {
    if (app.globalData.openid == 'ox8QE5mHoAOyo8Vc_CMKcjl9rciM') {
      wx.navigateTo({
        url: '../manage/manage',
      })
    } else {
      wx.navigateTo({
        url: '../sighup/sighup',
      })
    }
  },

  getListHeight: function(arr, unit) {
    var kidsLength = 0; //获取该列子元素的长度
    for (var i in arr) {
      if (i == 0) {
        kidsLength = arr[i].food.length;
        continue;
      }
      arr[i].height = arr[i - 1].height + (kidsLength * 130 + 50) * unit;
      kidsLength = arr[i].food.length;
    }
    console.log(arr);
    return arr;
  },

})