
const mongoose=require('mongoose');

const categorySchema= new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    description:{
        type:String,
        required:false
    }
},{timestamps:true});


const category=mongoose.model('category',categorySchema);
module.exports=category;








// const category=[];

// const getAllCategory=()=>{
//     //code here 
//     return category;
// }

// const getCategoryById=(id)=>{
//     //code here 
//     return category.find((item)=> item.id===id);
// }

// const createCategory=(categoryData)=>{
//     //code here 
//     const newCategory={
//         id:Date.now(),
//         name:categoryData.name,
//         description:categoryData.description,
//         createdAt:Date.now(),
//     }

//     category.push(newCategory);
//     return newCategory;
// }

// const updateCategory=(id,updateData)=>{
//     //code here 
//     const Index=category.findIndex((item)=>item.id===id);
//     if(Index===-1){
//         return null;
//     }
//     return category[Index]= {...category[Index], ...updateData };
// }

// const deleteCategory=(id)=>{
//     //code here 
//     const Index=category.findIndex((item)=> item.id===id);
//     if(Index===-1) return null;

//     const deleted=category[Index];
//     category.splice(Index,1);
//     return deleted;

// }

// module.exports= {getAllCategory,getCategoryById, createCategory,updateCategory,deleteCategory };