// // backend/routes/departmentRoutes.js
// import express from 'express';
// import { createDepartment, getDepartments, updateDepartment, deleteDepartment } from '../controllers/departmentController.js';
// import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
// const router = express.Router();

// router.post('/', protect, authorizeRoles('admin'), createDepartment);
// router.get('/', getDepartments);
// router.put('/:id', protect, authorizeRoles('admin'), updateDepartment);
// router.delete('/:id', protect, authorizeRoles('admin'), deleteDepartment);

// export default router;

// server/routes/departmentRoutes.js
import express from 'express';
import { createDepartment, getDepartments, updateDepartment, deleteDepartment } from '../controllers/departmentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('admin'), createDepartment);
router.get('/', getDepartments);
router.put('/:id', protect, authorizeRoles('admin'), updateDepartment);
router.delete('/:id', protect, authorizeRoles('admin'), deleteDepartment);

export default router;
