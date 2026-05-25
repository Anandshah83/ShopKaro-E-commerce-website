const express=require('express');
const authMiddleware = require('../middleware/auth');
const { createReview, getAllReviews, deleteReview } = require('../controllers/review.controller');


const router=express.Router();


router.get('/:id', getAllReviews );
router.post('/:id', authMiddleware, createReview );
router.delete('/:id',authMiddleware, deleteReview );

module.exports= router;