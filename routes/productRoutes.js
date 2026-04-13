const express = require('express');
const router = express.Router();
const multer = require('multer');

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'), false);
  }
});

const { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProductById
} = require('../controllers/productController');

// Routes
router.get('/', getAllProducts);
router.post('/', upload.array('images', 10), createProduct);   
//router.put('/:id', updateProduct);
router.get('/:id', getProductById );
router.put('/:id', upload.array('images', 10), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;