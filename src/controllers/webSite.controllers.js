const asyncHandler =require('express-async-handler')
const webSiteService=require('../services/webSite.service');

module.exports.update=asyncHandler(async(req,res)=>{
    
    if(req.files.logo && req.files.logo[0].path) {
        req.body.logo = req.files.logo[0].path
    } else if(req.body.oldImglogo) {
        req.body.logo = req.body.oldImglogo; 
    }

    let banner = [];

    if(req.files.banner&&req.files.banner.length>0) {
        banner= req.files.banner.map(item =>item.path);
    }
   
    if(req.body.oldImgBanner) {
        const oldBanners = JSON.parse(req.body.oldImgBanner);
        oldBanners.forEach(imgUrl => banner.push(imgUrl));
    }

    req.body.banner = banner;

    if(req.body.socialLinks) {
         req.body.socialLinks = JSON.parse(req.body.socialLinks);
    }

    const response=await webSiteService.update(req.body);
    return res.status(200).json(response);
})

module.exports.getInfo=asyncHandler(async(req,res)=>{
    
    const response=await webSiteService.getInfo();
    return res.status(200).json(response);
})