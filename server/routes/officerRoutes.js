// // backend/routes/officerRoutes.js
// import express from 'express';
// import { requestOfficer, listOfficerRequests, approveOfficer, removeOfficer } from '../controllers/officerController.js';
// import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.post('/request', protect, requestOfficer);
// router.get('/requests', protect, authorizeRoles('admin'), listOfficerRequests);
// router.put('/approve/:id', protect, authorizeRoles('admin'), approveOfficer);
// router.delete('/:id', protect, authorizeRoles('admin'), removeOfficer);

// export default router;

// server/routes/officerRoutes.js
import express from 'express';
import { requestOfficer, listOfficerRequests, approveOfficer, denyOfficer } from '../controllers/officerController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', protect, requestOfficer);
router.get('/requests', protect, authorizeRoles('admin'), listOfficerRequests);
router.put('/approve/:id', protect, authorizeRoles('admin'), approveOfficer);
router.delete('/deny/:id', protect, authorizeRoles('admin'), denyOfficer);

export default router;
