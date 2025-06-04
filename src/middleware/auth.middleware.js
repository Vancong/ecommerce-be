const jwt=require('jsonwebtoken');
const dotenv=require('dotenv').config();

const authMiddleware= (req,res,next) =>{

    const token = req.headers.token.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN, function(err,user) {
         if(err) {
            return res.status(404).json({
                status: 'ERROR'
            })
        }
        const {payload} =user;

        if(payload.IsAdmin) {
            next();
        }
        else {
            return res.status(404).json({
                message: ' Khong co quyen adm',
                status: 'ERROR'
            })
        }
    })
}

const authUserMiddleware= (req,res,next) =>{
    const userId=req.params.id;
    const token = req.headers.token.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN, function(err,user) {
         if(err) {
            return res.status(404).json({
                status: 'ERROR'
            })
        }
        const {payload} =user;

        if(payload?.IsAdmin||payload?.id===userId) {
            next();
        }
        else {
            return res.status(404).json({
                message: ' Khong co quyen ',
                status: 'ERROR'
            })
        }
    })
}

module.exports ={
    authMiddleware,
    authUserMiddleware
}