import {v2 as cloudinary} from "cloudinary"


import fs from "fs"
import dotenv from 'dotenv';

dotenv.config();




// console.log("Cloudinary credentials:", {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET 
//   });

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET  
  });

 
 
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("Error while uploading file on cloudinary ", error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



const getStreamFromCloudinary = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch Cloudinary file');
  return response.body;
};



export {uploadOnCloudinary, getStreamFromCloudinary};