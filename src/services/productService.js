
const ProductDtb=require('../models/Product.Model');
const paginationHelper=require ("../helper/pagination.js");
module.exports.createProduct= async (newProduct) =>{
    try {
        const {name}= newProduct;
        const checkProduct= await ProductDtb.findOne({
            name: name
        })
        if(checkProduct) {
            return {
                status: "ERR",
                message: "Sản phẩm đã tồn tại"
            }
        }

        const createProduct= await ProductDtb.create(newProduct);
        if(createProduct) {
            return {
                status: 'OK',
                message: 'Tạo sản phẩm thành công',
                createProduct
            }
        }

    } catch (error) {
         return {
              status: "ERR",
             message: error.message || "Lỗi không xác định"
        }
    }
}

module.exports.updateProduct= async (id,dataUpdate) =>{
     try {
        const checkProduct= await ProductDtb.findOne({
            _id: id
        })

        if(checkProduct===null) {
            return {
                status: "ERR",
                message: "San pham khong ton tai"
            }
        }
        const updateProduct= await ProductDtb.findByIdAndUpdate(id,dataUpdate,{new:true});
        if(updateProduct) {
            return {
                status: 'OK',
                message: 'Thanh cong',
                updateProduct
            }
        }

    } catch (error) {
         return {
            message: error
        }
    }
}

module.exports.deitailProduct= async (id) =>{
    try {
        const checkProduct=await ProductDtb.findOne({
            _id: id
        });
        if(!checkProduct) {
            return {
            status : "ERR",
            message: "San pham khong ton tai"
            }
        }
      
        return {
            status: 'OK',
            message: 'Thanh cong',
            data: checkProduct
        }
    } catch (error) {
          return {
            message: error
        }
    }
}

module.exports.deleteProduct= async (id) =>{
    try {
        const checkProduct= await ProductDtb.findOne({
            _id: id
        })

        if (!checkProduct) {
            return {
                status : "ERR",
                message: "San pham khong ton tai"
            }
        }
        await ProductDtb.findByIdAndDelete(id);
        return {
            status: 'OK',
            message: "Xoa san pham thanh cong"
        }
    } catch (error) {
        return {
            message: error
        }
    }
}

module.exports.deleteManyProduct=async (ids) =>{
    try {
        await ProductDtb.deleteMany({ _id: { $in: ids } });
        return {
            status: 'OK',
            message: "Xoa san pham thanh cong"
        }
    } catch (error) {
        return {
            message: error
        }
    }
}

module.exports.getAllProduct= async (limit,page = 1,key,value,search='') =>{
    try {
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
            model: ProductDtb,
            page,
            limit,
            sort,
            query
        });
       
    }catch (error) {
          return {
            message: error
        }
    }
}