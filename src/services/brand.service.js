const BrandDtb= require("../models/Brand.Model");
const paginationHelper=require("../helper/pagination.js");
const createErro=require("../helper/createError.js")
module.exports.createBrand = async (newBrand) => {

    const createBrand = await BrandDtb.create(newBrand);
    return {
        status: 'OK',
        message: 'Thành công ',
        data: createBrand
    };
};

module.exports.getDetail= async (id) =>{
    const checkBrand=await BrandDtb.findOne({
        _id: id
    });
    if(!checkBrand) {
        throw createErro(404,"Brand khong ton tai")
    }
    return {
        status: 'OK',
        message: 'Thanh cong',
        data: checkBrand
    }
   
}


module.exports.getAllBrand= async (limit,page = 1,key,value,search='') =>{
    const sort = {};
    if (key && value){
        sort[key] = value;
    }
    else sort.name = 'asc';

    let query = {}; 
    if (search && search.trim() !== '') {
        query.name = { $regex: search.trim(), $options: 'i' };

    }

    return await paginationHelper({
        model: BrandDtb,
        page,
        limit,
        sort,
        query
    });
 
}

module.exports.update= async (brandId,dataChange) =>{

    const updateBrand= await BrandDtb.findByIdAndUpdate(brandId,dataChange,{new:true});
    if(!updateBrand) {
         throw createErro(404,"Brand khong ton tai")
    }
    return {
        status: 'OK',
        message: 'Thành công ',
        data: updateBrand
    };
}

module.exports.deleteBrand= async (brandId) => {
    const checkBrand= await BrandDtb.findOne({
        _id: brandId
    })
    if (!checkBrand) {
            throw createErro(404,"Brand khong ton tai")
    }
    await BrandDtb.findByIdAndDelete(brandId);
    return {
        status: 'OK',
        message: "Xoa brand thanh cong"
    }

}

module.exports.deleteManyBrand=async(ids) =>{

    await BrandDtb.deleteMany({ _id: { $in: ids } });
    return {
        status: 'OK',
        message: "Xoa thương hiệu thanh cong"
    }
}