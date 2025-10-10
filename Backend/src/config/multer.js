import multer from 'multer';
import path from 'path';

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
};

const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|gif|webp/;

const storage = multer.diskStorage({
  destination: './public/uploads/', 
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}@-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extname = ALLOWED_IMAGE_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimetype = ALLOWED_IMAGE_TYPES.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, gif, webp) are allowed'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMITS.IMAGE },
  fileFilter,
});