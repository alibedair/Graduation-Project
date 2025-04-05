const multer = require('multer');
const path = require('path');


const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

  const filetypes = /jpeg|jpg|png|gif|mp4|webm|mov/;
  
  
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  
  const mimetype = filetypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images and videos only!'));
  }
};


const limits = {
  fileSize: 10 * 1024 * 1024, 
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

module.exports = upload;