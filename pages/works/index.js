var that;
var app = getApp();

Page({

  data: {
    showPage: false,
    tagList: [],
    tagStatus: false,
    worksList: [],
    workStatus: false,
    requestStatus: false,
    listLimit: 0,
    moreStatus: false,
    base: 10
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '网页作品'
    })
    wx.showLoading();
    that = this;

    // 获取作品列表TAGs
    wx.request({
      url: "http://jingjingke.com/api/tag.php",
      data: {
        typeid: 2
      },
      success: function (rs) {
        that.setData({
          tagList: rs.data,
          tagStatus: true
        })
        // 如果这个获取了结果并且判断文章列表也OK
        if (that.data.workStatus === true) {
          that.setData({
            showPage: true
          })
          wx.hideLoading()
        }
      }
    })
    // 获取首页最新的若干文章
    that.getWorksList();
  },
  getWorksList() {
    // 获取首页最新的若干文章
    wx.request({
      url: "http://jingjingke.com/api/list.php",
      data: {
        typeid: 2,
        limit: this.data.listLimit + ',' + this.data.base
      },
      success: function (rs) {
        var arr = that.data.worksList.concat(rs.data)
        that.setData({
          worksList: arr,
          workStatus: true,
          requestStatus: false
        })
        // 如果这个获取了结果并且tag列表也OK
        if (that.data.tagStatus === true && that.data.showPage === false) {
          that.setData({
            showPage: true
          })
          wx.hideLoading()
        }
        // 如果请求的条数不足基数（默认5条）则表示没有更多，更新状态
        if (rs.data.length < that.data.base) {
          that.setData({
            moreStatus: true,
            requestStatus: true
          })
        }
      }
    })
  },
  onReachBottom: function () {
    // 滑至底部判断文章列表的请求状态以及条件
    if (that.data.requestStatus === false) {
      that.setData({
        requestStatus: true,
        listLimit: that.data.listLimit + that.data.base
      })
      this.getWorksList();
    } else if (that.data.moreStatus === false) {
      that.setData({
        moreStatus: true
      })
    }
  },

  tagListTap: app.tagListTap,
  articleListTap: app.articleListTap

})