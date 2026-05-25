
const multer=require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, hasCloudinaryConfig } = require('./cloudinary');

const localStorage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + ' - ' + file.originalname);
    }
});

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'shopverse/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
});

const upload=multer({
    storage: hasCloudinaryConfig ? cloudinaryStorage : localStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    }
});

module.exports=upload;
