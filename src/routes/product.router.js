const express=require('express');
const router=express.Router();
const productControllers=require('../controllers/product.controller');
const {authMiddleware, authUserMiddleware}=require("../middleware/auth.middleware");
const {createStorage } =require("../helper/cloudinary");
const multer = require('multer');
const {validateProduct} =require('../middleware/validate.middleware');
const {validateImgs}=require("../middleware/validateImg");

const uploadImg = require("../middleware/uploadImg").upload("products");


router.post("/create",uploadImg.array('images',5),validateImgs,
            validateProduct,productControllers.createProduct);

router.put("/update/:id",authMiddleware,uploadImg.array('images',5),validateImgs,
            validateProduct,productControllers.updateProduct);  
// authMiddleware

router.get("/detail/:id",productControllers.detailProduct);  
// authUserMiddleware

router.delete("/delete/:id",authMiddleware, productControllers.deleteProduct);  

router.post("/delete-many",authMiddleware, productControllers.deleteManyProduct);  

router.get("/get-all", productControllers.getAllProduct);  

module.exports=router;