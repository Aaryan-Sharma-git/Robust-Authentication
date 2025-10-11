import mongoose from 'mongoose';
import { MONGO_URI } from '../constants/env.js';

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('connected to database');
  } catch (error) {
    console.log('could not connect to database: ', error);
    process.exit(1);
  }
};

export default connectToDB;
