const mongoose=require('mongoose');
const userSchema= new mongoose.Schema(
    {
        name: {type:String},
        email: {type:String,require:true, unique:true},
        password: {type:String,require:true},
        IsAdmin:{type:Boolean,require:true,default:false},
        phone:{type:Number},
        address: {type: String},
        avt: {type:String}
    },
    {
        timestamp:true
    }
)

const Users=mongoose.model("Users",userSchema,"Users");
module.exports=Users;

