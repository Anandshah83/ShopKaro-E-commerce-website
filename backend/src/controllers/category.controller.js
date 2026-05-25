
const category=require('../models/category.model.js');

const fetchAllCategory=async ( req , res )=>{
    //code here
    try{
        const data=await category.find();
        res.status(200).json({
            success:true,
            message:"Fetched All category Successfully",
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

const fetchCategoryById=async ( req, res)=>{
    //code here 
    try{
        const data=await category.findById(req.params.id);
        if(!data){
            return res.status(404).json({
                success:false,
                message:"category not found",
                data:null
            });
        }
        res.status(200).json({
            success:true,
            message:"category fetch by Id successfully",
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

const createNewCategory=async( req , res )=>{
    //code here
    try{
        const data=req.body;
        if( !data.name ){
            return res.status(400).json({
                success:false,
                message:"data values are not found"
            });
        }
        const newCategory=await category.create(data);
        res.status(201).json({
            success:true,
            message:"New category created successfully",
            data:newCategory
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

const updateCategory=async ( req , res )=>{
    //code here 
    try{
        const data=await category.findByIdAndUpdate(req.params.id , req.body , { new : true });
        if(!data){
            return res.status(404).json({
                success:false,
                message:"category not found"
            });
        }

        res.status(200).json({
            success:true,
            message:"category updated successfully",
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

const deleteCategory=async ( req , res )=>{
    //code here 
    try{
        const data=await category.findByIdAndDelete(req.params.id);
        if(!data){
            return res.status(404).json({
                success:false,
                message:"category not found"
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

module.exports={ fetchAllCategory, fetchCategoryById, createNewCategory, updateCategory,deleteCategory };




























// const {getAllCategory,getCategoryById, createCategory,updateCategory,deleteCategory }=require('../models/category.model.js');

// const fetchAllCategory=(req,res)=>{
//     const data=getAllCategory();
//     res.status(200).json({
//         "success":true,
//         "message": "Category fetched successfully",
//         "data":data,
//     });
// }

// const fetchCategoryById=(req,res)=>{
//     const id=parseInt(req.params.id);
//     const results=getCategoryById(id);
//     if(results){
//         res.status(200).json({
//             "success":true,
//             "message":"category fetched successfully",
//             "data":results,
//         });
//     }
//     else{
//         res.status(404).json({
//             "success":false,
//             "message":"Category not found",
//             "data":results,
//         });
//     }
// }

// const createNewCategory=(req,res)=>{
//     const data=req.body;
//     if( !data.name || !data.description){
//         return res.status(400).json({
//             "success":false,
//             "message":"input is invalid",
//             "data":null,
//         });
//     }
//     const result=createCategory(data);
//     res.status(201).json({
//         "success":true,
//         "message":"Category created successfully",
//         "data":result,
//     });
// }

// const updateNewCategory=(req,res)=>{
//     const id=parseInt(req.params.id);
//     const newData=req.body;
//     if( !newData || Object.keys(newData).length === 0){
//         return res.status(400).json({
//             "success":false,
//             "message":"data is not provided",
//             "data":null,
//         });
//     }
//     const result=updateCategory(id,newData);
//     if(result == null){
//         res.status(404).json({
//             "success":false,
//             "message":"No category was found",
//             "data":result,
//         });
//     }
//     else{
//         res.status(200).json({
//         "success":true,
//         "message":"Category updated successfuly",
//         "data":result,
//         });
//     }
// }

// const deleteNewCategory=(req,res)=>{
//     const id=parseInt(req.params.id);
//     const result=deleteCategory(id);
//     if(result==null){
//         res.status(404).json({
//             "success":false,
//             "message":"no category found",
//             "data":result,
//         });
//     }
//     else{
//         res.status(204).send();
//     }
// }

// module.exports={fetchAllCategory, fetchCategoryById,createNewCategory, updateNewCategory, deleteNewCategory};
