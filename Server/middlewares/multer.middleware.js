import path from 'path';
import multer from 'multer';

// Set up the storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Set the filename to be used for the uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  },
});


const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith('')) {
    cb(null, true);
  } else {
  
    cb(new Error('Only images are allowed!'), false);
  }
};


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50, // Limit file size to 5 MB
  },
  fileFilter: fileFilter,
});

export default upload;
