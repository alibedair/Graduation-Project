const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.memoryStorage();

// File type validation
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const filetypes = /jpeg|jpg|png|gif|mp4|webm|mov/;
  
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images and videos only!'));
  }
};

// File size limits
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB limit
};

// Init upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

module.exports = upload;