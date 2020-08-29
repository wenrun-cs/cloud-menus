// 图片批量上传
async function multiUpload(tempFilePaths){
    var arr=[];
    tempFilePaths.forEach(item=>{
        var filename=new Date().getTime();
        var ext=item.split('.').pop();
        var item1=wx.cloud.uploadFile({
            filePath:item,
            cloudPath:"menus/"+filename+"."+ext
        })
        arr.push(item1)
    })
    return await Promise.all(arr);
}
export default multiUpload