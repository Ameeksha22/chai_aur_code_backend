import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
const router=Router();
router.route("/register").post(
    upload.fields([//accept array..middleware inject..now u are able to send images
        {
            name:"Avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser);
export default router;



