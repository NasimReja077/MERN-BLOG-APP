// Backend/src/db/index.js

import mongoose from "mongoose";

const connectDB = async () => {
     try {
          const connectionInStance = await mongoose.connect(process.env.MONGODB_URI);
          console.log(`\nMongoDB DataBase connected successfully!! DB HOST:${connectionInStance.connection.host}`);
     } catch (error) {
          console.log("WARNING!!! || MongoDB CONNECTION FAILED!!!", error);
          throw error;
     }
};

export default connectDB;