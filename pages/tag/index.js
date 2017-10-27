var that;
var app = getApp();

Page({

  data: {
    showPage: false,
    articleList: [],
    articleStatus: false,
    requestStatus: false,
    listLimit: 0,
    moreStatus: false,
    base: 10,
    tagid: '',
    showMore: true
  },

  onLoad: function (options) {
    console.log(options)
    options.info = JSON.parse(options.info);
    wx.setNavigationBarTitle({
      title: options.info.tag
    })
    wx.showLoading()
    that = this;

    // 获取tagid
    that.setData({
      tagid: options.info.id
    })

    // 首次获取文章列表
    that.getArticleList();
  },
  getArticleList() {
    // 获取首页最新的若干文章
    wx.request({
      url: "http://jingjingke.com/api/list.php",
      data: {
        tagid: that.data.tagid,
        limit: this.data.listLimit + ',' + this.data.base
      },
      success: function (rs) {
        var arr = that.data.articleList.concat(rs.data)
        that.setData({
          articleList: arr,
          articleStatus: true,
          requestStatus: false
        })
        // 更新页面显示的状态
        if (that.data.showPage === false) {
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

        //判断条数不足5条(一屏就能显示的下)时则不显示更新
        console.log(that.data.articleList.length)
        if (that.data.articleList.length < 5){
          that.setData({
            showMore:false
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

  articleListTap: app.articleListTap

})