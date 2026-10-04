const mongoose = require('mongoose');

/**
 * connectDB - Connects to MongoDB using the MONGO_URI from environment variables.
 * This function is called once when the server starts.
 * If the connection fails, the server will exit with an error message.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please check your MONGO_URI in the .env file.');
    process.exit(1);
  }
};

module.exports = connectDB;
