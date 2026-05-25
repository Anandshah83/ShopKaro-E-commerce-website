
const mongoose= require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const product=require('../models/product.model.js');
// const user=require('../models/user.model.js');

const products=[
    {
        name: 'Nike Air Max 270',
        price: 7999,
        quantity:4,
        inStock: true,
        description: 'Premium running shoes with air cushioning',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    },
    {
        name: 'Apple iPhone 15',
        price: 79999,
        quantity:5,
        inStock: true,
        description: 'Latest Apple smartphone with advanced features',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    },
    {
        name: 'Samsung 4K Smart TV 55"',
        price: 49999,
        quantity:34,
        inStock: true,
        description: '4K UHD Smart TV with HDR support',
        image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500',
    },
    {
        name: 'Sony WH-1000XM5 Headphones',
        price: 29999,
        quantity:8,
        inStock: true,
        description: 'Premium noise-cancelling wireless headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    },
    {
        name: 'iPad Pro 12.9"',
        price: 119999,
        quantity:6,
        inStock: true,
        description: 'Professional tablet with M2 chip',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3af4abd8?w=500',
    },
    {
        name: 'MacBook Pro 14"',
        price: 199999,
        quantity:3,
        inStock: true,
        description: 'High-performance laptop for professionals',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    },
    {
        name: 'Canon EOS R5 Camera',
        price: 389999,
        quantity:2,
        inStock: true,
        description: 'Professional mirrorless camera',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500',
    },
    {
        name: 'DJI Mavic 3 Drone',
        price: 169999,
        quantity:4,
        inStock: true,
        description: '4K camera drone with professional features',
        image: 'https://images.unsplash.com/photo-1507582020471-1b03fccebf47?w=500',
    },
    {
        name: 'Samsung Galaxy Watch 6',
        price: 19999,
        quantity:15,
        inStock: true,
        description: 'Advanced smartwatch with health tracking',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    },
    {
        name: 'AirPods Pro (2nd Gen)',
        price: 24999,
        quantity:20,
        inStock: true,
        description: 'Premium wireless earbuds with noise cancellation',
        image: 'https://images.unsplash.com/photo-1572533382519-f778c3a18dae?w=500',
    },
    {
        name: 'RTX 4090 Graphics Card',
        price: 169999,
        quantity:5,
        inStock: true,
        description: 'High-end gaming graphics card',
        image: 'https://images.unsplash.com/photo-1587829191301-8d046e7f1b98?w=500',
    },
    {
        name: 'Mechanical Keyboard RGB',
        price: 8999,
        quantity:25,
        inStock: true,
        description: 'Premium gaming keyboard with RGB lighting',
        image: 'https://images.unsplash.com/photo-1587829191301-8d046e7f1b98?w=500',
    },
]

const seedDb= async ()=>{
    // code here 
    try{
        // connect to databases 
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");

        // const adminUser=await user.findOne({role : admin});
        // if (!adminUser) {
        //     console.log('No admin user found! Please create an admin user first.')
        //     process.exit(1)
        // }
    
        // clear existing data
        await product.deleteMany({});
        console.log("All product details deleted");
    
        // insert new data
        await product.insertMany(products);
        console.log("Products Inserted Successfully");
    
        // disconnect
        await mongoose.disconnect();
        console.log("Mongoose Disconnected Successfully");


    }
    catch(error){
        console.log(error.message);
        process.exit(1);
    }
}

seedDb();