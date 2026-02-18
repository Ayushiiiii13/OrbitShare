const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log("AUTH MIDDLEWARE - HEADER RECEIVED:", authHeader);

    if (!authHeader) {
        console.log("AUTH MIDDLEWARE - NO HEADER FOUND");
        return res.status(401).json({ message: 'Access denied: No token provided' });
    }

    const token = authHeader.split(' ')[1] || authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("AUTH MIDDLEWARE - TOKEN DECODED:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("AUTH MIDDLEWARE - JWT ERROR:", error.message);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
