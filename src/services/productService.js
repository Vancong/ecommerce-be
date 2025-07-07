
const ProductDtb=require('../models/Product.Model');

module.exports.createProduct= async (newProduct) =>{
    try {
        console.log('ok');
        const {name,image,type,countInStock,description}= newProduct;
        const checkProduct= await ProductDtb.findOne({
            name: name
        })
        if(checkProduct!==null) {
            return {
                status: "ERR",
                message: "San pham da ton tai"
            }
        }

        const createProduct= await ProductDtb.create(newProduct);
        if(createProduct) {
            return {
                status: 'OK',
                message: 'Thanh cong',
                createProduct
            }
        }

    } catch (error) {
         return {
            message: error
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
        console.log(checkProduct)
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

module.exports.getAllProduct= async (page = 1,key,value) =>{
    try {
        const limit=6;
        const totalProduct= await ProductDtb.countDocuments();
        const totalPage=Math.ceil(totalProduct/limit);
        const skipPage=(page-1) *limit;

        const sort={};
        if(key&&value) {
            sort[`${key}`]=value;
        }
        else {
            sort.name='asc';
        }

        const allProduct=await ProductDtb.find().limit(limit).skip(skipPage).sort(sort);
        if(allProduct.length>0) {
            return {
            status: 'OK',
            message: 'Thanh cong',
            data: allProduct,
            totalPage: totalPage
            }
        }
        
        return {
            message: "err"
        }
       
       
    }catch (error) {
          return {
            message: error
        }
    }
}