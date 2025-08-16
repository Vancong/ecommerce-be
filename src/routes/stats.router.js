const express=require('express');
const router=express.Router();
const statsControllers=require('../controllers/stats.controllers');
const {authMiddleware}=require("../middleware/auth.middleware");



  

// router.get("/get-all", statsControllers.getAll);  

module.exports=router;