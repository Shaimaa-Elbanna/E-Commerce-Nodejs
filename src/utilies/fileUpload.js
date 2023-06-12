import multer from "multer";
import { nanoid } from "nanoid";
import path from 'path'
import {fileURLToPath} from "url"
import fs from "fs"

const __direName= path.dirname(fileURLToPath(import.meta.url))

 export const fileValidation={
    img:['image/png','image/jpeg','image/gif'],
    pdf:[ 'application/pdf']

}

 function fileUploade({customValidation = fileValidation.img, customPath="general"}={}) {




    const fullPath=path.join(__direName,`../uploads${customPath}`)

    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,{recursive:true})
    }
    const storage = multer.diskStorage({

        destination: (req, file, cb) => {

            cb(null, fullPath)
        },

        filename: (req, file, cb) => {
            const prefix= nanoid() + "__" + file.originalname

            file.dest=`uploads${customPath}/${prefix}`
            cb(null,prefix)
        }

    })

    const fileFilter=(req,file,cb)=>{
if ( customValidation.includes(file.mimetype)){
  return  cb(null,true)
}
else{
    return cb (new Error('invalid file formate'),false)
}

    }



    const upload = multer({ dest: "uploads", fileFilter,storage })
    return upload

}

export default fileUploade