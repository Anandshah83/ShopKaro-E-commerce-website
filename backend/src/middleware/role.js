

const authRole=async ( req , res , next )=>{
    
        if(req.user.role !== 'admin' ){
           return res.status(403).json({
            success:false,
            message:"Only admin Allowed"
           });
        }
        next();
    
}

module.exports= authRole;