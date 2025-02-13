const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "back-end",
    format: async (req, file) => "png", // ou "jpg", "jpeg"
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });

export default upload;