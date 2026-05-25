
const express=require('express');
const { fetchAllProducts, updateProduct,deleteProduct } = require('../controllers/product.controller');
const { fetchAllUsers , deleteUser }= require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');
const authRole = require('../middleware/role');
const router=express.Router();

router.get('/users',authMiddleware, authRole,fetchAllUsers);
router.delete('/users/:id',authMiddleware, authRole , deleteUser );
router.get('/products',authMiddleware,authRole,fetchAllProducts);
router.delete('/products/:id',authMiddleware,authRole, deleteProduct);
router.put('/products/:id',authMiddleware,authRole, updateProduct);

module.exports=router;