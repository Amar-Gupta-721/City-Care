// // backend/routes/complaintsRoutes.js
// import express from 'express';
// import { createComplaint, getComplaints } from '../controllers/complaintController.js';
// import { protect } from '../middleware/authMiddleware.js';
// import upload from '../utils/multer.js';

// const router = express.Router();

// router.post('/', protect, upload.array('images', 6), createComplaint);
// router.get('/', getComplaints);

// export default router;

// server/routes/complaintRoutes.js
import express from 'express';
import { createComplaint, getComplaints, getMyComplaints, updateComplaintStatus } from '../controllers/complaintController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../utils/multer.js';

// import multer from "multer";
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
const router = express.Router();

// router.post(
//   "/",
//   authMiddleware,                     // your JWT middleware
//   upload.array("media"),              // MUST BE "media"
//   createComplaint
// );


router.post('/', protect, upload.array('media', 6), createComplaint);
router.get('/', protect, getComplaints);          // require auth to view all
router.get('/my', protect, getMyComplaints);
router.put('/:id', protect, authorizeRoles('admin', 'officer'), updateComplaintStatus);

export default router;
