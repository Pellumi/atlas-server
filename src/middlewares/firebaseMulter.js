import multer from "multer";
import ErrorHandler from "../utils/ErrorHandler.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limit: { fileSize: 10 * 1024 * 1024 }, // File size will be limited to 10mb for now
});

const uploadToFirebase = async (req, res, next) => {
  if (!req.file) {
    return next(ErrorHandler.BadRequest("No file uploaded"));
  }

  const { originalname, buffer, mimetype } = req.file;
  const fileExtension = originalname.split(".").pop();
  const fileName = `${Date.now()}-${originalname}`;
  const fileRef = ref(storage, `materials/${fileName}`);

  await uploadBytes(fileRef, buffer);
  const fileUrl = await getDownloadURL(fileRef);

  req.uploadedFile = {
    fileName: originalname,
    fileExtension,
    fileUrl,
    fileType: mimetype,
  };

  next();
};

export { upload, uploadToFirebase };
