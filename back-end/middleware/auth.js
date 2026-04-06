import User from '../models/userModels.js'
import jwt from  'jsonwebtoken';

const JWT_TOKEN = 'koushikmehar';

export default async function authMiddleware(req,res,next)
{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        return res.status(401).json({
            success:false,
            message:'Not authorized or token missing'
        });
    }
    const token = authHeader.split(" ")[1];

    try{
        const payload = jwt.verify(token,JWT_TOKEN);
        const user = await User.findById(payload.id).select('-password');
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:'User not found'
            });
        }
        req.user = user;
        next()
    }
    catch(err)
    {
        console.error('JWT VErification failed :' ,err);
        return res.status(401).json({
            success:false,
            message:'Token Invalid or expired'
        })
    }
}