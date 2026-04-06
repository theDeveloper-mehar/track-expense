import User from '../models/userModels.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_SECRET = 'koushikmehar';
const TOKEN_EXPIRES = '24h';


const createToken = (userId) =>
{
    return jwt.sign({id:userId} , JWT_SECRET , {expiresIn :TOKEN_EXPIRES});
}


//register user

export async function registerUser(req,res)
{
    const{name,email,password} = req.body;

    if(!name || !email || !password)
    {
        return res.status(400).json({
            success : false,
            message : 'All fields are required.'
        })
    }
    if(!validator.isEmail(email))
    {
        return res.status(400).json({
            success:false,
            message: 'Invald Email'
        })
    }
    if(password.length < 8)
    {
        return res.status(400).json({
            success:false,
            message : 'Password must be 8 Characters'
        })
    }
    try{
        if(await User.findOne({email}))
        {
            return res.status(409).json({
                success:false,
                message : 'User already Present'
            })
        }
        const hashed = await bcrypt.hash(password,10);
        const user = await User.create({name,email,password:hashed})
        const token = createToken(user._id)
        res.status(201).json({
            success :true,
            token,
            user :{id : user._id , name : user.name , email : user.email}
        })
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({
            success:false,
            message:'Server error'
       })
    }
}


// Login

export async function loginUser(req,res)
{
    const{email , password} = req.body;
    if(!email || !password)
    {
        return res.status(400).json({
            success:false,
            message : 'Email and passwword both are required'
        })
    }
    try{
        const user  = await User.findOne({email})
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:'Invalid email or password'
            });
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match)
        {
            return res.status(401).json({
                success:false,
                message:"Invlid email or password"
            });
        }
        const token = createToken(user._id);
        res.json({
            success:true,
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:'Server Error'
        })
    }

}


// to get user details

export async function getUser(req,res)
{
    try{
    const user = await User.findById(req.user.id).select('name email');
    if(!user)
    {
        return res.status(400).json({
            success:false,
            message:'User not Found'
        })
    }
    res.json({
        success:true,
        user
    })
}
catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:'Server Error'
        })
    }

}


// to update a user profile

export async function updateProfile(req,res)
{
    const {name , email} = req.body;
    if(!name || !email || !validator.isEmail(email))
    {
        return res.status(400).json({
            success:false,
            message:"Valid email and name are required"
        })
    }
   try{
    const exists = await  User.findOne({email, _id:{$ne : req.user.id}});
    if(exists)
    {
        return res.status(409).json({
            success:false,
            message:'Email already in use'
        });
    }
    const user = await User.findByIdAndUpdate(req.user.id,{name,email},
        {
            new:true,
            runValidators:true,
            select:'name email'
        }
    )
    res.json({
        success:true,
        user
    })
   }
   catch(err)
   {
        console.error(err);
        res.status(500).json({
            success:false,
            message:'Server Error'
        })
   }
}


// to change password

export async function updatePassword(req,res)
{
    const {currentPassword , newPassword} = req.body;
    if(!currentPassword || !newPassword || newPassword.length < 8)
    {
        return res.status(400.).json({
            success:false,
            message:'Invalid Password or too short'
        });
    }
    try{
        const user = await User.findById(req.user.id).select('password');
        if(!user)
        {
            return res.status(404).json({
                success:false,
                message:'User not Found'
            });
        }
        const match = await bcrypt.compare(currentPassword , user.password);
        if(!match)
        {
            return res.status(401).json({
                success:false,
                message:'Current Password is incorrect'
            })
        }
        user.password = await bcrypt.hash(newPassword,10)
        await user.save();
        res.json({
            success:true,
            message:'Password Changed'
        })
    }
    catch(err)
    {
         console.error(err);
        res.status(500).json({
            success:false,
            message:'Server Error'
        })
    }
}