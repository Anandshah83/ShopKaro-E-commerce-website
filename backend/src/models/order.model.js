
const mongoose=require('mongoose');

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    products:[
        {
            product:{ type:mongoose.Schema.Types.ObjectId , ref: "Product"},
            qty: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmounts:{
        type:Number,
        required:true
    },
    deliveryAddress:{
        type:Object,
        required:true
    },
    paymentMethod:{
        type:String,
        default: "razorpay"
    },
    paymentStatus:{
        type:String,
        default: "pending" 
    },
    paymentId:{
        type:String,
        required:false
    },
    status:{
        type:String,
        default: "pending" 
    }
},{timestamps : true });

const order = mongoose.model('order', orderSchema);
module.exports= order ;
