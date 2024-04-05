import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    if (!process.env.CONNECTION_STRING) {
      console.log("Connection string not found");
      return;
    }
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "Database connected:",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
