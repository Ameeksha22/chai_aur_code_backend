import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)//jo bhi user n upload kiya tha wahi wala original name btado...if more than one file with same name its getting overwrite.... small instant of tym k liy hota h to upload then dlt
    }//filename miljyga.... local path wlai kahani yha s solve hojati h
  })
  
export const upload = multer({ 
    storage, //create stprage name method
})



