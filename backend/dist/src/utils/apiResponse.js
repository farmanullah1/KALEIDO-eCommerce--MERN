export const successResponse = (data, message = 'Success') => ({
    success: true,
    message,
    data,
});
export const errorResponse = (message, error = null) => ({
    success: false,
    message,
    error,
});
//# sourceMappingURL=apiResponse.js.map