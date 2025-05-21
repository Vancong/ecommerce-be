const mongoose=require('mongoose');
const userSchema= new mongoose.Schema(
    {
        name: {type:String, require: true},
        email: {type:String,require:true, unique:true},
        password: {type:String,require:true},
        IsAdmin:{type:Boolean,require:true,default:false},
        phone:{type:Number,require:true},
        access_token:{type: String, require:true},
        refresh_token:{type:String,require:true}
    },
    {
        timestamp:true
    }
)

const User=mongoose.model("User",userSchema);
module.exports=User;