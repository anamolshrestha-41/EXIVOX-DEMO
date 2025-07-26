import multer from 'multer';

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    document: ['application/pdf', 'text/plain']
  };
  
  const allAllowedTypes = Object.values(allowedTypes).flat();
  
  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Configure upload with disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10
  }
});

// Enhanced upload middleware with error handling
export const uploadMiddleware = (req, res, next) => {
  upload.array('media', 10)(req, res, (err) => {
    if (err) {
      console.log('Upload error:', err);
      return res.status(400).json({
        success: false,
        message: 'Upload failed'
      });
    }
    
    console.log('Files uploaded:', req.files?.length || 0);
    next();
  });
};

export default upload;