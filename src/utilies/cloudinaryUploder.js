import multer from "multer"
import { fileValidation } from "./fileUpload.js"



function cloudFileUpload(customValidation = fileValidation.img) {

   const storage = multer.diskStorage({


   })

   const fileFilter = (req, file, cb) => {


      if (!customValidation.includes(file.mimetype)) {
         return cb(new Error("invalide file formte"), false)
      }

      else {
         return cb(null, true)
      }
   }


   const upload = multer({ storage, fileFilter })
   return upload
}


export default cloudFileUpload