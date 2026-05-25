
const Review=require('../models/review.model');

const createReview=async ( req , res )=>{
    //code here 
    try{
        const userId=req.user.id;
        const productId=req.params.id;
        const rating=req.body.rating;
        const comment=req.body.reviewComment;

        const newReview=await Review.create({
            userId,
            productId,
            rating,
            reviewComment: comment
        });
        res.status(201).json({
            success:true,
            message:"Review Created",
            data:newReview
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

const getAllReviews=async ( req , res )=>{
    //code here
    try{
        const productId=req.params.id;
        const review=await Review.find({productId}).populate('userId', ' name email ');
        res.status(200).json({
            success:true,
            message:"Reviews fetched",
            data:review
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
    
}

const deleteReview=async ( req , res )=>{
    //code here 
    try{
       const review=await Review.findById(req.params.id);
       if(!review){
            return res.status(404).json({
                success:false,
                message:"Review not found"
            });
       }
       if(review.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // delete review
        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports={ createReview, getAllReviews, deleteReview };