import User from "../models/user.models.js";
import AppError from "../utils/error.util.js";

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

    // TODO: File upload

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

export{
    register,
    login,
    logout,
    getProfile
}