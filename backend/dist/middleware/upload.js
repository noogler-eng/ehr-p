/**
 * Image Upload Middleware
 * Configures multer for handling medical image and document uploads.
 * Supports lab reports, medical imaging, prescriptions, and other medical documents.
 */
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
/**
 * Configure storage for uploaded files
 * Files are saved with a timestamp prefix and original extension
 */
const storage = multer.diskStorage({
    /**
     * Sets the destination folder for uploaded files
     */
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    /**
     * Generates a unique filename for each uploaded file
     * Format: timestamp-randomstring-originalname
     */
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
    }
});
/**
 * File filter to validate uploaded files
 * Allows common medical document and image formats
 */
const fileFilter = (req, file, cb) => {
    // Allowed file types for medical documents
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'application/pdf',
        'application/dicom' // DICOM format for medical imaging
    ];
    // Allowed file extensions
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.pdf', '.dcm'];
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    if (allowedTypes.includes(mimeType) || allowedExtensions.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only medical images and PDF documents are allowed.'));
    }
};
/**
 * Multer upload configuration
 * - Maximum file size: 10MB
 * - Supports single and multiple file uploads
 */
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    }
});
/**
 * Helper function to delete uploaded files
 * Used for cleanup when errors occur during record creation
 *
 * @param filename - Name of the file to delete
 */
export function deleteUploadedFile(filename) {
    try {
        const filePath = path.join(uploadsDir, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filename}`);
        }
    }
    catch (error) {
        console.error(`Error deleting file ${filename}:`, error);
    }
}
/**
 * Helper function to get file URL for frontend access
 *
 * @param filename - Name of the uploaded file
 * @returns Full URL path to access the file
 */
export function getFileUrl(filename) {
    return `/uploads/${filename}`;
}
//# sourceMappingURL=upload.js.map