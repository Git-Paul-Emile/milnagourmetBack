import { v2 as cloudinary } from 'cloudinary';
import './env.js';
export declare const CLOUDINARY_ROOT_FOLDER = "milnagourmet";
export declare function sanitizeFileBaseName(originalName: string): string;
export declare function cloudinaryUrl(relativePublicId: string): string;
export declare function uploadBufferToCloudinary(buffer: Buffer, folder: string, publicId: string): Promise<{
    secure_url: string;
    public_id: string;
}>;
export default cloudinary;
//# sourceMappingURL=cloudinary.d.ts.map