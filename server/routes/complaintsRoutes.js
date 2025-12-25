// server/routes/complaintRoutes.js
import express from 'express';
import { createComplaint, deleteComplaint, getComplaints, getMyComplaints, updateComplaintStatus, getComplaintsByOfficerDepartment } from '../controllers/complaintController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.post('/', protect, upload.array('media', 6), createComplaint);
router.get('/', protect, getComplaints);          // require auth to view all
router.get('/my', protect, getMyComplaints);
router.put('/:id', protect, authorizeRoles('admin', 'officer'), updateComplaintStatus);


router.get(
  "/department/:officerId",
  protect,
  authorizeRoles("officer"),
  getComplaintsByOfficerDepartment
);

router.delete("/:id", protect, deleteComplaint);

export default router;
