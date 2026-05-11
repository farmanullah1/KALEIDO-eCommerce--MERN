import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = verifyAccessToken(token);
            req.user = await User.findById(decoded.id).select('-passwordHash');
            if (!req.user) {
                return res.status(401).json(errorResponse('Not authorized, user not found'));
            }
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401).json(errorResponse('Not authorized, token failed'));
        }
    }
    if (!token) {
        res.status(401).json(errorResponse('Not authorized, no token'));
    }
};
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json(errorResponse('Not authorized as an admin'));
    }
};
//# sourceMappingURL=auth.middleware.js.map