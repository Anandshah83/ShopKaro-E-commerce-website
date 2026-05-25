const mongoose = require("mongoose");


const reviewProduct=new mongoose.Schema({
    //code here 
    productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required:true
    },

    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required:true
    },

    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    
    reviewComment: {
    type: String,
    required: true,
    minlength: [5, "Review must be at least 5 characters"],
    maxlength: [200, "Review cannot exceed 200 characters"]
    }


},{ timestamps:true });

const Review=mongoose.model('Review', reviewProduct);
module.exports=Review;