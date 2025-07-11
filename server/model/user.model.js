const mongoose=require("mongoose")
const Schema=mongoose.Schema

const userSchema= new Schema({
    userId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},
{
    timestamps:true
}
)

module.exports = mongoose.model("user",userSchema); 