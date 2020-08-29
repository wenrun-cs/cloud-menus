//app.js
App({
   onLaunch(){
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'test-911ln',
        traceUser: true,
      })
      // 判断用户授权登录
      wx.getSetting({
        success:res=>{
           if(res.authSetting['scope.userInfo']){//同意授权登录
              wx.getUserInfo({
                lang:"zh_CN",
                success:res=>{
                   this.globalData.userinfo=res.userInfo;//将值赋给global
                   if(this.userInfoReadyCallback){
                       this.userInfoReadyCallback(res)
                   }
                }
              })
           }else{
              
           }
        }
      })
      // 调用云函数
      wx.cloud.callFunction({
        name:"login",
      }).then(res=>{
          this.globalData.openid=res.result.openid;  //将利用云函数获取到的openid 给了global 
      })
    }
    this.globalData = {
      userinfo:null,
      openid:null
    }
  }
})
