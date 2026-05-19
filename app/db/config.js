const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // connects project to MongoDB database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;