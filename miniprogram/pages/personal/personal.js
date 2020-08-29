// pages/personal/personal.js
// 拿到app
  const app=getApp()
  const db=wx.cloud.database()
  import {getInfo,getDelete,getByid,getD} from '../../utils/db'
Page({
  data: {
     userinfo:null, //用户信息
     tabarr:['菜谱','分类','关注'], //选项卡选项
     id:0,//拿到的id
     menutype:[],//分类数组
     menus:[],//菜谱数组
     guanzhu:[]//关注的数组
    },
  login(e){
      this.setData({
        userinfo:e.detail.userInfo,
      })
  },
  // 一进页面 那登陆的信息
  onLoad(){//、检验globaldata中是否存在数据 
    if(app.globalData.userinfo!=null){
        this.setData({//存在即渲染
            userinfo:app.globalData.userinfo,
        })
    }else{
       app.userInfoReadyCallback=res=>{
         this.setData({
           userinfo:res.userInfo,
         })
       } 
    }
    
  },
  // 一进页面渲染数据
  async onShow(){
    //用户的openid 从数据库中拿菜谱的数据
    var resultm=await getInfo('menus',{_openid:app.globalData.openid})
    this.setData({
      menus:resultm.data //渲染
    })
    //用户的openid从数据库拿数据 渲染分类的menutype
      var result=await getInfo("menuType",{_openid:app.globalData.openid})
      this.setData({
         menutype:result.data
      })
  // 封装函数  获取关注数据并且渲染
      this.getguanzhu()  
  },
  // 点击头像 跳转到分类页面
  fbcpfl(){
     wx.navigateTo({
       url: '../pbmenutype/pbmenutype',
     })
  },
  // 点击选项卡 切换内容
  click(e){
     this.setData({
        id:e.currentTarget.id
     })
  },
  // 点击加号 添加菜单
  pbmenu(){
    // 跳转到添加菜单页
     wx.navigateTo({
       url: '../pbmenu/pbmenu',
     })
  },
  // 删除菜谱
  async delCdlb(e){
    const {id,index,files} = e.currentTarget.dataset;
    // 将数组遍历加上属性名
    wx.showModal({
      title:'你确定要删除吗？',
      success:async res=>{
         if(res.confirm){
            //拿到id 删除数据库中的数据
            var resultd=await  getDelete("menus",id);
            // 删除数据库中的照片
            wx.cloud.deleteFile({
              fileList:files
            })
            if(resultd){
              wx.showToast({
                title: '删除成功',
              })  
              // 用index 删除数组中的数据 重新渲染页面
              this.data.menus.splice(index,1)
              this.setData({
                  menus:this.data.menus
              }) 
              // 改变关注界面的数据 
              await getD("follow",{menuId:id});
              // 重新渲染
              this.getguanzhu()
            }
         }
      }
    })
    
  },
  // 点击菜谱 跳转到详情
  todetail(e){
    //跳转到详情页
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id='+e.currentTarget.id,
    })  
  },
  //去是此分类菜谱的详情页
  totype(e){
    var id=e.currentTarget.id;//获取id
    // 跳转到详情页面
    wx.navigateTo({
      url: '../recipelist/recipelist?id='+id,
    })
  },
  // 封装函数  获取关注数据并且渲染
  async getguanzhu(){
    // 根据用户的openid从数据库中拿到所关注的菜单列表
    var result=await  getInfo('follow',{_openid:app.globalData.openid}) 
    var resda=result.data
    //将拿到的menuid 渲染成新数组 赋值给guanzhu
    var resarr=resda.map(item=>{
        return item.menuId 
    })
    // 新方法 查询in方法
    await getInfo("menus",{
        _id:db.command.in(resarr)
    }).then(res=>{//查询成功
      this.setData({
        guanzhu:res.data//渲染
      })
    }) 
  }
})