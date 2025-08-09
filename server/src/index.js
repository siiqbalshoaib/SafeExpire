if (process.env.NODE_ENV !== 'production') {
    try {
      // Use dynamic import to avoid ESM static resolution issues
      const dotenv = await import('dotenv');
      dotenv.config();
      console.log('✅ Local environment variables loaded from .env');
    } catch (err) {
      console.warn('⚠️ dotenv not found locally. Skipping .env loading.');
    }
  }

import connectDB from "./db/db.js";
import {app} from './app.js'


dotenv.config({
    path : './.env'
});
console.log("ENV:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

