import { Router } from "express";

const router = Router();



import {sendContactFormMessage} from "../controller/contactController.js";




// route to send contact message through gmail

router.route("/send").post(sendContactFormMessage);


export default router;