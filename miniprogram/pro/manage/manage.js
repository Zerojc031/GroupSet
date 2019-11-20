const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    length: 0,
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
    db.collection('control').doc('university').get({
      success: function(res) {
        that.data.control = res.data
        console.log('查询control', res.data)
      }
    })
    db.collection('university').limit(20).skip(0).get({
      success: function(res) {
        console.log('查询数据库成功1', res)
        that.data.arr = res.data
        if (res.data.length == 20) {
          db.collection('university').limit(20).skip(20).get({
            success: function(res) {
              console.log('查询数据库成功2', res)
              for (let i = 0; i < res.data.length; i++) {
                that.data.arr[20 + i] = res.data[i]
              }
              if (res.data.length == 20) {
                db.collection('university').limit(20).skip(40).get({
                  success: function(res) {
                    console.log('查询数据库成功3', res)
                    for (let i = 0; i < res.data.length; i++) {
                      that.data.arr[40 + i] = res.data[i]
                    }
                    if (res.data.length == 20) {
                      db.collection('university').limit(20).skip(60).get({
                        success: function(res) {
                          console.log('查询数据库成功4', res)
                          for (let i = 0; i < res.data.length; i++) {
                            that.data.arr[60 + i] = res.data[i]
                          }
                          if (res.data.length == 20) {
                            db.collection('university').limit(20).skip(80).get({
                              success: function(res) {
                                console.log('查询数据库成功5', res)
                                for (let i = 0; i < res.data.length; i++) {
                                  that.data.arr[80 + i] = res.data[i]
                                }
                                if (res.data.length == 20) {
                                  db.collection('university').limit(20).skip(100).get({
                                    success: function(res) {
                                      console.log('查询数据库成功6', res)
                                      for (let i = 0; i < res.data.length; i++) {
                                        that.data.arr[100 + i] = res.data[i]
                                      }
                                      if (res.data.length == 20) {
                                        db.collection('university').limit(20).skip(120).get({
                                          success: function(res) {
                                            console.log('查询数据库成功7', res)
                                            for (let i = 0; i < res.data.length; i++) {
                                              that.data.arr[120 + i] = res.data[i]
                                            }
                                            that.data.length += res.data.length
                                          },
                                          fail: function(res) {
                                            console.log('查询失败7')
                                          }
                                        })
                                      }
                                      that.data.length += res.data.length
                                    },
                                    fail: function(res) {
                                      console.log('查询失败6')
                                    }
                                  })
                                }
                                that.data.length += res.data.length
                              },
                              fail: function(res) {
                                console.log('查询失败5')
                              }
                            })
                          }
                          that.data.length += res.data.length
                        },
                        fail: function(res) {
                          console.log('查询失败4')
                        }
                      })
                    }
                    that.data.length += res.data.length
                  },
                  fail: function(res) {
                    console.log('查询失败3')
                  }
                })
              }
              that.data.length += res.data.length
            },
            fail: function(res) {
              console.log('查询失败2')
            }
          })
        }
        that.setData({
          length: that.data.length + res.data.length,
          arr: that.data.arr
        })
      },
      fail: function(res) {
        console.log('查询失败1')
      }
    })
  },
  check: function() {
    var that = this
    wx.showLoading({
      title: '更新中',
      success: function() {
        console.log('control:', that.data.control)
        console.log('arr:', that.data.arr)
        that.data.control.uniList = that.data.arr
      },
      complete: function() {
        wx.hideLoading()
        wx.showToast({
          title: '更新完成',
          duration: 500,
        })
      }
    })
  },
  show: function(e) {
    console.log('发布', e)
  },
  hide: function(e) {
    console.log('撤下', e)
  },
  showID: function(e) {
    console.log('显示微信号隐藏二维码', e)
  },
  hideID: function(e) {
    console.log('隐藏微信号显示二维码', e)
  },
  manage:function(e){
    console.log('长按管理',e)
    let temp_id=e.currrentTarget.id
    // wx.showModal({
    //   title: '操作',
    //   content: '',
    // })
    //模拟对话框的右边 发布/撤下，左边 显示/隐藏 二维码/微信号
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

  }
})