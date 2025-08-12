
const ProductDtb=require('../models/Product.Model');
const paginationHelper=require ("../helper/pagination.js");
const createError=require('../helper/createError');
module.exports.createProduct= async (newProduct) =>{

    const {name}= newProduct;
    const checkProduct= await ProductDtb.findOne({
        name: name
    })
    if(checkProduct) {
        throw createError(404, "Tên phẩm đã tồn tại");
    }

    const createProduct= await ProductDtb.create(newProduct);
    if(createProduct) {
        return {
            status: 'OK',
            message: 'Tạo sản phẩm thành công',
            data: createProduct
        }
    }

}

module.exports.updateProduct= async (id,dataUpdate) =>{

    const checkProduct= await ProductDtb.findOne({
        _id: id
    })

    if(!checkProduct) {
        throw createError(404, "San pham khong ton tai");
    }
    const updateProduct= await ProductDtb.findByIdAndUpdate(id,dataUpdate,{new:true});
    if(updateProduct) {
        return {
            status: 'OK',
            message: 'Thanh cong',
            data:  updateProduct
        }
    }
}

module.exports.deitailProduct= async (param) =>{

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(param);
    let checkProduct;
    if(isObjectId) {
        checkProduct=await ProductDtb.findOne({
        _id: param
        }).populate('brand')     
            .populate('notes.top')
            .populate('notes.middle')
            .populate('notes.base');
    }
    else {
            checkProduct=await ProductDtb.findOne({
            slug: param
        }).populate('brand')
            .populate('notes.top')
            .populate('notes.middle')
            .populate('notes.base');
    }
    
    if(!checkProduct) {
       throw createError(404, "San pham khong ton tai");
    }

    return {
        status: 'OK',
        message: 'Thanh cong',
        data: checkProduct
    }
}

module.exports.deleteProduct= async (id) =>{

    const checkProduct= await ProductDtb.findOne({
        _id: id
    })

    if (!checkProduct) {
        throw createError(404, "San pham khong ton tai");
    }
    await ProductDtb.findByIdAndDelete(id);
    return {
        status: 'OK',
        message: "Xoa san pham thanh cong"
    }
}

module.exports.deleteManyProduct=async (ids) =>{

    await ProductDtb.deleteMany({ _id: { $in: ids } });
    return {
        status: 'OK',
        message: "Xoa san pham thanh cong"
    }
   
}

module.exports.getAllProduct= async (limit,page = 1,key,value,filters={},isAdmin) =>{

    const sort = {};
    if (key && value){
        sort[key] = value;
    }
    else sort.name = 'asc';

    let query = {};
    
    const checkIsAdmin=isAdmin==='true';
    if(!checkIsAdmin) {
        query.isActive=true;
    }

    let populate={ path: 'brand', select: 'name isActive' }

    if (filters.brands) {
        const brandsArr = filters.brands.split(',');
        query.brand = { $in: brandsArr };
    }



    if (filters.search && filters.search.trim() !== '') {
        query.$or = [
            { name: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } }
        ];
    }
   
    if (filters.gender) {
        query.gender = filters.gender;
    }

    if (filters.price_gt || filters.price_gte || filters.price_lte ||filters.price_lt) {
        query['sizes.price'] = {};
         if (filters.price_lt) query['sizes.price'].$lt = Number(filters.price_lt);
        if (filters.price_gt) query['sizes.price'].$gt = Number(filters.price_gt);
        if (filters.price_gte) query['sizes.price'].$gte = Number(filters.price_gte);
        if (filters.price_lte) query['sizes.price'].$lte = Number(filters.price_lte);
    }
    


    if(filters.notes) {
        populate=[
            populate,
            { path: 'notes.top', populate: { path: 'group' } },
            { path: 'notes.middle', populate: { path: 'group' } },
            { path: 'notes.base', populate: { path: 'group' } },
        ]
    }   


    const res= await paginationHelper({
        model: ProductDtb,
        page,
        limit,
        sort,
        query,
        populate
    });

    const noteGroupClient=filters?.notes?.split(',')||[];

    if(noteGroupClient.length>0){
        let dataProduct=[];
        dataProduct= res?.data?.filter((product)=> {  
            const notesGroup =[];
            if(product?.notes?.base?.length>0){
                const listGroup= product.notes.base.map(item => item?.group?._id).filter(Boolean);
                if(listGroup?.length>0) {              
                    notesGroup.push(...listGroup)
                }
            
            }

            if(product?.notes?.top?.length>0){
                const listGroup= product.notes.top.map(item => item?.group?._id).filter(Boolean);
                if(listGroup?.length>0) {
                    notesGroup.push(...listGroup)
                }
            
            }

            if(product.notes.middle.length>0){
                const listGroup= product.notes.middle.map(item => item?.group?._id).filter(Boolean);
                if(listGroup?.length>0) {
                    notesGroup.push(...listGroup)
                }
            
            }
           return notesGroup.some(noteId =>{
               return  noteGroupClient.includes(noteId.toString())
           })
        });
        res.data=dataProduct;
        return res;
    }

    if(!checkIsAdmin) {
        res.data=res.data.filter(product => product.brand&&product.brand.isActive)
    }
    return res;
       
}