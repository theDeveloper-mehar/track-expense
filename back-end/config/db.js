import mongoose from 'mongoose';

export const connectDB = async()=>
{
    await mongoose.connect('mongodb+srv://koushipulavarthi_db_user:DZX1PVV2Kihdj57j@cluster0.mjfwroe.mongodb.net/?appName=Cluster0/Expense')
    .then(()=>console.log('DB Connected'))
}