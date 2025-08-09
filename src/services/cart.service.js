const CartDtb=require('../models/Cart.Model');
const createError=require("../helper/createError");
module.exports.create= async(data) =>{

    const { userId, productId, volume, price,quantity } = data;
    let cart = await CartDtb.findOne({ user: userId });
    if (!cart) {
        cart = new CartDtb({
        user: userId,
        items: [{ product: productId, volume,price,quantity }]
        });
    } 
    else {
        const cartItem= cart.items.find((item) =>
            item.product.toString() === productId && item.volume === volume
        );

        if (cartItem) {
            cartItem.quantity += quantity;
        } 
        else {
            cart.items.push({ product: productId, volume, price, quantity });
        }
    }

    const newCart= await cart.save();
    return {
        status: 'OK',
        message: 'Đã thêm vào giỏ hàng thành công',
        data: newCart
    };

}

module.exports.getDetail=async (userId) =>{

    const cart = await  CartDtb.findOne({ user: userId })
        .populate('items.product', 'name images selled slug');
    
    return {
        status: 'OK',
        data: cart?.items ||[],
        total: cart?.items.length||0
    }
        
}

module.exports.increaseQuantity= async(data) =>{
 
    const { userId, productId, volume } = data;
    const updatedCart = await CartDtb.findOneAndUpdate(
        {
        user: userId,
        'items.product': productId,
        'items.volume': volume
        },
        {
        $inc: { 'items.$.quantity': 1 }
        },
    );
     if(!updatedCart) {
        throw createError(404,'Loi khong tim thay san pham');
     }

   
    return {
        status: 'OK',
    }

}



module.exports.decreaseQuantity= async(data) =>{

    const { userId, productId, volume } = data;
    const updatedCart = await CartDtb.findOneAndUpdate(
        {
        user: userId,
        'items.product': productId,
        'items.volume': volume
        },
        {
        $inc: { 'items.$.quantity': -1 }
        },
    );
     if(!updatedCart) {
        throw createError(404,'Loi khong tim thay san pham');
     }

   
    return {
        status: 'OK',
    }
}



module.exports.deleteProductInCart= async(data) =>{

    const { userId, productId, volume } = data;
    const cart= await CartDtb.findOneAndUpdate({
        user: userId,
    },{
        $pull:{
            items:{
                product:productId,
                volume:volume
            }
        }
    })

    if(!cart) {
        throw createError(404,'Loi khong tim thay san pham');
    }

    return {
        status: 'OK',
    }

}

module.exports.clearCart=  async (userId) =>{

    const cart= await CartDtb.findOneAndUpdate({
        user: userId,
    },{
        items:[]
    })
    if(!cart) {
        throw createError(404,'Loi khong tim thay san pham');
    }
    return {
        status: 'OK',
    }
  
}