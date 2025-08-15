import mongoose from 'mongoose';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    throw new Error("Failed to connect to MongoDB: ");
  }
};

export default connectToMongoDB;
   