import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'name is required'],
        minLength: [5, 'Name must be at least 5 charchter'],
        maxLength: [20,'maximum name length exceeded'],
        lowercase: true,
        trim: true,

    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, 
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        select: false ,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 5 charchter'],
    
    },
    avatar: {
        public_id: {
            type: 'String'
        },
        secure_url: {
            type:'String'
        }
    },
    role:{
        type: 'String',
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: String,
    forgtoPasswordExpiry : Date
    
},
{ 
    timestamps: true
}
);

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods ={
    generateJWToken: async function(){
        return await jwt.sign({
            id: this._id,
            name: this.fullName,
            email: this.email,
            subcription: this.subcription,
            role:this.role
        },
            process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY,
        }

    )
    },
    comparePassword: async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword, this.password)

    }
}

const User = model('learning-management-system', userSchema);

export default User;