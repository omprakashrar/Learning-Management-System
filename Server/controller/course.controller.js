import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises'
import multer from 'multer';


const getAllcourses = async function(req, res, next){
const courses = await Course.find({}).select('-lectures');

res.status(200).json({
    success: true,
    message: 'All courses',
   courses,
});

}

const getLecturesByCourseId = async function(req, res, next){
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        res.status(200).json({
            success :true,
            message:'Courses Lectures fetched successfully',
            lectures: course.lectures
        })

            if(!course){
                return next(
                    new AppError('Invalid course id', 400)
                )
            }
    }
    
    catch (e) 
    {
        return next(
            new AppError(e.message, 500)
        )
        
    }
}


const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, createdBy} = req.body;

        if (!title || !description || !category || !createdBy) {
            return next (
                new AppError('All feilds are required', 400)
            )
        }
    
        const course = await Course.create({
            title,
            description,
            category,
            createdBy
        });
    
        if (!course) {
            return next(new AppError("Could not add the course", 500))
            
        }
    
        if(req.file){
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms'
            });
    
            if (!result) {
                course.thumbnail.public_id =  result.public_id;
                course.thumbnail.secure_url = result.secure_url;
                
            }
            FileSystem.rm(`uploads/${req.file.filename}`)
        }
        await course.save();
    
        res.status(200).json({
            status:'success',
            message: 'Course created successfully',
            course,
        });
    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )
        
    }
   

}

const updateCourse = async (req, res, next)=> {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $ste: req.body
            },
            {
                runValidators: true
            }

        );

        if (!course) {
            return next(
                new AppError('Course with given id does not exist', 500)
            )
        }

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course
        })
    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )
        
    }
}

const removeCourse = async(req, res, next) => {
        try {
            const { id } = req.params;
            const course = await Course.findById(id);

            if (!course) {
                return next(
                    new AppError('Course with given id does not exist', 500)
                )
            }

            await Course.findByIdAndDelete(id);

            res.status(200).json({
                successs :true,
                message:'Course deleted Successfully'
            })
        } catch (e) {
            return next(
                new AppError(e.message, 500)
            )
            
        }

}


export{
    getAllcourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse
}