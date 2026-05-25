const express=require('express');
const authMiddleware=require('../middleware/auth');
const authRole=require('../middleware/role');

const { fetchAllProducts, fetchProductById, createNewProduct,uploadProductImage, updateProduct, deleteProduct } = require('../controllers/product.controller');
const router=express.Router();
const upload=require('../config/multer');


router.get('/', fetchAllProducts);
router.get('/:id', fetchProductById);
router.post('/',authMiddleware,authRole, createNewProduct);
router.put('/:id',authMiddleware,authRole, updateProduct);
router.delete('/:id',authMiddleware,authRole, deleteProduct);
router.post('/:id/upload', authMiddleware, authRole, upload.single('image'), uploadProductImage);

module.exports = router;
