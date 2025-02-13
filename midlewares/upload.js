import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

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