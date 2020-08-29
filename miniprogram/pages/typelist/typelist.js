// pages/typelist/typelist.js
import {getInfo} from '../../utils/db'
Page({
    data:{
      typelist:[],//分类数组
      key:''//表单数据
    },
    // 一进页面 拿到分类数据 渲染
    async onLoad(){
       wx.showLoading()//显示
        var result=await getInfo('menuType',{})
        this.setData({
          typelist:result.data
        })  
        wx.hideLoading()//隐藏
    },
    // 点击个别分类 
    totypelist(e){
       const id= e.currentTarget.id
       wx.navigateTo({
         url: '../recipelist/recipelist?id='+id,
       })
      },
      // 点击搜索
      search(){
        wx.navigateTo({
          url: '../recipelist/recipelist?keyword='+this.data.key,
        })
     }
})