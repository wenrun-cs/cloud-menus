// 引入数据库添加函数
import {getAdd,getInfo,getDelete,getUpdate,getByid} from '../../utils/db'
Page({
  data: {
     add:false,//是否显示添加
     update:false,//是否显示修改
     menuname:null, //添加的名
     updatename:null,//修改的名
     MenuTypeList:[], //列表
     menuid:null//拿到的要修改的id
  },
  // 一进页面  渲染分类列表
  async onLoad(){
     wx.showLoading() //显示加载
     this.setData({
        MenuTypeList:await (await this.getlist()).data  //调用函数 渲染页面 
     })
     wx.hideLoading()//渲染成功 loading消失
  },
  //点击加号 出现弹框
  addMenuType(){
    //让添加按钮显示出来
  this.setData({
     add:true
  }) 
  },
  // 点击添加按钮 添加菜单
  async addmenuname(){
     var data={
      typeName:this.data.menuname,
      addtime:new Date().getTime()
     }
    var result=await getAdd("menuType",data); //拿到添加完的结果
     if(result!=null){//添加成功
      // 弹出添加成功 
      wx.showToast({
         title: '添加成功',
       })
      // 将添加的框框隐藏 顺便重新渲染分类的数据
      this.setData({
        add:false,
        menuname:null
      })
      //重新渲染分类数据
      wx.showLoading() //显示加载
      this.setData({
        MenuTypeList:await (await this.getlist()).data  //调用函数 渲染页面 
      })
      wx.hideLoading()//渲染成功 loading消失
    }
  },
  // 点击修改按钮 出来弹框
  async updateMenuType(e){
    // 根据点击拿到的id  拿到相应的菜名 并赋值
    this.setData({
      menuid:e.currentTarget.id
    })
    var result2=await getByid('menuType',this.data.menuid);//拿到该id下的结果
     //修改窗口弹出
    this.setData({
      update:true,
      updatename:result2.data.typeName ///将拿到的分类名渲染进框里
    })
     
  },
 // 点击修改  进行修改
 async   updatemenuname(){
var data={
  typeName:this.data.updatename,
  addtime:new Date().getTime()
 }
var result4=await getUpdate('menuType',this.data.menuid,data);
// 请求成功  再次渲染一遍页面
   this.setData({
     MenuTypeList:await (await this.getlist()).data,
     update:false //消失修改框框
   })
  //  提示修改成功
   wx.showToast({
     title: '修改成功',
   })
  },  
  // 点击删除按钮
  async deletemenuname(e){
     wx.showModal({
      title: '确定要删除吗？',
      success:async res=>{
         if(res.confirm){
           //同意删除
           console.log(e)
           var result6=await getDelete('menuType',e.currentTarget.id) 
          if(result6!=null){
         wx.showLoading()//显示加载
          wx.showToast({
           title: '删除成功',
        })
        this.setData({
           MenuTypeList:await (await this.getlist()).data
        })
       wx.hideLoading()//隐藏loading
     }
         }
      }
    })
  },
  // 拿到数据库中的数据
  async getlist(){
     var result1=await getInfo('menuType',{});
     return result1;//返回的分类数据
  }
})