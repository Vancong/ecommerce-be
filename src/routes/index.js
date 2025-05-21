
const userRouter=require('./user.router');
module.exports.index= (app) =>{
    app.use('/api/user',userRouter);
}

