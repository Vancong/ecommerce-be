const jwt=require('jsonwebtoken');

const dotenv=require('dotenv').config();
console.log('ACCESS_TOKEN:', process.env.ACCESS_TOKEN);



const authMiddleware= (req,res,next) =>{
    const authHeader = req.headers.token;
    let token = authHeader && authHeader.split(' ')[1];   
    token = token.replace(/^"(.*)"$/, '$1').trim();
    jwt.verify(token,process.env.ACCESS_TOKEN, function(err,user) {
         if(err) {
               console.error( err.message);
            return res.status(404).json({
                status: 'ERROR'
            })
        }

        if(user.isAdmin) {
            req.user=user;
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
    const userId=req.params.userId;
    let token = req.headers.token.split(' ')[1];
    token = token.replace(/^"(.*)"$/, '$1').trim();
    jwt.verify(token,process.env.ACCESS_TOKEN, function(err,user) {
         if(err) {
            console.log(err.message)
            return res.status(404).json({
                status: 'ERROR'
            })
        }
        if(user?.isAdmin||user?.id===userId) {
            req.user = user;
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