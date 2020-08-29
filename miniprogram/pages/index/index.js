const db=wx.cloud.database()
Page({
   data:{
       menus:[], //菜谱信息数组
       page:0,//页数
       pageSize:6,//数据个数
       key:''//搜索
   },//
   async onShow(){
      wx.showLoading();//显示loading
      //获取第一页的内容
      this.data.page=0;
      let {page,pageSize}=this.data
      this.getList(page,pageSize)
   },
  // 下拉刷新
   async onPullDownRefresh(){
     //获取第一页的内容
     this.data.page=0;
     let {page,pageSize}=this.data
     this.getList(page,pageSize)
    wx.showToast({
      title: '刷新成功',
    })
    wx.stopPullDownRefresh()//停止刷新 
   },
   //点击跳转详情    
   todetail(e){
       wx.navigateTo({
         url: '../recipeDetail/recipeDetail?id='+e.currentTarget.id,
       })
   },
  //触底 加载更多
  onReachBottom(){
    wx.showLoading();//显示loading
    this.data.page+=1;
    this.getList(this.data.page,this.data.pageSize);
  },
  // 获取列表数据
  async getList(page,pageSize){
    var result = await db.collection('menus').skip(page*pageSize).limit(pageSize).get()
    wx.hideLoading()//消失loading
    if(page==0){
      this.setData({
        menus:result.data //渲染上去 
      })
    }else{
      this.setData({
        menus:this.data.menus.concat(result.data) //渲染上去 
      })
    }
      
  },
  // 点击跳转菜谱分类
  typelist(){
     wx.navigateTo({
       url: '../typelist/typelist',
     })
  },
  //跳转到菜谱列表
  totypelist(e){
     if(e.currentTarget.id=="tj"){
         wx.navigateTo({
           url: '../recipelist/recipelist?keyword='+'tj',
         })
     }else{
        wx.navigateTo({
          url: '../recipelist/recipelist?id='+e.currentTarget.id,
        })
     }
  },
  // 点击搜索
  search(){
    wx.navigateTo({
      url: '../recipelist/recipelist?keyword='+this.data.key,
    }) 
    // 清空key
    this.setData({
      key:""
    })
  }
})