// // backend/routes/authRoutes.js
// import express from 'express';
// import { googleSignIn, localRegister, localLogin } from '../controllers/authController.js';
// import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.post('/google', googleSignIn);
// router.post('/register', localRegister);
// router.post('/login', localLogin);

// // get current user
// router.get('/me', protect, (req, res) => res.json({ user: req.user }));

// // example admin route:
// router.get('/admin-only', protect, authorizeRoles('admin'), (req, res) => {
//   res.json({ message: 'admin ok' });
// });

// export default router;

// server/routes/authRoutes.js
import express from 'express';
import { googleSignIn, localRegister, localLogin, verifyEmail } from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/google', googleSignIn);
router.post('/register', localRegister);
router.post('/login', localLogin);
router.get('/verify', verifyEmail);

// convenience endpoints
router.get('/me', protect, (req, res) => res.json({ user: req.user }));

export default router;
