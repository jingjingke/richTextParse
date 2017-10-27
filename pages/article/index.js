var that;
var app = getApp();

Page({

  data: {
    showPage: false,
    id:'',
    data:{},
    nodeBody:'',
    bodyHtml:''
  },

  onLoad: function (options) {
    options.info = JSON.parse(options.info);
    wx.setNavigationBarTitle({
      title: options.info.title
    })
    wx.showLoading()
    that = this;

    // 获取文章ID并赋值
    that.setData({
      id: options.info.aid
    })

    // 获取详情
    wx.request({
      url: "http://jingjingke.com/api/article.php",
      data:{
        aid:that.data.id
      },
      success:function(rs){
        that.setData({
          data: rs.data,
          bodyHtml: app.richTextParse(rs.data.body),
          showPage: true
        })
        wx.hideLoading()
      }
    })
    
  }
})