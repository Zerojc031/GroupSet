const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.uniList = app.globalData.uniList
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '@金中高三ers，这是你需要的咨询群合集！',
      path: '/pro/index/index'
    }
  },

  bindSearchInput: function (e) {
    console.log("输入内容:", e)
    this.data.value = e.detail.value
    this.data.length = e.detail.cursor
    this.search()
  },

  search: function () {
    let that = this, count = 0
    that.data.pick = 0
    for (let i = 1; i < that.data.uniList.length; i++) {
      if (that.data.length == 0) {
        that.setData({
          pick: 0
        })
        break;
      }
      /**大学列表遍历 */
      console.log(that.data.uniList[i].name, that.data.uniList[i].name.length)
      count = 0
      for (let j = 0; j < that.data.length; j++) {
        /**用户输入的字符串遍历 */
        let count2 = 0 /**标注旗 */
        for (let k = 0; k < that.data.uniList[i].name.length; k++) {
          /**第i个大学名字的字符串遍历 */
          if (that.data.uniList[i].name[k] == that.data.value[j]) {
            /**输入的第j个字符与第i个大学名字的第k个字符匹配 */
            count++
            count2 = 1
            break;
          }
        }
        if (count2 == 0) {
          for (let k = 0; k < that.data.uniList[i].province.length; k++) {
            /**第i个大学地址的字符串遍历 */
            if (that.data.uniList[i].province[k] == that.data.value[j]) {
              /**输入的第j个字符与第i个大学地址的第k个字匹配 */
              count++
              count2 = 1
              break;
            }
          }
        }
        if (count2 == 0) break;
      }
      if (count == that.data.length) {
        /**有匹配结果 */
        that.data.showList[that.data.pick] = that.data.uniList[i]
        that.data.pick++
      }
      if (i == that.data.uniList.length - 1) {
        console.log('搜索完成', that.data.showList)
        that.setData({
          showList: that.data.showList,
          pick: that.data.pick
        })
      }
    }
  },

  tap: function (e) {
    console.log('点击学校', e)
    var that = this
    if (e.currentTarget.dataset.id >= 0) {
      if (this.data.showList[e.currentTarget.dataset.id].isShowQRCode) {
        let imageUrl = that.data.showList[e.currentTarget.dataset.id].src
        wx.previewImage({
          urls: [imageUrl],
          success: function (res2) {
            console.log('打开二维码', imageUrl)
          }
        })
      } else {
        let content = '咨询群已满两百人\n请点击复制添加负责人微信:\n' + that.data.showList[e.currentTarget.dataset.id].wechatID
        wx.showModal({
          title: '点击复制负责人微信号',
          content: content,
          cancelText: '返回',
          confirmText: '复制',
          success: function (res) {
            if (res.confirm) {
              wx.setClipboardData({
                data: that.data.showList[e.currentTarget.dataset.id].wechatID,
              })
            }
          },
          fail: function () {
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
  }
})