
const errorhandlerMiddleware=(err,req,res,next)=>{
    const statusCode=err.status || 500;
    
    return res.status(statusCode).json({
        "success":false,
        "message":err.message || "Internal Server Error",
        "data":null, 
    });
}

module.exports=errorhandlerMiddleware;