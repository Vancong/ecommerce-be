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

//product
const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  brand: Joi.string().optional().allow(null, ''),
  gender: Joi.string().valid('Nam', 'Nữ', 'Unisex').required(),
  concentration: Joi.string().required(),
  scentDuration: Joi.string().required(),
  discount: Joi.number().min(0).max(100).default(0),
  isActive: Joi.boolean().optional(),
  sizes: Joi.array().items(
    Joi.object({
      volume: Joi.number().positive().required(),
      price: Joi.number().min(0).required(),
      countInStock: Joi.number().integer().min(0).required()
    })
  ).min(1).required(),
  oldImages: Joi.string().optional()
});

const validateProduct = (req, res, next) => {
    try {
        if (typeof req.body.sizes === 'string') {
        req.body.sizes = JSON.parse(req.body.sizes);
        
        }
        if (!Array.isArray(req.body.sizes)) {
            return res.status(400).json({
                status: 'ERR',
                message: '"sizes" phải là mảng',
            });
        }
        req.body.sizes = req.body.sizes.map(size => ({
            volume: Number(size.volume),
            price: Number(size.price),
            countInStock: Number(size.countInStock)
        }));
         req.body.sizes.sort((a, b) => a.volume - b.volume);  
          if(req.body.discount!== undefined) {
            req.body.discount = Number(req.body.discount);
         }
        return validate(productSchema)(req, res, next);  

    } catch (err) {
        return res.status(400).json({
          status: 'ERR',
          message: err.message || 'Loi dau vao',
        });
    }
   
};


//user

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required()
});
const validateSignup=(req,res,next) =>{
      return validate(signupSchema)(req, res, next);  
}

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const validateLogin=(req,res,next) =>{
      return validate(loginSchema)(req, res, next);  
}

const updateUserSchemaForAdmin = Joi.object({
  name: Joi.string().optional().allow('', null),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  phone: Joi.number().optional().allow('', null),
  address: Joi.string().optional().allow('', null),
  avt: Joi.string().optional().allow('', null),
  isAdmin: Joi.boolean().optional(),     
  isActive: Joi.boolean().optional()     
});

const updateUserSchemaForUser = Joi.object({    
  name: Joi.string().optional().allow('', null),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  phone: Joi.number().optional().allow('', null),
  address: Joi.string().optional().allow('', null),
  avt: Joi.string().optional().allow('', null),
  isAdmin: Joi.forbidden(),
  isActive: Joi.forbidden()    
});

const validateUpdateUser = (req, res, next) => {
  const schema = req.user.isAdmin ? updateUserSchemaForAdmin : updateUserSchemaForUser;
  return validate(schema)(req, res, next);
};

module.exports = {
  validateProduct,
  validateSignup,
  validateLogin,
  validateUpdateUser
};