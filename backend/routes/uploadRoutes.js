import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware.js';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads/'));
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type

/**
 * Checks if the provided file is a valid image (jpg, jpeg, png).
 * @param {Object} file - The file object with 'originalname' and 'mimetype'.
 * @param {Function} cb - Callback function to handle the result.
 */
function checkFileType(file, cb) {
  const filetypes = /jpe?g|png|gif|webp/i;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only (jpeg, jpg, png, gif, webp)!');
  }
}

// Initialize upload
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

// Route for uploading product images
router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  (req, res) => {
    console.log(req.file)
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }
    //Get relative path of the image in req.file
    console.log(req.file.path)
    console.log({ url: `/${req.file.path.replace(/\\/g, '/')}` })
    res.json({ url: `/${req.file.path.replace(/\\/g, '/')}` });
  }
);

export default router;