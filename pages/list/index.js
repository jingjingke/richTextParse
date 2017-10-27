var that;
var app = getApp();

Page({

  data: {
    showPage: false,
    tagList: [],
    tagStatus: false,
    articleList: [],
    articleStatus: false,
    requestStatus: false,
    listLimit: 0,
    moreStatus: false,
    base: 10,
    typeid: ''
  },

  onLoad: function (options) {
    options.info = JSON.parse(options.info);
    wx.setNavigationBarTitle({
      title: options.info.title
    })
    wx.showLoading()
    that = this;

    // 获取typeid
    that.setData({
      typeid:options.info.typeid
    })

    // 获取列表包含的TAGs
    wx.request({
      url: "http://jingjingke.com/api/tag.php",
      data: {
        typeid: that.data.typeid
      },
      success: function (rs) {
        that.setData({
          tagList: rs.data,
          tagStatus: true
        })
        // 如果这个获取了结果并且判断文章列表也OK
        if (that.data.articleStatus === true) {
          that.setData({
            showPage: true
          })
          wx.hideLoading()
        }
      }
    })

    // 首次获取文章列表
    that.getArticleList();
  },
  getArticleList() {
    // 获取首页最新的若干文章
    wx.request({
      url: "http://jingjingke.com/api/list.php",
      data: {
        typeid: that.data.typeid,
        limit: this.data.listLimit + ',' + this.data.base
      },
      success: function (rs) {
        var arr = that.data.articleList.concat(rs.data)
        that.setData({
          articleList: arr,
          articleStatus: true,
          requestStatus: false
        })
        // 如果这个获取了结果并且tag列表也OK
        if (that.data.tagStatus === true && that.data.showPage === false) {
          that.setData({
            showPage: true
          })
          wx.hideLoading()
        }
        // 如果请求的条数不足基数则表示没有更多,更新状态
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
      this.getArticleList();
    } else if (that.data.moreStatus === false) {
      that.setData({
        moreStatus: true
      })
    }
  },

  tagListTap: app.tagListTap,
  articleListTap: app.articleListTap

})