const mongoose= require('mongoose');
const { Schema }= mongoose;

const NoteSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
    },
    description:{
        type: String
    },
    tag:{
        type:String
    },
    Date:{
        type:Date,
        default : Date.now()
    }
})

module.exports=mongoose.model('Note',NoteSchema)