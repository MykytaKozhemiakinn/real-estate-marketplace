import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();

    } catch (error) {
        return res.status(401).json({error})
    }
}