// backend/controllers/officerController.js
import Officer from '../models/Officer.js';
import User from '../models/User.js';

export const requestOfficer = async (req, res) => {
  try {
    const { phone, departmentId } = req.body;
    const existing = await Officer.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Officer request already exists' });
    const officer = await Officer.create({
      user: req.user._id,
      phone,
      department: departmentId,
      approved: false
    });
    res.status(201).json({ message: 'Officer request created', officer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const listOfficerRequests = async (req, res) => {
  try {
    const reqs = await Officer.find().populate('user', 'name email').populate('department', 'name');
    res.json({ requests: reqs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const approveOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const officer = await Officer.findById(id);
    if (!officer) return res.status(404).json({ message: 'Officer not found' });
    officer.approved = true;
    await officer.save();
    // also change user role
    await User.findByIdAndUpdate(officer.user, { role: 'officer' });
    res.json({ message: 'Officer approved', officer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const removeOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const officer = await Officer.findById(id);
    if (!officer) return res.status(404).json({ message: 'Officer not found' });
    await officer.deleteOne();
    res.json({ message: 'Officer removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
