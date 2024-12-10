import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return mongoose.connections[0];
  }
  
  return await mongoose.connect(process.env.MONGODB_URI as string);
}

export default connectDB; 