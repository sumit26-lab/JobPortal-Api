const multer = require('multer');
const path = require('path');
const { S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand}= require('@aws-sdk/client-s3')
require('dotenv').config()
const fs= require('fs').promises
const s3clint= new S3Client({
    region:process.env.BUCKET_REGION,
     credentials:{
         accessKeyId:process.env.ACCESS_KEY ,
         secretAccessKey:process.env.SECRET_ACCESS_KEY
     }
 })
// Configure Multer storage
const storage= multer.memoryStorage()
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Adjust to your desired upload directory
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

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



//upload s3 with custome file name


 async function putObjectUrl(customefilename,contentType,body){
   console.log("file",customefilename,contentType,body)
  const command= new PutObjectCommand({
     Bucket:process.env.S3_BUCKET_NAME,
     Key:`uploads/${customefilename}`,
     Body:body,
     ContentType:contentType,
    
  })
 try{
     s3clint.send(command)
 }
 catch(err)
 {
    throw  new Error(err)
 }
 }

 ///Delete an object from S3
async function deleteObjectFromS3(key) {
    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    });

    try {
        await s3clint.send(command);
        console.log(`Successfully deleted ${key} from S3.`);
    } catch (err) {
        console.error(`Error deleting ${key}:`, err);
        throw new Error(err);
    }
}


module.exports = {upload,putObjectUrl,deleteObjectFromS3}
