import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Atlas connected');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

export { connectDB };
