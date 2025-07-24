import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not set in the environment variables.');
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };
    // console.log('This is the Mongo_url : ',process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(chalk.cyan.underline`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(chalk.red.bold`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log(chalk.yellow.underline`MongoDB disconnected. Attempting to reconnect...`);
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      console.log(chalk.yellow`MongoDB reconnected`);
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log(chalk.yellow`MongoDB connection closed through app termination`);
        process.exit(0);
      } catch (err) {
        console.error(chalk.red.bold`Error during MongoDB connection closure: ${err}`);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error(chalk.red.bold`Error: ${error.message}`);
    // Retry connection after 5 seconds
    console.log(chalk.yellow.bold`Retrying connection in 5 seconds...`);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;