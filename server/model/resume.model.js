const mongoose=require('mongoose')
const Schema=mongoose.Schema

const resumeSchema=new Schema({
    id:{
        type:String,
        required:true
    },
    resumeHash:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    status:{
        type:String,
    },
    // analysisType:{
    //     type:String,
    //     required:true
    // },
    feedback:{
        score:{
            type:Number,
            required:true
        }, 
        improvements: {
            type:Array,
        },
        strengths:{
            type:Array,
        }
    },
    },
{
    timestamps:true
}
)

module.exports = mongoose.model("resume",resumeSchema);