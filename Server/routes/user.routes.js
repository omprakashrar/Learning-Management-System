import { Router } from "express";  
import { frogotPassword, getProfile, login, logout, register, resetPassword, changepassword, updateUser } from "../controller/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";


const router = Router();

router.post('/register',upload.single("avatar"),register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/me', isLoggedIn, getProfile)
router.post('/reset', frogotPassword)
router.post('/reset/:resetToken', resetPassword)
router.post('/change-password',isLoggedIn, changepassword )
router.put('/update', isLoggedIn, upload.single("avatar"), updateUser)


export default router;