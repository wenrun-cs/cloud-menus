// pages/pbmenu/pbmenu.js
import {getInfo,getAdd} from '../../utils/db'
import multiUpload from '../../utils/upload'
const app =getApp()
Page({
  data:{
    srr:[],//图片数组
    menuType:[],//菜谱分类
    files:{},//图片列表
  },
  // 一进页面 拿到菜谱分类
  async onLoad(){
    var result= await getInfo('menuType',{});
    this.setData({
        menuType:result.data,//菜谱分类
    })
  },
  // 图片选择事件
  bindselect(e){
    //拿到网址 并且遍历为对象
    var srr= e.detail.tempFilePaths;
    this.setData({
       srr
    })
    var files=srr.map(item=>{
        return {
          url:item
        }
    })
    // 将遍历好的对象 渲染 照片会呈现在页面上
    this.setData({
      files
    })
  },
  // 表单的数据
  async fbcd(e){
    // 表单信息拿到
    var dv= e.detail.value
    // 上传图片
     var resultf = await  multiUpload(this.data.srr)
     var filelds=resultf.map(item=>{//拿到文件数组
         return item.fileID
     })
    //通过app拿到user的信息
     var user=app.globalData.userinfo
     //  定义好的数据
     var data={
       menuName:dv.menuName,//菜谱名称
       filelds:filelds,//图片
       desc:dv.recipesMake,//描述
       addtime:new Date().getTime(),//时间戳
       nickName:user.nickName,//添加人昵称
       avatarUrl:user.avatarUrl,//添加人头像
       follows:0,//关注数
       views:0,//访问数
       typeId:dv.recipeTypeid,//菜谱分类
     }
    //将数据添加到库中
     var result3= await getAdd('menus',data)
     if(result3){
       wx.showToast({
         title: '添加成功',
         success:res=>{
          wx.switchTab({//跳转到我的页面 显示菜单
            url: '../personal/personal',
          })
         }
       })
      
     }
  }
})