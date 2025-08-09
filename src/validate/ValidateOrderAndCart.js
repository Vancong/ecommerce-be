const CartDtb=require('../models/Cart.Model')
const Joi = require('joi');

const validate= (schema) => (req, res, next)   =>{
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
        status: 'ERR',
        message: 'Du lieu khong hop le',
        details: error.details.map(e => e.message)    
        });
    }
    next();
}

const checkFinalPrice=(req,res,next) =>{
    console.log(req.body)
    let finalPrice=req.body.items.reduce((total,item)=>{
       return  total+item.quantity*item.price;
    },0)
    if(finalPrice<=1000000) {
        finalPrice+=28000;
    }
    if(req.body.finalPrice!==finalPrice) {
        return res.status(400).json({
        status: 'ERR'
    });
    }

    next();
}


const orderSchema = Joi.object({
  user: Joi.string().required(), 

  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().optional().allow(null, ''),

  address: Joi.object({
    province: Joi.string().required(),
    district: Joi.string().required(),
    ward: Joi.string().required(),
    detail: Joi.string().allow('').optional()
  }).required(),

  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      volume: Joi.number().required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),

  totalPrice: Joi.number().min(0).required(),
  shipping: Joi.number().min(0).default(0),
  finalPrice: Joi.number().min(0).required(),

  paymentMethod: Joi.string().valid('cod', 'bank_transfer', 'momo', 'zalopay').required(),

  status: Joi.string().valid('pending', 'confirmed', 'shipping', 'completed', 'cancelled').optional(),

  note: Joi.string().allow('').optional()
});

const validateOrder =[
  validate(orderSchema),
  checkFinalPrice
]
module.exports={
    validateOrder
}