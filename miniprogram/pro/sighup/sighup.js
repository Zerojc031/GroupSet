const app = getApp()
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [{
      value: 'south',
      id: 1,
      name: '华南'
    }, {
      value: 'central',
      id: 2,
      name: '华中'
    }, {
      value: 'north',
      id: 3,
      name: '华北'
    }, {
      value: 'east',
      id: 4,
      name: '华东'
    }, {
      value: 'southwest',
      id: 5,
      name: '西南'
    }, {
      value: 'northwest',
      id: 6,
      name: '西北'
    }, {
      value: 'northeast',
      id: 7,
      name: '东北'
    }, {
      value: 'others',
      id: 8,
      name: '其他'
    }],
    submit: [{
      name: null,
      wechatID: null,
      tag: null,
      province: null,
      src: '',
      times:null,
    }],
    isDone: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    if (!app.globalData.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
          db.collection('university').doc(app.globalData.openid).get({
            success: function(event) {
              console.log('查询成功', event.data)
              that.data.submit.name=event.data.name
              that.data.submit.province=event.data.province
              that.data.submit.tag=event.data.tag
              that.data.submit.src=event.data.src
              that.data.submit.wechatID=event.data.wechatID
              that.data.submit.times=event.data.times
            },
            fail: function(event) {
              that.data.isDone = false
            }
          })
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
  bindNameInput: function(e) {
    this.data.submit.name = e.detail.value
  },
  bindWechatIDInput: function(e) {
    this.data.submit.wechatID = e.detail.value
  },
  radioChange: function(e) {
    this.data.submit.tag = e.detail.value
  },
  bindProvinceInput: function(e) {
    this.data.submit.province = e.detail.value
  },
  upLoadQRCode: function(e) {
      var that = this
      wx.chooseImage({
        count: 1,
        sizeType: 'compressed',
        sourceType: 'album',
        success: function(res) {
          let cloudPathID = 'university/' + app.globalData.openid + '.png'
          wx.cloud.uploadFile({
            cloudPath: cloudPathID,
            filePath: res.tempFilePaths[0],
            success: function(event) {
              console.log('上传图片成功', res.tempFilePaths[0])
              that.data.submit.src = event.fileID
              wx.showToast({
                title: '上传成功',
                duration: 3000,
              })
            },
            fail: function(event) {
              console.log('上传图片失败', event)
              wx.showToast({
                title: '失败请重新上传',
                icon: 'none',
                duration: 3000,
              })
            }
          })
        },
      })
  },
  submit: function() {
    console.log('submit', this.data.submit)
    if (this.data.submit.wechatID == null || this.data.submit.province == null || this.data.submit.name == null || this.data.submit.tag == null || this.data.submit.src == null) {
      wx.showToast({
        title: '请填写所有信息',
        icon: 'none',
        duration: 2000,
      })
    } else {
      var that = this
      var content = this.data.submit.name + '+' + this.data.submit.wechatID + '+' + this.data.submit.tag + '+' + this.data.submit.province
      wx.showModal({
        title: '确认信息是否填写正确⚠',
        content: content,
        cancelText: '返回',
        confirmText: '提交',
        success: function(res) {
          if (res.confirm) {
            if (that.data.isDone == false) {
              db.collection('university').add({
                data: {
                  wechatID: that.data.submit.wechatID,
                  _id: app.globalData.openid,
                  name: that.data.submit.name,
                  tag: that.data.submit.tag,
                  province: that.data.submit.province,
                  src: that.data.submit.src,
                  times: that.data.submit.times+1,
                },
                success: function(event) {
                  console.log('提交成功', event)
                  wx.showToast({
                    title: '提交成功',
                    duration: 2500,
                  })
                },
                fail: function(event) {
                  console.log('提交失败', event)
                  wx.showToast({
                    title: '失败#2',
                    icon: 'none',
                    duration: 3000,
                  })
                },
              })
            } else if (that.data.isDone == true) {
              db.collection('university').doc(app.globalData.openid).update({
                data: {
                  wechatID: that.data.submit.wechatID,
                  name: that.data.submit.name,
                  tag: that.data.submit.tag,
                  province: that.data.submit.province,
                  src: that.data.submit.src,
                  times: 1,
                },
                success: function(event) {
                  console.log('提交成功', event)
                  wx.showToast({
                    title: '提交成功',
                    duration: 2500,
                  })
                },
                fail: function(event) {
                  console.log('提交失败', event)
                  wx.showToast({
                    title: '失败#3',
                    icon: 'none',
                    duration: 3000,
                  })
                },
              })
            }
          }
        },
        fail: function(res) {
          console.log('失败#1', res)
        }
      })
    }
  },
})