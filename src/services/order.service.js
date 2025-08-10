const OrderDtb=require('../models/Order.Model');
const generateOrderCode=require("../helper/generateOrderCode");
const paginationHelper=require("../helper/pagination");
const createErro=require("../helper/createError");
const VoucherDtb=require('../models/Voucher.Model');
const VoucherService=require('../services/voucher.service')
module.exports.create= async(data) =>{
    const orderCode= await generateOrderCode();
    data.orderCode=orderCode;
    if(data.discountCode) {
        await VoucherService.check(data.user,data.discountCode,data.totalPrice);
    }

    const newOrder= await OrderDtb.create(data);
        return {
        status: 'OK',
        message: 'Thành công ',
        data: newOrder
    };
   
}

module.exports.myOrder=async (userId,page,limit) =>{

    const myOrder = await paginationHelper({
        model: OrderDtb,
        page,
        limit,
        sort: { createdAt: -1 },
        query: { user: userId }
    });
    return {
        status:'OK',
        data:myOrder
    }
}


module.exports.myOrderDetail=async (orderCode) =>{

    const order=await OrderDtb.findOne({orderCode: orderCode})
                                .populate('items.product','name images slug ');
    if (!order){
        throw createErro(404, "Không tìm thấy đơn hàng");
    } 
    return {
        status: 'OK',
        data: order,
    }
        

}

module.exports.changeStatus=async (orderCode,status) =>{

    const order=await OrderDtb.findOne({orderCode});
    if (!order) {
        throw createErro(404, "Không tìm thấy đơn hàng");
    }
    if(order.status==='confirmed'||order.status==='pending'){
            await OrderDtb.updateOne({
                orderCode
            },{
                status
            })
    }
    
    return {
        status: 'OK',
        message: 'Thanh cong',
    }
    
    
}

