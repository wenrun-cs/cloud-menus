// 首先拿到数据库的引用
const db=wx.cloud.database();

// 条件查询
async function getInfo(_collection='',_where={}){
    var result= await db.collection(_collection).where(_where).get();
    return result;  
}
// 通过id查询
async function getByid(_collection='',id){
    return await db.collection(_collection).doc(id).get();
}
// 数据库的添加
async function getAdd(_collection='',data={}){
    return await db.collection(_collection).add(
        {
            data
        }
    );
}
// 数据库的删除 通过id删除
async function getDelete(_collection='',id){
   return await db.collection(_collection).doc(id).remove()
}
// 条件删除
async function getD(_collection='',_where={}){
    return await db.collection(_collection).where(_where).remove()
}
// 数据库修改  通过id
async function getUpdate(_collection='',id,data){
   return await db.collection(_collection).doc(id).update({
         data
   })
}
export  {
    getInfo,
    getByid,
    getAdd,
    getDelete,
    getUpdate,
    getD
}