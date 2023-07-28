
import express from 'express';

const errorMiddleware = (err, req , res , next) => {
    res.status().json({
        message: err.message || 'Something went wrong',
        success: false,
        stack: err.stack
    })
}
export default errorMiddleware;


