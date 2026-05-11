import { errorResponse } from '../utils/apiResponse.js';
import { env } from '../config/env.js';
export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const error = env.NODE_ENV === 'development' ? err : null;
    res.status(statusCode).json(errorResponse(message, error));
};
//# sourceMappingURL=error.middleware.js.map