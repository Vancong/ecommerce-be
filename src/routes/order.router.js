const express=require('express');
const router=express.Router();
const orderControllers=require('../controllers/order.controllers');
const {validateOrder }=require("../validate/ValidateOrderAndCart");
const {authUserMiddleware}=require("../middleware/auth.middleware")




router.post("/create/:userId",authUserMiddleware,validateOrder,orderControllers.create);

router.get("/my-order/:userId",authUserMiddleware,orderControllers.myOrder);

router.get("/my-order/detail/:userId/:orderCode",authUserMiddleware,orderControllers.myOrderDetail);

router.patch("/my-order/detail/change-status/:userId",authUserMiddleware,orderControllers.changeStatus);

// router.get("/detail/:id",noteControllers.getDetail);  


// router.delete("/delete/:id",authMiddleware, noteControllers.deleteNote);  

  

// router.get("/get-all", noteControllers.getAll);  

module.exports=router;