const mongoose=require('mongoose');
const ProductSchema= new mongoose.Schema(
    {
        name: {type:String, require: true,unique:true},
        image: {type:String, unique:true},
        type: {type:String,require:true},
        price:{type:Number,require:true},
        countInStock:{type:Number,require:true},
        description:{type:String,require:true}
    },
    {
        timestamp:true
    }
)

const Product=mongoose.model("User",ProductSchema);
module.exports=Product;