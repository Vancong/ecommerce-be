
const ProductDtb=require('../models/Product.Model');

module.exports.createProduct= async (newProduct) =>{
    try {
        const {name,image,type,countInStock,description}= newProduct;
        const checkProduct= await ProductDtb.findOne({
            name: name
        })
        if(checkProduct!==null) {
            return {
                status: "OK",
                message: "San pham da ton tai"
            }
        }

        const createProduct= await ProductDtb.create(newProduct);
        if(createProduct) {
            return {
                status: 'ok',
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
                status: "OK",
                message: "San pham khong ton tai"
            }
        }
        const updateProduct= await ProductDtb.findByIdAndUpdate(id,dataUpdate,{new:true});
        if(updateProduct) {
            return {
                status: 'ok',
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
            status : "OK",
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
                status : "OK",
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

module.exports.getAllProduct= async () =>{
    try {
        const allProduct=await ProductDtb.find();
        return {
            status: 'OK',
            message: 'Thanh cong',
            data: allProduct
        }
    }catch (error) {
          return {
            message: error
        }
    }
}