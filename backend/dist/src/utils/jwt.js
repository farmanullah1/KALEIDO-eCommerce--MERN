import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES,
    });
};
export const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES,
    });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
//# sourceMappingURL=jwt.js.map