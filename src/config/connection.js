import mongoose from "mongoose";

const connectDB = async () => {
  console.log(process.env.MONGO_URI, "mongouri");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected`);
  } catch (err) {
    console.log(`connection error ${err}`);
    process.exit(1);
  }
};

export default connectDB;
