const userService=require('../services/user.Service');
const JwtService=require("../services/JwtService");
const UserDtb=require("../models/User.Model");

module.exports.index= (req,res) => {
    console.log('ok');
}

// [POST] /api/user/sigin-up
module.exports.createUser= async (req,res) =>{
    
   try {

        const user=await userService.createUser(req.body); 
        if (user.status === 'ERR') {
            return res.status(400).json(user); 
        }
        return res.status(200).json(user);
   } catch (error) {
        return res.status(500).json( {
            message: error
        })
   }
}

// [POST] /api/user/sigin-in
module.exports.loginUser= async (req,res) =>{
      try {
        
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
        return res.status(500).json( {
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
        return res.status(500).json({
            message: error
        })
    }
}

// [PUT] /api/user/update-user/:id
module.exports.updateUser= async (req,res) =>{
    try {
        const userId=req.params.id;
        const data=req.body;
        if(req.file){
            data.avt=req.file.path;
        }
        if(!userId) {
            return res.status(400).json({
                status: 'err',
                message:'Bắt buộc có userId'
            })
        }

        const dataChange= await userService.updateUser(userId,data);
        return res.status(200).json(dataChange)

    } catch (error) {
        return res.status(500).json({
            message: error
        })
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
        return res.status(500).json({
            message: error
        })
    }
}

// [DELETE] /api/user/delete-many
module.exports.deleteManyUser= async (req,res) =>{
    try {
        const ids=req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                 status: "ERR", 
                 message: "Dach sach id khong hop le" 
            });
        }
        const response= await userService.deleteManyUser(ids);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}
// [GET] /api/user/getAll
module.exports.getAllUser= async (req,res) =>{
    try {
        const page=parseInt(req.query.page);
        const limit=parseInt(req.query.limit)
        const {key,value,search}=req.query;
        const response=await userService.getAllUser(limit,page,key,value,search);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
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
        return res.status(500).json({
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
        return res.status(500).json({
            message :error
        })
    }
}

