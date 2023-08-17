import { Router } from 'express';
import { getAllcourses, getLecturesByCourseId, createCourse, updateCourse, removeCourse } from '../controller/course.controller.js';
import { isLoggedIn, authorizedRoles } from '../middlewares/auth.middleware.js';
import multer from 'multer';
 

const router = Router();

const upload = multer();

router.route('/')
.get(getAllcourses)
.post(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    upload.single('thumbnail'),
    createCourse
    );

    
router.get('/:id', isLoggedIn ,getLecturesByCourseId)
.put(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    updateCourse
    )
.delete(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    removeCourse
    );

export default router;