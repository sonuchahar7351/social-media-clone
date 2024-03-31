const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    body: {
        type: String,
    },
    picture: {
        type: String,
        required: true,
    },
    likes: [{ type: ObjectId, ref: "user"  }],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"user"}
    }],
    postedBy: {
        type: ObjectId,
        ref: "user"
    }
},{timestamps:true})

mongoose.model('post', postSchema)