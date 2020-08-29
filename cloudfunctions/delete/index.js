// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db=cloud.database();
// const app=getApp()
// 云函数入口函数
exports.main = async (event, context) => {
    return await db.collection('follow').where({_openid:event.a,menuId:event.b}).remove();//删除
}