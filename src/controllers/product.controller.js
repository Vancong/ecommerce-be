const ProductService=require('../services/productService')

// [POST] /api/product/create
module.exports.createProduct= async (req,res) =>{
    try {
        const imageUrls = req.files.map(file => file.path); 
        const response= await ProductService.createProduct({...req.body,images: imageUrls});
        if (response.status === 'ERR') {
            return res.status(400).json(response);
        }
        return res.status(200).json(response);

    } catch (error) {
         return res.status(500).json( {
            message: error.message || 'Lỗi không xác định' 
        })
    }
}

// [PUT] /api/product/update/:id
module.exports.updateProduct= async (req,res) =>{

    try {
        const imgNew = req.files.map(file => file.path) || [];
        const oldImages =JSON.parse( req.body.oldImages)||[];
        const imgUrls = [...oldImages, ...imgNew];
        const id=req.params.id;
        req.body.images=imgUrls;
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
         return res.status(500).json( {
            message: error
        })
    }
}

// [GET] /api/product/detail/:id
module.exports.detailProduct= async (req,res) => {
    try {
        const id=req.params.id;
        const response=await ProductService.deitailProduct(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
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
                status: 'ERR',
                message: 'vui long nhap id'
            })
        }
        const response= await ProductService.deleteProduct(productId);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}
// [DELETTED] /api/product/delete-many 
module.exports.deleteManyProduct= async(req,res) =>{
    try {
        const ids=req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                 status: "ERR", 
                 message: "Dach sach id khong hop le" 
            });
        }

        const response= await ProductService.deleteManyProduct(ids);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}
// [GET] /api/product/get-all
module.exports.getAllProduct= async(req,res) =>{
    try {
        const page=parseInt(req.query.page);
        const limit=parseInt(req.query.limit)
        const {key,value,search}=req.query;
        const response=await ProductService.getAllProduct(limit,page,key,value,search);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message :error
        })
    }
}