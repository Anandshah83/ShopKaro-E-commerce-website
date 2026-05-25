const Razorpay= require('razorpay');
const crypto = require('crypto');


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


const createOrder= async ( req , res )=>{
    //code here 
    try{
        const {amount}=req.body;
        const order = await razorpay.orders.create({
            amount: amount * 100, // Razorpay uses paise, multiply by 100
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });
        res.status(200).json({
            success:true,
            message:"Order Created Successfully",
            data:order
        });
    }
    catch(error){
       res.status(400).json({
            success:false,
            message:error.message
       });
    }
}

const verifyPayment= async ( req , res )=>{
    //code here 
    try{
        const { razorpay_order_id , razorpay_payment_id , razorpay_signature }=req.body;

        const body=razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');
        if(expectedSignature === razorpay_signature) {
            res.status(200).json({
                success:true,
                message:"Payment is genuine"
            });
        } else {
            res.status(400).json({
                success:false,
                message:"Payment is fake"
            });
        }
    }
    catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}

module.exports= { createOrder , verifyPayment };