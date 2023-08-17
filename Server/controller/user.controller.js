import User from "../models/user.models.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises'; 
import crypto from 'crypto';

const cookieOption = {


    maxAge:7*24*60*60*1000, // 7days
    httpOnly: true,
    secure: true

}

const register = async(req, res, next) =>{


    const {fullName, email, password }= req.body;

    if(!fullName || !email || !password){
        return next( new AppError('All fields are required', 400));
   
   
    };

    const userExists = await User.findOne({email});

    if (userExists) {

        return next( new AppError('Email already exists', 400));
   
   
    }

    const user = await User.create({


        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https....'
       
        }
    
    
    });

    if (!user) {

        return next(new AppError('User registration failed, please try again', 400))
        
   
   
    }

    console.log('File Details',JSON.stringify(req.file));
        if (req.file) {

           
            try {

                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder:'lms',
                    width: 250,
                    height: 250,
                    crop: "fill",
                    gravity: 'faces'
                    
                }
                
                );


                if (result) {

                    
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url= result.secure_url;

                    //  remove file from server
                    fs.rm(`uploads/${req.file.filename}`)
                    
                }
                
            } catch (e) {
                return next(
                    new AppError(error || 'File not uploaded, please try again',500)
                )
                
            }
            
        }
    await user.save();

    user.password = undefined;

    const token = await user.generateJWToken();
    res.cookie('token', token, cookieOption);


    res.status(200).json({
        success: true,
        message: 'User registered successfully',
        user,
    })

};

const login =  async ( req, res, next) =>{
        try {
            const {email, password} = req.body;
            if (!email || !password){
                return next(new AppError('All fields are required'))
            }
            const user = await  User.findOne({
                email
            }).select('password');
    
            if(!user || !user.comparePassword(password)){
                return next(new AppError('email or password does not match'))
            }
    
            const token = await user.generateJWToken();
            user.password = undefined;
    
            res.cookie('token', token, cookieOption);
            res.status(200).json({
                success: true,
                message: 'User loggedin successfully'
            })
        } catch (e) {
            return next (new AppError(e.message, 500));
        }
    };

const logout = (req, res) =>{
    res.cookie('token', null, {
        maxAge:0,
        httpOnly:true,
        secure: true
    });
    res.status(200).json({
        success : true,
        message:'successfully logged out!'
    })

};

const getProfile = async(req, res) =>{
    try {
        const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
        success: true,
        message: 'User details',
        user
    })
    } catch (e) {
        return next (new AppError('failed to fetch profile user details ',500))
        
    }

};

    const frogotPassword = async(req, res, next) => {
            const {email} = req.body;

            if(!email){
                return  next(new AppError("Email is required",400 ))
            }
            const user = await User.findOne({email});
            if (!user) {
                return next(new AppError("Email not registered", 400));
            }

            const resetToken = await user.generatePasswordResetToken();

            await user.save();

            const resetPasswordURL = async () => {
                `${process.env.FRONTENT_URL}/reset-password/${resetToken}`;


                const subject = 'Reset password';
                const message = `you cen reset your password by clicking <a href=${resetPasswordURL}`;

                try{
                    await SendEmail(email, subject, message);
                    res.status(200).json({
                        success: true,
                        message: `Reset password token has been sent to ${email} successfully`

                    })
                }
                catch(e){

                    user.forgtoPasswordExpiry = undefined;
                    user.forgotPasswordToken = undefined;


                    await user.save();

                    return next(new AppError(e.message, 500));
                }
            }
    }
    const resetPassword = async(req, res) => {
        const { resetToken } = req.params;
        const { password } = req.body;

        const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(String(resetToken0))
        .digest('hex');


        const user = await User.findOne({
            forgotPasswordToken,
            forgtoPasswordExpiry: {$gt: Date.now()}
        })
        if (!user) {
            return next(new AppError('Token is invalid or expired, please try again', 400)
            
            )
            
        }

        user.password = password;

       

        user.forgotPasswordToken =undefined;
        user.forgtoPasswordExpiry=undefined;
        
        user.save();

        res.status(200).json({
            success: true,
            message:'Your Password has been changed successfully'
        })
    }

    const changepassword = async (req, res) =>
    {
         const { oldPassword, newPassword } = req.body;
         const { id } = req.user;

         if(!oldPassword || !newPassword){
            return next(
                new AppError("Please provide all the fields",400)
                );
         }

         const user =  await User.findById(id).select('+password');

         if(!user){
            return next(
                new AppError('User not found',400)
                );
         }

         const isPasswordValid = await user.comparePassword(oldPassword);

         if(!isPasswordValid){
            return next(
                new AppError('Incorrect old password.',401));
         }

         user.password = newPassword;


         await user.save();

         user.password = undefined;
         
         res.status(200).json({
            success: 'true',
            message: 'Password changed'
         }

         );

    }

    const updateUser = async(req, res) => {
        const {fullName } = req.body;
        const { id } = req.params.id;

        const user = await User.findById(id);
        if(!user){
            return next(
                new AppError('User does not exist', 400)
            )
        }

        if (req.fullName) {
            user.fullName= fullName;
            
        }

        if (req.file) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder:'lms',
                    width: 250,
                    height: 250,
                    crop: "fill",
                    gravity: 'faces'
                    
                });
                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url= result.secure_url;

                    //  remove file from server
                    fs.rm(`uploads/${req.file.filename}`)
                    
                }
                
            } catch (e) {
                return next(
                    new AppError(error || 'File not uploaded, please try again',500)
                )
                
            }
            
            
        }

        await user.save();
        res.status(200).json({
            success: true,
            messaeg: 'User details updated succesfully'
        }
        );
    
    
    }

export
{


    register,
    login,
    logout,
    getProfile,
    frogotPassword,
    resetPassword,
    changepassword,
    updateUser

}