import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const safeName = name.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
      cb(null, `${safeName}-${Date.now()}${ext}`);
    }
  })
  
export const upload = multer({ 
    storage, 
})






// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       const uploadPath = path.join("public/uploads");
//       fs.mkdirSync(uploadPath, { recursive: true });
//       cb(null, uploadPath);
//     },
//     filename: function (req, file, cb) {
//       cb(null, uuidv4() + path.extname(file.originalname));
//     },
//   });
//   const upload = multer({ storage });