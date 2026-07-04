import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if(!authHeaders){
        return res.status(400).json({
            message: "authorization headers is missing"
        })
    }

    const token = authHeaders.split(" ")[1];

    if(!token){
        return res.status(400).json({
            message: "token is missing"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}