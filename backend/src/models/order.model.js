const mongoose=require('mongoose');

const trackingEventSchema = new mongoose.Schema({
    event: { type: String, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'], required: true },
    location: { type: String },
    timestamp: { type: Date, default: Date.now },
    description: { type: String }
});

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
        default: "pending",
        enum: ['pending', 'paid', 'failed']
    },
    paymentId:{
        type:String,
        required:false
    },
    status:{
        type:String,
        default: "pending",
        enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']
    },
    trackingNumber: {
        type: String,
        sparse: true
    },
    estimatedDelivery: {
        type: Date
    },
    currentLocation: {
        type: String,
        default: "Warehouse"
    },
    trackingHistory: [trackingEventSchema],
    notes: {
        type: String
    }
},{timestamps : true });

const order = mongoose.model('order', orderSchema);
module.exports= order ;
