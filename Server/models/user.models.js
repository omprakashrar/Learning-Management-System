import { Schema, model } from "mongoose";


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

const User = model('User', userSchema);

export default User;