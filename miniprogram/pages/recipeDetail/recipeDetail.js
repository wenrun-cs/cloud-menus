// pages/recipeDetail/recipeDetail.js
import {
  getByid,
  getAdd,
  getInfo
} from '../../utils/db'
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    uid: null, //菜谱id
    detail: {}, //菜谱详情
    guanzhu: false
  },
  // 一进页面  拿到id  加载相关数据
  async onLoad(options) {
    wx.showLoading(); //加载loading
    this.setData({
      uid: options.id //渲染给data
    })
    
    // 将拿到的数据渲染到页面
    var result = await getByid('menus', options.id)
    this.setData({
      detail: result.data
    })
    // 改变标题
    wx.setNavigationBarTitle({
      title: this.data.detail.menuName,
    })
    wx.hideLoading() //加载成功消失loading
    // 判断该用户是否关注菜谱 进行渲染
    var getresult = await getInfo('follow', {
      _openid: app.globalData.userinfo.openid,
      menuId: this.data.uid
    })
    if (getresult.data.length>0) { //数据库有值  代表已经关注
      this.setData({
        guanzhu: true
      })
    }
    //  利用 云开发 inc 使浏览加1
     this.inc('views',1)
  },
  // 点击关注
  async guan() {
    
    if (!this.data.guanzhu) { //点关注
      // 将此用户的id和菜谱id一起存入follow库中
      var data = {
        menuId: this.data.uid,
        addTime: new Date().getTime()
      }
      var resultl = await getAdd("follow", data)
      if (resultl){
        wx.showToast({
          title: '关注成功',
        })
        // 改变按钮
        this.setData({
          guanzhu: !this.data.guanzhu
        })
        //  利用 云开发 inc 使收藏加1
       this.inc('follows',1)
      }
    } else { //点取消
      //根据云函数 删除（因为涉及where  所以是批量删除 用云函数）
      wx.cloud.callFunction({
        name: 'delete',
        data: {
          a: app.globalData.userinfo.openid,
          b: this.data.uid
        },
        success:async res => {
          wx.showToast({
            title: '取消成功' //展示弹出框
          }) 
          // 改变按钮 
          this.setData({
            guanzhu: !this.data.guanzhu
          })
          // //  利用 云开发 inc 使收藏减1
         this.inc('follows',-1);
        },
      })
    }
    
  },
  // 封装加减收藏 或浏览量的函数
   inc(attr,num){
     //  利用 云开发 inc 使收藏减1
     const _ = db.command
     let data = {}
     data[attr] = _.inc(num)
     db.collection('menus').doc(this.data.uid).update({
       data,
       success: async res => {
         //重新渲染页面
         var resultn = await getByid('menus', this.data.uid)
         this.setData({
           detail: resultn.data
         })
       }
     })
  }

})