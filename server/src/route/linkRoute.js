import { Router } from "express";
import { 
    generateLinkText,
    viewLink 
} from "../controller/linkController.js";
import {upload} from "../middlewares/multerMiddleware.js"


const router = Router();

// const upload = multer({ dest: "uploads/" }); 

router.route("/generateLinkText").post(
    upload.single("file"),
    generateLinkText
    );


    // view links ka kra hai 

    router.route("/viewLink/:createdUrl").get(viewLink);


    export default router;