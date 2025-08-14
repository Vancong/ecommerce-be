const OrderDtb=require('../models/Order.Model');
const generateOrderCode=require("../helper/generateOrderCode");
const paginationHelper=require("../helper/pagination");
const createErro=require("../helper/createError");
const VoucherService=require('../services/voucher.service')
const sendEmailHelpers=require('../helper/sendEmail.helpers')
const htmlSendMailOrder=require('../helper/HtmlSendMailOrder');
const createError = require('../helper/createError');

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

module.exports.cancelled=async (orderCode,status) =>{

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


module.exports.getAll=async (limit,page,search,filters) =>{

    const {status,startDate,endDate,paymentMethod}=filters;
    const query={};
    const populate = { path: 'items.product', select: 'name' }
    if (search && search.trim() !== '') {
        query.$or =  [
            {orderCode:{ $regex: search}} ,
            {phone: {$regex: search}},
            {name: {$regex: search, $options:'i'}}
        ]
    }
    if(status) {
        query.status=status;
    }
    if(paymentMethod) {
        query.paymentMethod=paymentMethod;
    }

    if (startDate && endDate) {
      query.createdAt  = {
        $gte: new Date(startDate),
        $lt: new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000) 
      };
    }
    

     return await paginationHelper({
        model: OrderDtb,
        page,
        limit,
        query,
        populate
     }
     )

    
    
}

module.exports.updateStatus=async(orderCode,status,updatedBy) =>{
    const checkOrder=await OrderDtb.findOne({
        orderCode
    })
    if(!checkOrder) {
        throw create(400,"Không tồn tại đơn hàng")
    }
    const valid = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["shipping", "cancelled"],
      shipping: ["completed", "refund_pending"],
      completed: [],
      cancelled: [],
      refunded: [],
      refund_pending: ["refunded"]
    };

    if(!valid[checkOrder.status].includes(status)){
         throw createError(400,"Không thể chuyển sang trạng thái này" )
    }

    await OrderDtb.updateOne({
        orderCode
    },{status,updatedBy
    })

    return {
        status:'OK'
    }

}