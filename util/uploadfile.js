const multer = require('multer');
const path = require('path');
const { S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand}= require('@aws-sdk/client-s3')
require('dotenv').config()
const fs= require('fs').promises
// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Adjust to your desired upload directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize Multer with file filter (optional)
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDFs, DOCs, and DOCXs are allowed!'));
        }
    }
}); // Adjust field name to match frontend



const s3clint= new S3Client({
   region:process.env.BUCKET_REGION,
    credentials:{
        accessKeyId:process.env.ACCESS_KEY ,
        secretAccessKey:process.env.SECRET_ACCESS_KEY
    }
})
 async function putObjectUrl(fileName,contentType,body){
   console.log("file",fileName,contentType,body)
  const command= new PutObjectCommand({
     Bucket:process.env.S3_BUCKET_NAME,
     Key:`uploads/${fileName}`,
     Body:body,
     ContentType:contentType,
    
  })
 try{
     s3clint.send(command)
 }
 catch(err)
 {
    return err
 }
 }

// const cloudinaryUploadMiddleware = async (req, res, next) => {
//     if (!req.file) {
//       return next(); // No file to process
//     }
  
//     try {
//       const filePath = req.file.path;
//       const folderName = 'documents/resumes'; // Specify your folder path
  
//       const result = await cloudinary.uploader.upload(filePath, {
//         resource_type: 'auto',
//         folder: folderName, // Specify the folder path
//       });
  
//       await fs.unlink(filePath); // Clean up local file
  
//       req.file.url = result.secure_url;
//       next(); // Proceed to the next middleware or route handler
//     } catch (error) {
//       console.error('Error uploading to Cloudinary:', error.message);
//       res.status(500).send('Error uploading to Cloudinary.');
//     }
//   };
  

module.exports = {upload,putObjectUrl}
