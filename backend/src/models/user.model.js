const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default: "user"
    }
},{timestamps:true});


const user=mongoose.model('user',userSchema);
module.exports=user;










// const users=[];

// const getAllUsers=()=>{
//     //code part
//     return users;
// }

// const getUserById=(id)=>{
//     //code part
//     return users.find((item)=> item.id===id);
// }

// const createUser=(usersData)=>{
//     //code part
//     const newUser={
//         id:Date.now(),
//         name:usersData.name,
//         email:usersData.email,
//         password:usersData.password,
//         role:usersData.role || "user",
//         createdAt:Date.now(),
//     }

//     users.push(newUser);
//     return newUser;
// }

// const updateUser=(id,updateData)=>{
//     //code part
//     const index=users.findIndex((item)=> item.id===id);
//     if(index==-1) return null;

//     return users[index]={...users[index],...updateData};
// }

// const deleteUser=(id)=>{
//     //code part
//     const index=users.findIndex((item)=> item.id===id);
//     if(index==-1) return null;

//     const deleted=users[index];
//     users.splice(index,1);
//     return deleted;
// }

// module.exports={getAllUsers,getUserById,createUser,updateUser,deleteUser};

