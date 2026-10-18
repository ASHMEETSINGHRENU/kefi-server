import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kefi_by_mukta';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`[MongoDB Atlas] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    const sanitizedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.warn(`[MongoDB] Notice: Could not connect to MongoDB at ${sanitizedUri}.`);
    console.warn(`[MongoDB] Error: ${error.message}`);
    console.warn(`[MongoDB] Running in graceful local fallback mode (in-memory persistence active).`);
    return false;
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState,
});
