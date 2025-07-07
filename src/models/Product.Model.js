const mongoose=require('mongoose');
const ProductSchema= new mongoose.Schema(
    {
        name: {type:String, require: true,unique:true},
        image: {type:String},
        type: {type:String,require:true},
        price:{type:Number,require:true},
        countInStock:{type:Number,require:true},
        description:{type:String,require:true},
        disCount:{type:Number},
        selled:{type:Number}
    },
    {
        timestamp:true
    }
)

const Products=mongoose.model("Products",ProductSchema,"Products");
module.exports=Products;
