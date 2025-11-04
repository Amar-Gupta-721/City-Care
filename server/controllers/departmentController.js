// // backend/controllers/departmentController.js
// import Department from '../models/Department.js';

// export const createDepartment = async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     if (!name) return res.status(400).json({ message: 'Department name is required' });
//     const exists = await Department.findOne({ name });
//     if (exists) return res.status(400).json({ message: 'Department already exists' });
//     const department = await Department.create({ name, description });
//     res.status(201).json({ message: 'Department created', department });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// export const getDepartments = async (req, res) => {
//   try {
//     const departments = await Department.find().sort({ createdAt: -1 });
//     res.json({ departments });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// export const updateDepartment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description } = req.body;
//     const department = await Department.findById(id);
//     if (!department) return res.status(404).json({ message: 'Department not found' });
//     department.name = name || department.name;
//     department.description = description || department.description;
//     await department.save();
//     res.json({ message: 'Department updated', department });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// export const deleteDepartment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const department = await Department.findById(id);
//     if (!department) return res.status(404).json({ message: 'Department not found' });
//     await department.deleteOne();
//     res.json({ message: 'Department deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// server/controllers/departmentController.js
import Department from '../models/Department.js';

export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Department name is required' });

    const exists = await Department.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Department already exists' });

    const dept = await Department.create({ name, description });
    res.status(201).json({ department: dept });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const depts = await Department.find().sort({ name: 1 });
    res.json({ departments: depts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const dept = await Department.findById(id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });

    dept.name = req.body.name || dept.name;
    dept.description = req.body.description || dept.description;
    await dept.save();
    res.json({ department: dept });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const dept = await Department.findById(id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    await dept.deleteOne();
    res.json({ message: 'Department deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
