
const UserDtb = require('../models/User.Model');
const bcrypt=require('bcrypt');
const JwtService=require('./JwtService');

module.exports.createUser = async (newUser) => {

    try {
        const checkUser= await UserDtb.findOne({
            email:newUser.email
        })
        
        if(checkUser!==null) {
            return {
                status: 'ERR',
                message: 'Email đã tồn tại'
            }
        }
      
        const hash= await bcrypt.hash(newUser.password, 10);
        newUser.password=hash;

        const createdUser = await UserDtb.create(newUser);
        return {
            status: 'OK',
            message: 'Thành công ',
            data: createdUser
        };
      
    } catch (error) {
        console.error('Error');
        throw error;
    }
};


module.exports.loginUser = async (dataUser) => {

    try {
        const checkUser= await UserDtb.findOne({
            email:dataUser.email
        })

        if(checkUser==null) {
            return {
                status: 'ERR',
                message: 'Email khong tồn tại'
            }
        }

        const passwordInut= await bcrypt.compare(dataUser.password,checkUser.password);

        if (!passwordInut) {
             return {
                status: 'ERR',
                message: 'Mật khẩu không chính xác'
            }
        }
      
        const access_token=JwtService.genneralAccessToken({
            id:checkUser.id,
            IsAdmin: checkUser.IsAdmin
        })
  
        const refresh_token=JwtService.genneralRefreshToken({
            id:checkUser.id,
            IsAdmin: checkUser.IsAdmin
        })
        return {
            status: 'OK',
            message: 'Thành công ',
            access_token,
            refresh_token
        };
      
    } catch (error) {
        console.error('Error');
        throw error;
    }
};

module.exports.updateUser= async (userId,dataChange) =>{
      try {
        const checkUser= await UserDtb.findOne({
            _id: userId
        })
        
        if(dataChange.password) {
             dataChange.password= await bcrypt.hash(dataChange.password, 10);
    
        }
        

        if(checkUser==null) {
            return {
                status: 'ERR',
                message: 'khong tồn tại tài khoản này'
            }
        }

        const updateUser= await UserDtb.findByIdAndUpdate(userId,dataChange,{new:true}).select('-password')
       
        return {
            status: 'OK',
            message: 'Thành công ',
            user: updateUser
        };
      
    } catch (error) {
        console.error('Error');
        throw error;
    }
}

module.exports.deleteUser= async (userId) => {
    try {
        const checkUser= await UserDtb.findOne({
            _id: userId
        })
        if (!checkUser) {
            return {
                status : "ERR",
                message: "User khong ton tai"
            }
        }
        await UserDtb.findByIdAndDelete(userId);
        return {
            status: 'OK',
            message: "Xoa user thanh cong"
        }
    } catch (error) {
        return {
            message: error
        }
    }
}

module.exports.getAllUser= async () =>{
    try {
        const allUser=await UserDtb.find();
        return {
            status: 'OK',
            message: 'Thanh cong',
            data: allUser
        }
    } catch (error) {
          return {
            message: error
        }
    }
}


module.exports.getDetailUser= async (userId) =>{
    try {
        const checkUser=await UserDtb.findOne({
            _id: userId
        }).select('-password');
        if(!checkUser) {
            return {
            status : "OK",
            message: "User khong ton tai"
            }
        }
        return {
            status: 'OK',
            message: 'Thanh cong',
            data: checkUser
        }
    } catch (error) {
          return {
            message: error
        }
    }
}

