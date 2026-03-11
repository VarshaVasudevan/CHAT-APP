const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Name is required'],
            trim:true,
            maxLength:[50,'Name cannot exceed 50 characters']

        },
        email:{
            type:String,
            required:[true,'Email is required'],
            unique:true,
            lowercase:true,
            match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,'Please fill a valid email address']
           
        },
        password:{
            type:String,
            required:[true,'Password is required'],
            minLength:[6,'Password must be at least 6 characters']
            
        },
        avatar:{
            type:String,
            default:''

        },
        bio:{
            type:String,
            maxLength:[200,'Bio cannot exceed 200 characters']

        },
        status:{
            type:String,
            enum:['online','offline','away'],
            default:'offline'

        },
        lastSeen:{
            type:Date,
            default:Date.now
        }
},{timestamps:true}
)

module.exports = mongoose.model('User', userSchema);