/**
 * Image Upload Middleware
 * Configures multer for handling medical image and document uploads.
 * Supports lab reports, medical imaging, prescriptions, and other medical documents.
 */
import multer from 'multer';
/**
 * Multer upload configuration
 * - Maximum file size: 10MB
 * - Supports single and multiple file uploads
 */
export declare const upload: multer.Multer;
/**
 * Helper function to delete uploaded files
 * Used for cleanup when errors occur during record creation
 *
 * @param filename - Name of the file to delete
 */
export declare function deleteUploadedFile(filename: string): void;
/**
 * Helper function to get file URL for frontend access
 *
 * @param filename - Name of the uploaded file
 * @returns Full URL path to access the file
 */
export declare function getFileUrl(filename: string): string;
//# sourceMappingURL=upload.d.ts.map