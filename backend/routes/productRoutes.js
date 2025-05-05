import express from 'express';
import {
  getProducts,
  getProductById,
  createProductReview,
  getTopProducts,
  getRelatedProducts,
  getProductCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/top').get(getTopProducts);
router.route('/categories').get(getProductCategories);
router.route('/related/:id').get(getRelatedProducts);
router.route('/:id/reviews').post(protect, createProductReview);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;