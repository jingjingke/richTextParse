//app.js
var richTextParse = require('utils/richTextParse/richText.js');
App({
  // 文章列表点击事件(进入文章页)
  articleListTap:function(event){
    wx.navigateTo({
      url: "../article/index?info=" + JSON.stringify(event.currentTarget.dataset.info)
    })
  },

  // tag列表点击事件
  tagListTap: function (event) {
    wx.navigateTo({
      url: "../tag/index?info=" + JSON.stringify(event.currentTarget.dataset.info)
    })
  },

  //将获取到的html文本转换成rich-text可以识别的数组对象
  // richTextParse:function(data){
    
  // },
  richTextParse:richTextParse.go,

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})