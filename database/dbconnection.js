import mongoose from "mongoose";

const dbconnection = async () => {
  try {

    

    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB Connected Successfully");
    

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default dbconnection;