const ProductService=require('../services/productService')

// [POST] /api/product/create
module.exports.createProduct= async (req,res) =>{
    try {
        
        const {name,image,type,countInStock,description}= req.body;
        if(!name || !image || !type || !countInStock ||!description ) {
            return res.status(400).json({
                status: "ERR",
                message: "The input is required"
            })
        }

        const response= await ProductService.createProduct(req.body);
        return res.status(200).json(response);


    } catch (error) {
         return res.status(404).json( {
            message: error
        })
    }
}

// [PUT] /api/product/update/:id
module.exports.updateProduct= async (req,res) =>{
    try {
        
        const id=req.params.id;
        const dataUpdate=req.body;
        if(id===null) {
            return res.status(400).json({
                status: "ERR",
                message: "Vui long nhap id"
            })
        }

        const response= await ProductService.updateProduct(id,dataUpdate);
        return res.status(200).json(response);


    } catch (error) {
         return res.status(404).json( {
            message: error
        })
    }
}

// [GET] /api/product/detail/:id
module.exports.detailProduct= async (req,res) => {
    try {
        const id=req.params.id;
        console.log(id);
        const response=await ProductService.deitailProduct(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message :error
        
        })
    }
}

// [DELETE] /api/product/delete/:id
module.exports.deleteProduct= async (req,res) =>{
    try {
        const productId=req.params.id;
        if(!productId) {
            return res.status(400).json({
                status: 'err',
                message: ' San pham khong ton tai'
            })
        }
        const response= await ProductService.deleteProduct(productId);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

// [GET] /api/product/get-all
module.exports.getAllProduct= async(req,res) =>{
    try {
        const page=parseInt(req.query.page);
        const {key,value}=req.query;
        const response=await ProductService.getAllProduct(page,key,value);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message :error
        })
    }
}