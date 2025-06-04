const userService=require('../services/user.Services');
const JwtServices=require("../services/JwtServices");
const UserDtb=require("../models/User.Model");

module.exports.index= (req,res) => {
    console.log('ok');
}

// [POST] /api/user/sigin-up
module.exports.createUser= async (req,res) =>{
    
   try {
        const {name,email,password,confirmPassword,phone}=req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        
        const isCheckMail=reg.test(email);
        
        if(!name || !email || !password || !confirmPassword ||!phone ) {
            return res.status(400).json({
                status: "ERR",
                message: "The input is required"
            })
        }
        else if(!isCheckMail) {
             return res.status(400).json({
                status: "ERR",
                message: "Email không hợp lệ"
            })
        }
        
        else if(password!==confirmPassword) {
            return res.status(400).json({
                status: "ERR",
                message: "Mật khẩu không khớp"
            })
        }


        const user=await userService.createUser(req.body); 
        return res.status(200).json(user)
   } catch (error) {
        return res.status(404).json( {
            message: error
        })
   }
}

// [POST] /api/user/sigin-in
module.exports.loginUser= async (req,res) =>{
      try {
        const {email,password}=req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        
        const isCheckMail=reg.test(email);
        
        if(!email || !password  ) {
            return res.status(400).json({
                status: "ERR",
                message: "The input is required"
            })
        }
        else if(!isCheckMail) {
             return res.status(400).json({
                status: "ERR",
                message: "Email không hợp lệlệ"
            })
        }
        
       
        const user=await userService.loginUser(req.body); 
        return res.status(200).json(user)
   } catch (error) {
        return res.status(404).json( {
            message: error
        })
   }
}

// [PUT] /api/user/update-user/:id
module.exports.updateUser= async (req,res) =>{
    try {
        const userId=req.params.id;
        const data=req.body;
        if(!userId) {
            return res.status(400).json({
                status: 'err',
                message:'Bắt buộc có userId'
            })
        }
        const dataChange= await userService.updateUser(userId,data);
        return res.status(200).json(dataChange)

    } catch (error) {
        
    }
}


// [DELETE] /api/user/delete-user/:id
module.exports.deleteUser= async (req,res) =>{
    try {
        const userId=req.params.id;
        const token=req.headers;
        console.log(token);
        if(!userId) {
            return res.status(400).json({
                status: 'err',
                message: 'Khong ton tai'
            })
        }
        const response= await userService.deleteUser(userId);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

// [GET] /api/user/getAll
module.exports.getAllUser= async (req,res) =>{
    try {
        const response=await userService.getAllUser();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message :error
        })
    }
}

// [POST] /api/user/get-detail/:id
module.exports.getDetailUser= async (req,res) =>{
    try {
        const userId=req.params.id;
        const response=await userService.getDetailUser(userId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message :error
        })
    }
}

// [GET] /api/user/refresh-token
module.exports.refreshToken= async (req,res) =>{
    try {
        const token=req.headers.token.split(' ')[1];
        if(!token) {
            return res.status(200).json ( {
                status: 'ERR',
                message: 'Bat buoc can token'
            })
        }
        const response=await JwtServices.refreshTokenJwtServices(token);
        console.log(response);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message :error
        })
    }
}