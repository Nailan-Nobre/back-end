const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'back-end',
    allowedFormats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage });

module.exports = upload;