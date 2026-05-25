
const jwt=require('jsonwebtoken');


const authMiddleware=async (req,res,next)=>{
    //code here
    try{
        const authHeader = req.headers['authorization'];
        let token = req.headers['x-auth-token'];
        
        // Support both Authorization Bearer and x-auth-token header
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); // Remove 'Bearer ' prefix
        }
        
        if(!token){
            return res.status(401).json({
            success: false,
            message: "Token missing"
            });
        }
        const decoded=await jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
}

module.exports=authMiddleware;