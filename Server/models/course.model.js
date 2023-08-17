import { model, Schema } from 'mongoose';


const courseSchema = new Schema ({
    title: { 
        type: String,
        required: [
            true, 'title is required'
        ],
        unique:[true,'course already exists'],
        trim: true

    },
    description: {
        type: String,
        maxlength: 501,
        minlength:3,
        default:'no description provided',
    },
    category:{
        type :String,
        
    },
    thumbnail: {
        // public_id: 'dummy',
        // secure_url: 'dummy'
        type: String
    },

    lectures: [
        {
        title: String,
        description: String,
        lecture: {
            public_id: {
                type: String
            },
            secure_url: {
                type: String
            }
        }
    }

    ],
    numbersOfLectures: {
        type: Number
    },
    createdBy: {
        type: String
    },
    
        // timestamps: true

})

const Course = model('Course', courseSchema);

export default Course;