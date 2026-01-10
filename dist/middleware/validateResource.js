import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
const validateResource = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (e) {
        if (e.errors) {
            // Format Zod errors
            const errorMessage = e.errors.map((err) => err.message).join(', ');
            next(new AppError(errorMessage, StatusCodes.BAD_REQUEST));
        }
        else {
            next(e);
        }
    }
};
export default validateResource;
//# sourceMappingURL=validateResource.js.map