var that;
var app = getApp();

Page({
  
  data: {
    showPage:false,
    workslist:[],
    workStatus: false,
    articleList:[],
    articleStatus: false,
    requestStatus:false,
    listLimit:0,
    moreStatus:false,
    base:5,
    linkList:[
      { title: "前端笔记", icon: "icon-font-note", typeid: 1 },
      { title: "转载分享", icon: "icon-font-share", typeid: 5 },
      { title: "生活锁事", icon: "icon-font-life last", typeid: 3 }
    ]
  },
 
  onLoad: function (options) {

    wx.showLoading();

    that = this;
    // 获取首页推荐的*4*个作品
    wx.request({
      url: "http://jingjingke.com/api/list.php",
      data:{
        typeid:2,
        flag:true
      },
      success:function(rs){
        that.setData({
          workslist:rs.data,
          workStatus:true
        })
        // 如果这个获取了结果并且判断文章列表也OK
        if (that.data.articleStatus === true){
          that.setData({
            showPage:true
          })
          wx.hideLoading()
        }
      }
    })
    // 获取首页最新的若干文章
    that.getArticleList();
  },
  getArticleList(){
    // 获取首页最新的若干文章
    wx.request({
      url: "http://jingjingke.com/api/list.php",
      data: {
        typeid: 1,
        limit: this.data.listLimit + ',' + this.data.base
      },
      success: function (rs) {
        var arr = that.data.articleList.concat(rs.data)
        that.setData({
          articleList: arr,
          articleStatus: true,
          requestStatus:false
        })
        // 如果这个获取了结果并且判断作品列表也OK
        if (that.data.workStatus === true && that.data.showPage === false) {
          that.setData({
            showPage: true
          })
          wx.hideLoading()
        }
        // 如果请求的条数不足基数（默认5条）则表示没有更多，或者条件达到限制条件时更新状态
        if (rs.data.length < that.data.base || that.data.articleList.length === that.data.base * 4
        ){
          that.setData({
            moreStatus:true,
            requestStatus:true
          })
        }
      }
    })
  },
  onReachBottom: function () {
    // 滑至底部判断文章列表的请求状态以及条件
    if (that.data.requestStatus === false && that.data.listLimit <= that.data.base*3){
      that.setData({
        requestStatus:true,
        listLimit: that.data.listLimit + that.data.base
      })
      this.getArticleList();
    } else if (that.data.moreStatus === false || that.data.listLimit > that.data.base * 3){
      that.setData({
        moreStatus:true
      })
    }
  },

  articleListTap: app.articleListTap,
  
  // 跳至分类列表（常规列表）
  goTypeidList:function(event){
    wx.navigateTo({
      url: "../list/index?info=" + JSON.stringify(event.currentTarget.dataset.info)
    })
  }
})