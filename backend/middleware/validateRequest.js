import { validationResult } from 'express-validator';
import { APIError } from './errorHandler.js';

export const validate = (validations) => {
    return async (req, res, next) => {
        // Execute all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }));
            
            return next(new APIError('Validation failed', 400, errorMessages));
        }
        next();
    };
};