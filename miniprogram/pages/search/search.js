// 连接数据库
const db=wx.cloud.database()
Page({
  data:{
     keyword:"", //输入框的内容
     hotlist:[], //热门搜索
     lastlist:[]//最近搜索 数组
  },
  // 一进页面加载
  async onShow(){
    // 查看热度较高的 进行热门搜索
    var result = await db.collection('menus').orderBy("views","desc").limit(9).get();
    // 查看最近搜索
    var arr=wx.getStorageSync('keywords') || []
    this.setData({
      hotlist:result.data, //渲染数组
      lastlist:arr
    })
  },
  // 点击搜索 
  search(){
    var keyword=this.data.keyword
    // 第er部 临时存储数据 
    var arr=wx.getStorageSync('keywords') || []
    // 判断内容是否存在
    var index= arr.findIndex(item=>{
       return item==keyword
    })
    if(index!=-1){
       arr.splice(index,1)
    }
    arr.unshift(keyword)
    wx.setStorageSync('keywords', arr)

    //清空表单
    this.setData({
       keyword:''
    })
     //最后一步 跳转页面
     wx.navigateTo({
      url: '../recipelist/recipelist?keyword='+keyword
      })
   
  },
  // 近期搜索 跳转页面
  todetail(e){
      //最后一步 跳转页面
      wx.navigateTo({
        url: '../recipelist/recipelist?keyword='+e.currentTarget.dataset.key
      })
  },
  // 热门 跳转详情
  todetailT(e){
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id='+e.currentTarget.id,
    })
  }
})