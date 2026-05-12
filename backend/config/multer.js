import multer from "multer"
// Frontend sends file (FormData)
// Multer receives it → stores in RAM
// You access → req.file.buffer
// Send buffer to Cloudinary
// Cloudinary returns image URL
// You send URL back to frontend
export const upload = multer({
    // store in RAM
    storage : multer.memoryStorage(),
    // to avoid RAM overflow
    limits : {
        fileSize : 2*1024*1024
    },
    // for security validation
    fileFilter : (req,file,cb)=>{
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
            cb(null,true)
        }
        else{
            const err = new Error("Only JPG and PNG alllowed")
            err.status = 400
            cb(err,false)
        }
    }
})