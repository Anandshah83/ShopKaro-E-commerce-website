
const user=require('../models/user.model.js');

const fetchAllUsers=async ( req , res )=>{
    //code here 
    try{
        const data=await user.find().select('-password');
        res.status(200).json({ 
            success:true,
            message:"Fetched All users Successfully",
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

const fetchUsersById=async ( req , res )=>{
    //code here 
    try{
        const data=await user.findById(req.params.id).select('-password');
        if(!data){
            return res.status(404).json({
                success:false,
                message:"user not found",
                data:null
            });
        }

        res.status(200).json({
            success:true,
            message:"user fetch by Id successfully",
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


const createNewUser= async ( req , res )=>{
    //code here 
    try{
        const data=req.body;
        if( !data.name || !data.email || !data.password ){
            return res.status(400).json({
                success:false,
                message:"data values are not found"
            });
        }

        const newUser=await user.create(data);
        res.status(201).json({
            success:true,
            message:"New user created successfully",
            data:newUser
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

const updateUser=async ( req , res )=>{
    //code here 
    try{
        const data=await user.findByIdAndUpdate( req.params.id , req.body , { new:true } );
        if(!data){
            return res.status(404).json({
                success:false,
                message:"user not found"
            });
        }

        res.status(200).json({
            success:true,
            message:"user updated successfully",
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

const deleteUser= async ( req , res )=>{
    //code here 
    try{
        const data=await user.findByIdAndDelete(req.params.id);
        if(!data){
            return res.status(404).json({
                success:false,
                message:"user not found"
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

module.exports= {fetchAllUsers, fetchUsersById, createNewUser, updateUser, deleteUser };
















// const {getAllUsers,getUserById,createUser,updateUser,deleteUser}=require('../models/user.model.js');

// const fetchAllUsers=(req,res)=>{
//     const data=getAllUsers();
//     res.status(200).json({
//         "success":true,
//         "message": "Users fetched successfully",
//         "data":data,
//     });
// }

// const fetchUserById=(req,res)=>{
//     const id=parseInt(req.params.id);
//     const data=getUserById(id);
//     if(data){
//         res.status(200).json({
//             "success":true,
//             "message":"users fetched successfully",
//             "data":data,
//         });
//     }
//     else{
//         res.status(404).json({
//             "success":false,
//             "message":"user not found",
//             "data":data,
//         });
//     }
// }

// const createNewUser=(req,res)=>{
//     const data=req.body;
//     if( !data.email || !data.password || !data.name){
//         return res.status(400).json({
//             "success":false,
//             "message":"invalid input",
//             "data":null,
//         });
//     }
//     const result=createUser(data);
//     res.status(201).json({
//         "success":true,
//         "message":"user created successfully",
//         "data":result,
//     });
// }

// const updateNewUser=(req,res)=>{
//     const id=parseInt(req.params.id);
//     const newData=req.body;
//     if( !newData || Object.keys(newData).length===0){
//         return res.status(400).json({
//             "success":false,
//             "message":"data is not provided",
//             "data":null,
//         });
//     }
//     const result=updateUser(id,newData);
//     if(result == null){
//         res.status(404).json({
//             "success":false,
//             "message":"No user was found",
//             "data":result,
//         });
//     }
//     else{
//         res.status(200).json({
//         "success":true,
//         "message":"User updated successfuly",
//         "data":result,
//         });
//     }
// }

// const deleteNewUser=(req,res)=>{
//     const id=parseInt(req.params.id);
//     const result=deleteUser(id);
//     if(result==null){
//         res.status(404).json({
//             "success":false,
//             "message":"no user found",
//             "data":result,
//         });
//     }
//     else{
//         res.status(204).send();
//     }
// }

// module.exports={fetchAllUsers,fetchUserById,createNewUser,updateNewUser,deleteNewUser };