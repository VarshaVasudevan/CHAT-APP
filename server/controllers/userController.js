const bcrypt = require('bcrypt');
const User = require('../models/User');

const getUserProfile = async (req, res) => {
    try{
        const user=User.findById(req.user._id).select('-password');
        res.json(user);

        if(!user){
            return res.status(404).json({message:'User not found'})
        }

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'})
    }
}
const getAllUsers = async (req, res) => {
    try{

        const users=User.find({_id:{$ne:req.user._id}}).select('-password');
        res.json(users);

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'})
    }
}
const updateUserProfile = async (req, res) => {

    const {name,email,password,bio,avatar}=req.body;

    const useExist=User.findById(req.user._id);

    if(!useExist){
        return res.status(404).json({message:'User not found'})
    }

    userExist.name=name || useExist.name;
    userExist.email=email || useExist.email;
    userExist.bio=bio || useExist.bio;
    userExist.avatar=avatar || useExist.avatar;

    if(password){
        const salt=await bcrypt.genSalt(10);
        userExist.password=await bcrypt.hash(password,salt);
    }

    const updatedUser=await userExist.save();

    res.json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        avatar:updatedUser.avatar,
        bio:updatedUser.bio
    })
}
const getUserById = async (req, res) => {
    try{
        const userid=req.params.id;

        const user=User.findById(userid).select('-password');
        res.json(user);
        if(!user){
            return res.status(404).json({message:'User not found'})
        }

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'})
    }
}

module.exports = {
    getUserProfile,
    getAllUsers,
    updateUserProfile,
    getUserById
}