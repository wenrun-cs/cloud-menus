// pages/recipelist/recipelist.js
const db=wx.cloud.database()
import {getByid} from '../../utils/db'
Page({
  data:{
      slist:[],//需要渲染的页面
      page:0,//页数
      pageSize:4,//每次请求数量
      e:null//页面传来的参数
  },
  // 一进页面 拿到传来的值 根据值 搜索数据
  async onLoad(e){
    this.setData({
       e:e  //渲染参数
    })
    wx.showLoading({title: '正在加载',}) //显示加载
    this.getList(e);
  },
  // 点击去详情
  todetail(e){
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id='+e.currentTarget.id,
    })
  },
  // 刷新页面  请求 第一页数据
  onPullDownRefresh(){
    var e =this.data.e;
    wx.showLoading({title: '正在加载',}) //显示加载
    this.getList(e);
    wx.stopPullDownRefresh()//  取消下拉
  },
  // 触底加载更多
  onReachBottom(){
      wx.showLoading({
        title: '加载更多',
      })  
      this.data.page+=1;
      this.getList(this.data.e)
  },
  // 获取数据函数
  async getList(e){
    var page=this.data.page;
    var pageSize=this.data.pageSize;
    if(e.keyword){
      let keyword=e.keyword;
      if(keyword=='tj'){//点的首页推荐
         var result =await db.collection('menus').orderBy("views","desc").skip(page*pageSize).limit(pageSize).get()
         await wx.setNavigationBarTitle({
          title:'推荐热门菜谱'
        })
      }else{//普通的传过来keyword值
        var result= await db.collection('menus').where({
          menuName:db.RegExp({
             regexp:keyword,
             options:"i"
          })
        }).skip(page*pageSize).limit(pageSize).get()
        await wx.setNavigationBarTitle({
          title:'相关菜谱'
        })
      }
    }else{//传递的是id
      let id=e.id;
      var result = await  db.collection('menus').where({typeId:id}).skip(page*pageSize).limit(pageSize).get();
      var name=await getByid('menuType',id);
      await wx.setNavigationBarTitle({
        title: name.data.typeName
      })
    }
    this.setData({
      slist:this.data.slist.concat(result.data)
    })
    wx.hideLoading()//加载完成 消失loading
  }
})