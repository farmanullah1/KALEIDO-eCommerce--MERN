import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env.js';
import { storage as cloudinaryStorage } from '../config/cloudinary.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const router = express.Router();

const isCloudinaryConfigured = !!(
  env.CLOUDINARY_CLOUD_NAME &&
  env.CLOUDINARY_API_KEY &&
  env.CLOUDINARY_API_SECRET
);

let storage: any;

if (isCloudinaryConfigured) {
  console.log('☁️ Using Cloudinary storage for uploads');
  storage = cloudinaryStorage;
} else {
  console.log('💾 Cloudinary credentials missing. Falling back to local disk storage.');
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
}

const upload = multer({ storage });

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json(errorResponse('No file uploaded'));
  }

  let url: string;
  let public_id: string;

  if (isCloudinaryConfigured) {
    url = (req.file as any).path;
    public_id = (req.file as any).filename;
  } else {
    // Return local URL
    const port = env.PORT || '5000';
    url = `http://localhost:${port}/uploads/${req.file.filename}`;
    public_id = req.file.filename;
  }

  res.json(successResponse({
    url,
    public_id,
  }, 'Image uploaded successfully'));
});

export default router;
