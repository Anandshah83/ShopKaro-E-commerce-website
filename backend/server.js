require ('dotenv').config();

const app=require('./src/app.js');
const PORT=process.env.PORT || 3000;
const connectDB=require('./src/config/db.js');

connectDB();

//listening server 
app.listen(PORT,()=>{
    console.log(`Server running on port:${PORT}`);
});