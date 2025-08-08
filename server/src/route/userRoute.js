import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser
} from "../controller/userController.js";

import { verifyJWT } from "../middlewares/authMiddleware.js";


const router = Router();


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)


export default router;