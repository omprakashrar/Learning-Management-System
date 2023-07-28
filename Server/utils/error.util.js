class AppError extends Error {
    construter(message, statusCode){
        
        (message);

        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.construter);
    }
}

export default AppError;