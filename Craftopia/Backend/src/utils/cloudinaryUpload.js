const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadBuffer = (buffer,options) => {
    return new Promise((resolve,reject) => {
        const stream = cloudinary.uploader.upload_stream(options,(error,result) => {
            if(error) {
                reject(error);
            }
            resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
    });
}

module.exports = uploadBuffer;