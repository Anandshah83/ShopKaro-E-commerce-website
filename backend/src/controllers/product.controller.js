
const product=require('../models/product.model.js');

const fetchAllProducts= async ( req , res)=>{
    //code here 
    try{
        //search params
        const page=parseInt(req.query.page) || 1 ;
        const limit=parseInt(req.query.limit) || 10 ;
        
        //skip the initial 
        const skip=(page-1)*limit;

        const keyword=req.query.search ? { name : { $regex: req.query.search, $options : 'i' }} : {} ;
        if(req.query.category) keyword.categoryId = req.query.category;
        const sort = req.query.sort || '-createdAt';

        const totalProducts=await product.countDocuments(keyword);

        const data=await product.find(keyword).sort(sort).skip(skip).limit(limit);

        res.status(200).json({ 
            success:true,
            message:"Fetched All Products Successfully",
            totalProducts,page,limit,
            data:data
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

const fetchProductById = async (req,res)=>{
    //code here
    try{
        const data=await product.findById(req.params.id);
        if(!data){
            return res.status(404).json({
                success:false,
                message:"product not found",
                data:null
            });
        }

        res.status(200).json({
            success:true,
            message:"product fetch by Id successfully",
            data:data
        });
    }
    catch(error){
        res.status(404).json({
            success:false,
            message:error.message
        });
    }
}

const createNewProduct=async ( req , res )=>{
    //code here 
    try{
        const data={ ...req.body };
        if(data.stock !== undefined && data.quantity === undefined) data.quantity = data.stock;
        if(data.inStock === undefined) data.inStock = Number(data.quantity) > 0;
        if( !data.name || data.price === undefined || data.quantity === undefined ){
            return res.status(400).json({
                success:false,
                message:"data values are not found"
            });
        }

        const newProduct=await product.create(data);
        res.status(201).json({
            success:true,
            message:"New product created successfully",
            data:newProduct
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}  

const uploadProductImage=async ( req , res )=>{
    //code here 
    try{
        const foundproduct=await product.findById(req.params.id);
        if(!foundproduct){
            return res.status(404).json({
                "success":false,
                "message":"no product found",
                "data":null
            });
        }
        if(!req.file){
            return res.status(400).json({
                "success":false,
                "message":"image not get",
                "data":null
            });
        }
        const imageUrl = req.file.path || req.file.secure_url || req.file.filename;
        const updatedProduct=await product.findByIdAndUpdate(req.params.id , { image: imageUrl }, { new: true } );
        return res.status(200).json({
            "success":true,
            "message":"image uploaded successfully",
            "data":updatedProduct
        });
    }

    catch(error){
         res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

const updateProduct = async ( req , res )=>{
    //code here 
    try{
        const updateData = { ...req.body };
        if(updateData.stock !== undefined && updateData.quantity === undefined) updateData.quantity = updateData.stock;
        if(updateData.quantity !== undefined) updateData.inStock = Number(updateData.quantity) > 0;
        const data=await product.findByIdAndUpdate(req.params.id,updateData,{ new:true });
        if(!data){
            return res.status(404).json({
                success:false,
                message:"product not found"
            });
        }

        res.status(200).json({
            success:true,
            message:"product updated successfully",
            data:data
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

const deleteProduct=async ( req , res )=>{
    //code here
    try{
        const data=await product.findByIdAndDelete(req.params.id);
        if(!data){
            return res.status(404).json({
                success:false,
                message:"product not found"
            });
        }
        res.status(204).send()
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}


module.exports={ fetchAllProducts,fetchProductById,createNewProduct,uploadProductImage,updateProduct,deleteProduct};









// const {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct} = require('../models/product.model.js');

// const fetchAllproducts= (req,res)=>{

//     const data=getAllProducts();
//     res.status(200).json({
//         "success":true,
//         "message": "Products fetched successfully",
//         "data":data,
//     });
// }

// const fetchProductById= (req,res)=>{
    
//     const id=parseInt(req.params.id);
//     const data=getProductById(id);
//     if(data){
//         res.status(200).json({
//             "success":true,
//             "message": "Products by Id fetched successfully",
//             "data":data,
//         });
//     }
//     else{
//         res.status(404).json({
//             "success": false,
//             "message": "Product not found",
//             "data": null
//         });
//     }
// }

// const createNewProduct= (req,res)=>{
    
//     const NewProductData=req.body;
//     if(!NewProductData.name || !NewProductData.price || !NewProductData.quantity || !NewProductData.inStock){
//         return res.status(400).json({
//             "success":false,
//             "message":"Input Invalid",
//             "data":null,
//             });
//     }
//     const product=createProduct(NewProductData);
//     res.status(201).json({
//         "success": true,
//         "message": "product created successfuly",
//         "data":product,
//     });
// }   
    
// const uploadProductImage=(req,res)=>{
//     const id=parseInt(req.params.id);
//     const product = getProductById(id);
//     if(!product){
//         return res.status(404).json({
//             "success":false,
//             "message":"no product found",
//             "data":null,
//         });
//     }
//     if(!req.file){
//         return res.status(400).json({
//             "success":false,
//             "message":"image not get",
//             "data":null,
//         });
//     }
//     const newdata=updateProduct(id,{image:req.file.filename});
//     return res.status(200).json({
//         "success":true,
//         "message":"image uploaded successfully",
//         "data":newdata,
//     });
// }

// const updateNewProduct= (req,res)=>{
    
//     const id=parseInt(req.params.id);
//     const Updateddata=req.body;
//     if( !Updateddata || Object.keys(Updateddata).length===0 ){
//         return res.status(400).json({
//             "success":false,
//             "message":"Data is not provided",
//             "data":null,
//             });
//     }
//     const result=updateProduct(id,Updateddata);

//     if(result === null){
//         res.status(404).json({
//             "success": false,
//             "message": "product not found",
//             "data":result,
//         });
//     }
//     else{
//         res.status(200).json({
//             "success": true,
//             "message": "product updated successfully",
//             "data":result,
//         });
//     }
// }

// const deleteNewProduct= (req,res)=>{
    
//     const id=parseInt(req.params.id);
//     const deleteddata=deleteProduct(id);
//     if(deleteddata===null){
//         res.status(404).json({
//             "success":false,
//             "message":"product not found",
//             "data":deleteddata,
//         });
//     }
//     else{
//         res.status(204).send();
//     }
// }

// module.exports ={ fetchAllproducts, fetchProductById, createNewProduct,uploadProductImage, updateNewProduct, deleteNewProduct};
