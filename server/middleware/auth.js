const User=require('../models/User');
const jwt=require('jsonwebtoken');

const protect=async(req,res,next)=>{
    let token;

    if(req.header.authorization?.startsWith('Bearer')){
        try{

            const token=req.header.authorization.split(' ')[1];

            const decoded=jwt.verify(token,process.env.JWT_SECRET);

            req.user=await User.findById(decoded.id).select('-password');
        }
        catch(error){
            console.error(error);
            res.status(401).json({message:'Not authorized, token failed'})
        }
    }
    if(!token){
        res.status(401).json({message:'Not authorized, no token'})
    }
}

module.exports=protect;