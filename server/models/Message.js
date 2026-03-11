const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true

    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true

    },
    contenet:{
        type:String,
        required:[true,'Message content is required'],
        trim:true

    },
    messageType:{
        type:String,
        enum:['text','image','video','file'],
        default:'text'

    },
    readStatus:{

    },
    deliveredStatus:{

    },


},{timestamps:true})

module.exports = mongoose.model('Message', messageSchema);