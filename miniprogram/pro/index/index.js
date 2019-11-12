const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    height: 0,
    tabList: ['华南', '华中', '华北', '华东', '西南', '西北', '东北', '其他'],
    tagList: [{
      south: [],
      central: [],
      north: [],
      east: [],
      northwest: [],
      northeast: [],
      southwest: [],
      others: []
    }],
    uniList: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scrollTop: 100,
    curIndex: 1,
    toView: '',
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
    var tagList = [{
      south: [],
      central: [],
      north: [],
      east: [],
      northwest: [],
      northeast: [],
      southwest: [],
      others: []
    }]
    var uniList = new Object()
    db.collection('control').doc('uni-tag').get({
      success: function(res) {
        console.log('查询标签成功', res)
        tagList.central = res.central
        tagList.east = res.east
        tagList.north = res.north
        tagList.northeast = res.northeast
        tagList.northwest = res.northwest
        tagList.others = res.others
        tagList.south = res.south
        tagList.southwest = res.southwest
      },
      fail: function(res) {
        console.log('查询标签失败', res)
      }
    })
    db.collection('control').doc('uni-items').get({
      success: function(res) {
        console.log('查询列表成功', res, 'length:', res.data.length)
        for(let i=1;i<=res.data.length;i++){
          uniList[i] = res.data[i]
        }
      },
      fail: function(res) {
        console.log('查询列表失败', res)
      }
    })
    this.setData({
      tagList:tagList,
      uniList:uniList
    })
  },

  switchTab: function(e) {
    this.setData({
      curIndex: e.target.dataset.id,
      toView: e.target.dataset.value
    })
  },

  scroll: function(e) {
    console.log(e.detail.scrollTop);
    var heights = this.data.listsHeight;
    var tempValue, tempId;
    for (var i in heights) {
      if (e.detail.scrollTop >= heights[i].height) {
        tempValue = heights[i].value;
        tempId = heights[i].id;
      }
    }
    this.setData({
      curIndex: tempId,
      toViewLeft: tempValue
    });
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
  }

})