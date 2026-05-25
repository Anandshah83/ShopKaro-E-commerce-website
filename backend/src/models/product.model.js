
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    description: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required:true
    },
    inStock : {
        type: Boolean,
        required:true
    },
    image: {
        type: String,
        required:false
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    ratings: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
},{timestamps:true});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;











// const products=[];

// const getAllProducts=()=>{
//     //code part
//     return products;
// }

// const getProductById=(id)=>{
//     //code part
//     return products.find((product)=> product.id===id);
// }

// const createProduct=(productData)=>{
//     //code part

//     const newProduct={
//         id:Date.now(),
//         name:productData.name,
//         price:productData.price,
//         quantity:productData.quantity,
//         categoryId:productData.categoryId,
//         image:productData.image,
//         inStock:productData.inStock,
//         date:Date.now(),
//     }
//     products.push(newProduct);
//     return newProduct;
// }

// const updateProduct=(id,updateData)=>{
//     //code part
//     const Index=products.findIndex((product)=>id===product.id);
//     if(Index===-1){
//         return null;
//     }
//     return products[Index]= {...products[Index], ...updateData };
// }

// const deleteProduct=(id)=>{
//     //code part
//     const Index=products.findIndex((product)=> product.id===id);
//     if(Index===-1) return null;

//     const deleted=products[Index];
//     products.splice(Index,1);
//     return deleted;
// }


// module.exports={getAllProducts,getProductById,createProduct,updateProduct,deleteProduct};
