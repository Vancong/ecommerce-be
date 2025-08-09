const OrderService=require("../services/order.service")
const asyncHandler =require('express-async-handler')

// [PATCH] /api/order/create
module.exports.create= asyncHandler( async(req,res) =>{
    const response=await OrderService.create(req.body);
    return res.status(200).json(response);
})


// [GET] /api/order/my-order
module.exports.myOrder=asyncHandler(async(req,res) =>{
    const { page = 1, limit = 5 } = req.query;
    const response=await OrderService.myOrder(req.params.userId,page,limit);
    return res.status(200).json(response);

})

// [GET] /api/order/my-order/detail/:orderCode
module.exports.myOrderDetail= asyncHandler( async(req,res) =>{

        const orderCode=req.params.orderCode;
        const response=await OrderService.myOrderDetail(orderCode);
        return res.status(200).json(response);
})

// [PATCH] /api/order/my-order/detail/change-status/:orderCode
module.exports.changeStatus=asyncHandler( async(req,res) =>{
    const {orderCode,status}=req.body;
    const response=await OrderService.changeStatus(orderCode,status);
    return res.status(200).json(response);

}
)