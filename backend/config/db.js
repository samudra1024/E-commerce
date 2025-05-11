import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...'.yellow);
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected'.green);
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination'.yellow);
        process.exit(0);
      } catch (err) {
        console.error(`Error during MongoDB connection closure: ${err}`.red);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    // Retry connection after 5 seconds
    console.log('Retrying connection in 5 seconds...'.yellow);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;