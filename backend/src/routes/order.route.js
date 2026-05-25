
const express=require('express');
const authMiddleware = require('../middleware/auth');
const authRole = require('../middleware/role');
const router=express.Router();

const {getUserOrders, getOrderById, createOrder, updateOrderStatus, getAllOrders }= require('../controllers/order.controller');

router.get('/all', authMiddleware, authRole, getAllOrders);
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById);
router.post('/', authMiddleware, createOrder);
router.put('/:id/status', authMiddleware, authRole, updateOrderStatus);


module.exports=router;
