const express=require('express');
const router=express.Router();
const productControllers=require('../controllers/product.controller');
const {authMiddleware}=require("../middleware/auth.middleware");

router.post("/create", productControllers.createProduct);

router.put("/update/:id",authMiddleware, productControllers.updateProduct);   

router.get("/detail/:id",authMiddleware, productControllers.detailProduct);  

router.delete("/delete/:id", productControllers.deleteProduct);  

router.get("/get-all", productControllers.getAllProduct);  

module.exports=router;