import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting connection test...');
console.log('MongoDB URI exists:', !!process.env.MONGO_URI);
console.log('MongoDB URI (partial):', process.env.MONGO_URI?.substring(0, 50) + '...');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('✅ Connection closed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });
