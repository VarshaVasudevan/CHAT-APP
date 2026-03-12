const User=require('../models/User');
const generateToken=require('../utils/generateToke');
const bcrypt=require('bcryptjs');

const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        const userExist=User.findOne({email});

        if(userExist){
            return res.status(400).json({message:'User already exists'})
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const user=await User.create({
            name,
            email,
            password:hashedPassword
        })

        return res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            bio:user.bio,
            token:generateToken(user._id)
        })

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'})
    }
}

const loginUser=async(req,res)=>{
    try{

        const{email,password}=req.body;

        const user=User.findOne({email});
    
        if(user && (await bcrypt.compare(password,user.password))){
            return res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                avatar:user.avatar,
                bio:user.bio,
                token:generateToken(user._id)
            })
        }
        else{
            res.status(401).json({message:'Invalid email or password'})
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'})
    }
  
}

module.exports={
    registerUser,
    loginUser
}