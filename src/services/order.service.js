const OrderDtb=require('../models/Order.Model');
const generateOrderCode=require("../helper/generateOrderCode");
const paginationHelper=require("../helper/pagination");
const createErro=require("../helper/createError");
const VoucherService=require('../services/voucher.service')
const sendEmailHelpers=require('../helper/sendEmail.helpers')
const htmlSendMailOrder=require('../helper/HtmlSendMailOrder');
module.exports.create= async(data) =>{
    const orderCode= await generateOrderCode();
    data.orderCode=orderCode;
    if(data.discountCode) {
        await VoucherService.check(data.user,data.discountCode,data.totalPrice);
    }
    if(data.paymentMethod==='vnpay'||data.paymentMethod==='paypal') {
        data.status='confirmed'
    }

    let newOrder= await OrderDtb.create(data);
    newOrder= await newOrder.populate('items.product', 'name images');

    if(newOrder.email) {
        const html=htmlSendMailOrder(
            newOrder.orderCode,
            newOrder.items,
            newOrder.totalPrice, 
            newOrder.finalPrice,
            newOrder.discountValue, 
            newOrder.shipping, 
            newOrder.paymentMethod
        )
        sendEmailHelpers(newOrder.email,'Hello',html)
    }


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
    if(order.isPaid) {
        status='refund_pending';
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

