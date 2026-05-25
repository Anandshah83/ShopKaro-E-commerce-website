
const order=require('../models/order.model');

const normalizeOrder = (doc) => {
    const data = doc.toObject ? doc.toObject() : doc;
    return {
        ...data,
        items: data.products || [],
        totalAmount: data.totalAmounts,
        shippingAddress: data.deliveryAddress
    };
};

const createOrder= async ( req , res ) =>{
    //code here 
    try{
        const { items, totalAmount, shippingAddress, razorpayOrderId, paymentMethod, paymentStatus } = req.body;

        if(!req.user.id || !Array.isArray(items) || items.length === 0 || totalAmount === undefined || !shippingAddress){
            return res.status(400).json({
                success:false,
                message:"data values are not found"
            });
        }
        const newOrder=await order.create({ 
            products: items, 
            totalAmounts: totalAmount, 
            deliveryAddress: shippingAddress, 
            paymentId: razorpayOrderId,
            paymentMethod: paymentMethod || 'razorpay',
            paymentStatus: paymentStatus || 'pending',
            status: 'pending',
            userId: req.user.id 
        });

        res.status(201).json({
            success:true,
            message:"Order created successfully",
            data:normalizeOrder(newOrder)
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
            data:null
        });
    }
}

const getUserOrders = async ( req , res ) =>{
    //code here
    try{
        const Orders=await order.find({ userId: req.user.id }).sort('-createdAt');
        res.status(200).json({
            success:true,
            message:"order retrieved successfully",
            data:Orders.map(normalizeOrder)
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
            data:null
        });
    }
}

const getOrderById= async ( req , res )=>{
    //code here
    try{
        const Orders=await order.findById(req.params.id);
        res.status(200).json({
            success:true,
            message:"order retrieved successfully",
            data:Orders ? normalizeOrder(Orders) : null
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
            data:null
        });
    }
}

const updateOrderStatus= async ( req , res )=>{
    //code here
    try{
        const data=await order.findByIdAndUpdate(req.params.id , req.body , { new:true } );
        if(!data){
            return res.status(404).json({
                success:false,
                message:"orders not found"
            });
        }

        res.status(200).json({
            success:true,
            message:"order updated successfully",
            data:data
        });
    }
   catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
            data:null
        });
    }
}

const getAllOrders = async ( req , res )=>{
    //code here
    try{
        const orders=await order.find().sort('-createdAt');
        res.status(200).json({
            success:true,
            message:"All Orders get successfully",
            data:orders.map(normalizeOrder)
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}


module.exports = { createOrder, getUserOrders, getOrderById, updateOrderStatus, getAllOrders };
