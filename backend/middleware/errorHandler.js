import { ValidationError } from 'sequelize';

// Custom error class for API errors
export class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // Handle Sequelize validation errors
    if (err instanceof ValidationError) {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message
        }));
        return res.status(400).json({
            status: 'fail',
            message: 'Validation error',
            errors
        });
    }

    // Handle operational errors
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    // Handle unknown errors
    console.error('ERROR 💥', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    });
};