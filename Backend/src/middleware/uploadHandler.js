// Backend/middleware/uploadHandler.js
import { upload } from '../config/multer.js';
import cloudinary, { CLOUDINARY_FOLDERS } from '../config/cloudinary.js';
import fs from 'fs';

export const uploadAvatar = upload.single('avatar');
export const uploadCover = upload.single('cover');
export const uploadBlogThumbnail = upload.single('thumbnail');
export const uploadBlogContentImages = upload.array('contentImages', 10);

export const uploadToCloudinary = async (file, folder) =>{
     if(!file || !file.path){
          throw new Error("No valid file provided for upload");
     }
     try {
          const result = await cloudinary.uploader.upload(file.path, {
               folder,
               resource_type: 'image',
          });
          // Delete file from local storage after upload
          fs.unlinkSync(file.path);
          return{
               url: result.secure_url,
               publicId: result.public_id,
          };
     } catch (error) {
          if(fs.unlinkSync(file.path)){
               fs.unlinkSync(file.path);
          }
          throw new Error(`Cloudinary upload failed: ${error.message}`);
     }
};

export const deleteFromCloudinary = async (publicId) => {
     try {
          await cloudinary.uploader.destroy(publicId);
     } catch (error) {
         throw new Error('Cloudinary deletion failed'); 
     }
};