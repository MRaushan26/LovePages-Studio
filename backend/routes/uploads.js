import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

async function uploadToCloudinary(file, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });
    stream.end(file.buffer);
  });
}

router.post('/photos', upload.array('photos'), async (req, res, next) => {
  try {
    const files = req.files || [];

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const uploads = await Promise.all(
        files.map((file) => uploadToCloudinary(file, { folder: 'lovepages_studio', resource_type: 'image' }))
      );
      return res.json({ urls: uploads });
    }

    // If Cloudinary is not configured, return data URLs for preview (not persisted)
    const uploads = files.map((file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`);
    res.json({ urls: uploads });
  } catch (err) {
    next(err);
  }
});

router.post('/music', upload.single('music'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No audio file provided.' });
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const url = await uploadToCloudinary(file, {
        folder: 'lovepages_studio/music',
        resource_type: 'video',
        public_id: `${Date.now()}-${file.originalname}`
      });
      return res.json({ url });
    }

    // Fallback: store locally
    const uploadsDir = path.resolve(process.cwd(), 'uploads', 'music');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, file.buffer);
    const url = `/uploads/music/${filename}`;
    res.json({ url });
  } catch (err) {
    next(err);
  }
});

export default router;

