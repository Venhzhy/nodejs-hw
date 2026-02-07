import cloudinary from 'cloudinary';
import { Readable } from 'stream';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

