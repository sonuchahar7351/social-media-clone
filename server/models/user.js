const mongoose = require ('mongoose');
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    dp:{
        type:String,
        default:'https://res.cloudinary.com/ascoder/image/upload/v1711302086/opjujso3dr4bn0w9mo82.png'
    },
    followers:[{type:ObjectId, ref:"user"}],
    following:[{type:ObjectId, ref:"user"}],
    stories:[{
        user:{type:ObjectId,ref:"user"},
        storyPic:String,
        storyDate:Date,
    }]
})

mongoose.model("user",userSchema);