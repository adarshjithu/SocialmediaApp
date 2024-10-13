import mongoose, { mongo } from 'mongoose';

const connectDB = async ():Promise<void> => {
  try {
    await mongoose.connect(`${'mongodb+srv://adarshjithu10:gnRFd0XoU2bJGXko@cluster0.xhehb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'}`, {
   

    });
    console.log('MongoDB connected...');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error: ${err.message}`);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1);
  }
};

export default connectDB;
