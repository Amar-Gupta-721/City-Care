// // backend/middleware/authMiddleware.js
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Not authorized, token missing' });
//     }
//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password');
//     if (!user) return res.status(401).json({ message: 'User not found' });
//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('auth error', err);
//     res.status(401).json({ message: 'Not authorized, token failed' });
//   }
// };

// export const authorizeRoles = (...roles) => (req, res, next) => {
//   if (!req.user) return res.status(401).json({ message: 'No user in request' });
//   if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
//   next();
// };

// server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -verificationToken');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No user in request' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
  next();
};
