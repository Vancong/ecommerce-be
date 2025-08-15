const WebSiteInfoDtb=require('../models/WebSiteInfo.Model');
const createError=require('../helper/createError')

module.exports.update= async(data) =>{
    let webInfo=await WebSiteInfoDtb.findOne();
    if(!webInfo){
        webInfo = new WebSiteInfoDtb(data);
    }
    else {
        Object.keys(data).forEach(key =>{
            webInfo[key]=data[key]
        })
    }
    await webInfo.save();
    return {
        status:'OK',
        data: webInfo
    }
}



module.exports.getInfo= async(data) =>{
    const websiteInfo= await WebSiteInfoDtb.findOne();
    if(!websiteInfo){
        throw createError('Khong co thong tin');
    }
    return {
        status:'OK',
        data: websiteInfo
    }
}