import mongoose from 'mongoose';

export const connectDB = async()=>
{
    await mongoose.connect('mongodb+srv://koushipulavarthi_db_user:hkdQTS4jSEeg5HQI@cluster0.a7zi3og.mongodb.net/Expense')
    .then(()=>console.log('DB Connected'))
}