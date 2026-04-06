import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect(
        'mongodb+srv://koushipulavarthi_db_user:DZX1PVV2Kihdj57j@cluster0.mjfwroe.mongodb.net/Expense?retryWrites=true&w=majority'
    )
    .then(() => console.log('DB Connected'))
}