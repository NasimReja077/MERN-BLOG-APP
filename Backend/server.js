// Backend/index.js // node js and mongodb connection

import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";


// Load environment variables
dotenv.config({
     path: './.env'
});

const PORT = process.env.PORT || 7000;

// Connect to database and start server
(async () => {
     try {
          await connectDB();
          // Start server
     app.listen(PORT, () =>{
          console.log(`✅ Server is running at port: ${PORT}`);
          console.log(`Server URL: http://localhost:${PORT}`);
          console.log(`Health Check: http://localhost:${PORT}/health`);
     });

     app.on("error", (err) => {
          console.error("❌ WARNING!!! Express App error:", err);
          throw err;
     });
     } catch (err) {
          console.error("❌WARNING!!! MongoDB Database Connection FAILED!!!", err);
          process.exit(1);
     }
})();