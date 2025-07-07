const express=require('express');
const router=express.Router();
const userControllers=require("../controllers/user.controller");
const {authMiddleware,authUserMiddleware}=require("../middleware/auth.middleware");

router.post('/sign-up',userControllers.createUser);

router.post('/sign-in',userControllers.loginUser);

router.post('/log-out',userControllers.logoutUser);

router.put('/update-user/:id', authUserMiddleware,userControllers.updateUser);

router.delete('/delete-user/:id',authMiddleware, userControllers.deleteUser);

router.get('/getAll',authMiddleware, userControllers.getAllUser);

router.get('/get-detail/:id',authUserMiddleware,userControllers.getDetailUser);

router.post('/refresh-token',userControllers.refreshToken);


module.exports=router;