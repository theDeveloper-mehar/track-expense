import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect(
        'mongodb+srv://koushipulavarthi_db_user:Koushik12@cluster0.mjfwroe.mongodb.net/?appName=Cluster0'
    )
    .then(() => console.log('DB Connected'))
}