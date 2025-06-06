
const userRouter=require('./user.router');
const productRouter=require('./product.router');
module.exports.index= (app) =>{
    app.use('/api/user',userRouter);
    app.use('/api/product',productRouter);
}

