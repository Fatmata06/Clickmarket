const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(new Error("Extension non supportée. Utilisez JPG, JPEG ou PNG."), false);
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

const uploadProduit = multer({ storage, fileFilter, limits });
const uploadProfile = multer({ storage, fileFilter, limits });

module.exports = { uploadProduit, uploadProfile };
