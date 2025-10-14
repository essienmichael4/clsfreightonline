import { FileFilterCallback } from 'multer';

export const ImageFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  // Allowed extensions
  const allowedExtensions = /\.(jpg|jpeg|png|pdf|doc|docx)$/i;

  if (!allowedExtensions.test(file.originalname)) {
    req.fileValidationError = 'Only .jpg, .jpeg, .png, .pdf, .doc, .docx files are allowed';
    return callback(null, false);
  }

  callback(null, true);
};

export const VideoFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  // ✅ Common video file extensions
  const allowedExtensions = /\.(mp4|mov|avi|mkv|wmv|flv|webm)$/i;

  if (!allowedExtensions.test(file.originalname)) {
    req.fileValidationError = 'Only video files (.mp4, .mov, .avi, .mkv, .wmv, .flv, .webm) are allowed';
    return callback(null, false);
  }

  callback(null, true);
};


