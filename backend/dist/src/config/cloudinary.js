import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { env } from './env.js';
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});
export const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'kaleido',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    },
});
export default cloudinary;
//# sourceMappingURL=cloudinary.js.map