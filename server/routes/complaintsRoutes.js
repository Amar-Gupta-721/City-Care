// backend/routes/complaintsRoutes.js
import express from 'express';
import { createComplaint, getComplaints } from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.post('/', protect, upload.array('images', 6), createComplaint);
router.get('/', getComplaints);

export default router;
