const userService=require('../services/user.Service');
const JwtService=require("../services/JwtService");
const UserDtb=require("../models/User.Model");

module.exports.index= (req,res) => {
    console.log('ok');
}

// [POST] /api/user/sigin-up
module.exports.createUser= async (req,res) =>{
    
   try {
        const {email,password,confirmPassword}=req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        
        const isCheckMail=reg.test(email);
     
        if(  !email || !password || !confirmPassword ) {
            return res.status(400).json({
                status: "ERR",
                message: "Vui lòng nhập đầy đủ email và mật khẩu."
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
        if (user.status === 'ERR') {
            return res.status(400).json(user); 
        }
        return res.status(200).json(user);
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
                message: "Vui lòng nhập đầy đủ email và mật khẩu."
            })
        }
        else if(!isCheckMail) {
       
             return res.status(400).json({
                status: "ERR",
                message: "Email không hợp lệ"
            })
        }
       
        const user=await userService.loginUser(req.body); 
        const {refresh_token,...newUser}=user;
        res.cookie('refresh_token',refresh_token,{
            httpOnly: true,
            secure: false,
            sameSite: 'Strict'
        })


        if (user.status === 'ERR') {
            return res.status(400).json(newUser); 
        }
        return res.status(200).json(newUser);
   } catch (error) {
        return res.status(404).json( {
            message: error
        })
   }
}

// [POST] /api/user/log-out
module.exports.logoutUser= async (req,res) =>{
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({
            status: 'OK',
            message: 'Đăng xuất thành công'
        })
    } catch (error) {
        return res.status(400).json({
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
        if(!data.email) {
             return res.status(400).json({
                status: "ERR",
                message: "Không được bỏ trống Email"
            })
        }

        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckMail=reg.test(data.email);
        if(!isCheckMail) {
            return res.status(400).json({
                status: "ERR",
                message: "Email không hợp lệ"
            })
        }

        const dataChange= await userService.updateUser(userId,data);
        return res.status(200).json(dataChange)

    } catch (error) {
        console.log('er')
    }
}


// [DELETE] /api/user/delete-user/:id
module.exports.deleteUser= async (req,res) =>{
    try {
        const userId=req.params.id;
        const token=req.headers;
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
        const token=req.cookies.refresh_token;
        if(!token) {
            return res.status(200).json ( {
                status: 'ERR',
                message: 'Bat buoc can token'
            })
        }
        const response=await JwtService.refreshTokenJwtServices(token);
        
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message :error
        })
    }
}

