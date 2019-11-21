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
        console.log('arr:', that.data.arr)
        db.collection('control').doc('university').get({
          success: function(res) {
            that.data.control = res.data
            console.log('查询control', res.data)
            // that.data.control.central=res.data.central
            // that.data.control.east=res.data.east
            // that.data.control.south=res.data.south
            // that.data.control.north=res.data.north
            // that.data.control.northeast=res.data.northeast
            // that.data.control.northwest=res.data.northwest
            // that.data.control.southwest=res.data.southwest
            // that.data.control.others=res.data.others
            // that.data.control.uniList = that.data.arr
            for (let i = 0; i < that.data.length; i++) {
              that.data.control.uniList[i] = that.data.arr[i]
              that.data.control.uniList[i].isOnShow = res.data.uniList[i].isOnShow
              if (i == that.data.length - 1) {
                that.setData({
                  control: that.data.control,
                })
                console.log('更新control完成', that.data.control)
              }
            }
          }
        })
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
    console.log('发布', e.target.id)
    this.data.control.uniList[e.target.id].isOnShow = true
    if (this.data.control.uniList[e.target.id].tag == 'south') {
      for (let i = 0; i < this.data.control.south.length; i++) {
        if (this.data.control.south[i] == e.target.id) {
          console.log('已发布过', e.target.id)
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          break;
        }
        if (i == this.data.control.south.length - 1) {
          this.data.control.south[i + 1] = e.target.id
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          console.log('未发布过', e.target.id)
          break;
        }
      }
    } else if (this.data.control.uniList[e.target.id].tag == 'central') {
      for (let i = 0; i < this.data.control.central.length; i++) {
        if (this.data.control.central[i] == e.target.id) {
          console.log('已发布过', e.target.id)
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          break;
        }
        if (i == this.data.control.central.length - 1) {
          this.data.control.central[i + 1] = e.target.id
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          console.log('未发布过', e.target.id)
          break;
        }
      }
    } else if (this.data.control.uniList[e.target.id].tag == 'north') {
      for (let i = 0; i < this.data.control.north.length; i++) {
        if (this.data.control.north[i] == e.target.id) {
          console.log('已发布过', e.target.id)
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          break;
        }
        if (i == this.data.control.north.length - 1) {
          this.data.control.north[i + 1] = e.target.id
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          console.log('未发布过', e.target.id)
          break;
        }
      }
    } else if (this.data.control.uniList[e.target.id].tag == 'east') {
      for (let i = 0; i < this.data.control.east.length; i++) {
        if (this.data.control.east[i] == e.target.id) {
          console.log('已发布过', e.target.id)
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          break;
        }
        if (i == this.data.control.east.length - 1) {
          this.data.control.east[i + 1] = e.target.id
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          console.log('未发布过', e.target.id)
          break;
        }
      }
    } else if (this.data.control.uniList[e.target.id].tag == 'northeast') {
      for (let i = 0; i < this.data.control.northeast.length; i++) {
        if (this.data.control.northeast[i] == e.target.id) {
          console.log('已发布过', e.target.id)
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          break;
        }
        if (i == this.data.control.northeast.length - 1) {
          this.data.control.northeast[i + 1] = e.target.id
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          console.log('未发布过', e.target.id)
          break;
        }
      }
    } else if (this.data.control.uniList[e.target.id].tag == 'northwest') {
      for (let i = 0; i < this.data.control.northwest.length; i++) {
        if (this.data.control.northwest[i] == e.target.id) {
          console.log('已发布过', e.target.id)
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          break;
        }
        if (i == this.data.control.northwest.length - 1) {
          this.data.control.northwest[i + 1] = e.target.id
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          console.log('未发布过', e.target.id)
          break;
        }
      }
    } else if (this.data.control.uniList[e.target.id].tag == 'southwest') {
      for (let i = 0; i < this.data.control.southwest.length; i++) {
        if (this.data.control.southwest[i] == e.target.id) {
          console.log('已发布过', e.target.id)
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          break;
        }
        if (i == this.data.control.southwest.length - 1) {
          this.data.control.southwest[i + 1] = e.target.id
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          console.log('未发布过', e.target.id)
          break;
        }
      }
    } else if (this.data.control.uniList[e.target.id].tag == 'others') {
      for (let i = 0; i < this.data.control.others.length; i++) {
        if (this.data.control.others[i] == e.target.id) {
          console.log('已发布过', e.target.id)
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          break;
        }
        if (i == this.data.control.others.length - 1) {
          this.data.control.others[i + 1] = e.target.id
          this.setData({
            control: this.data.control
          })
          this.upLoad()
          console.log('未发布过', e.target.id)
          break;
        }
      }
    }
  },
  hide: function(e) {
    console.log('撤下', e.target.id)
    this.data.control.uniList[e.target.id].isOnShow = false
    this.setData({
      control: this.data.control
    })
    this.upLoad()
  },
  upLoad: function() {
    var that = this
    db.collection('control').doc('university').update({
      data: {
        central: that.data.control.central,
        east: that.data.control.east,
        north: that.data.control.north,
        northeast: that.data.control.northeast,
        northwest: that.data.control.northwest,
        others: that.data.control.others,
        south: that.data.control.south,
        southwest: that.data.control.southwest,
        uniList: that.data.control.uniList,
      },
      success: function() {
        wx.showToast({
          title: '成功',
          duration: 500,
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '失败',
          duration: 500,
          icon: 'none'
        })
        console.log('上传失败', res)
      }
    })
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