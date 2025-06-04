const jwt=require('jsonwebtoken')
const dotenv=require('dotenv');
dotenv.config();


module.exports.genneralAccessToken= (payload) =>{
   
    const accessToken=jwt.sign({
        payload
    }
    , process.env.ACCESS_TOKEN,{expiresIn:'30s'})
    return accessToken
}

module.exports.genneralRefreshToken= (payload) =>{

    const refreshToken=jwt.sign({
        payload
    }
    ,process.env.REFRESH_TOKEN,{expiresIn:'365d'})

    return refreshToken
}



module.exports.refreshTokenJwtServices = async (token) => {
    try {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    return resolve({
                        status: 'ERR',
                        message: 'Token không hợp lệ'
                    });
                }

                const { id, isAdmin } = user;

                const newAccessToken = module.exports.genneralAccessToken({
                    id,
                    isAdmin
                });

                return  resolve({
                    status: 'OK',
                    message: 'Thành công',
                    access_token: newAccessToken
                });
            });
        });
    } catch (error) {
        return {
            status: 'ERR',
            message: 'Lỗi server'
        };
    }
};
