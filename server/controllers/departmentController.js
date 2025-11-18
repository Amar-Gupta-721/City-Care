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
