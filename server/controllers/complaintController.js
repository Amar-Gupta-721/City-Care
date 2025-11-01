// backend/controllers/complaintController.js
import Complaint from '../models/Complaint.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

export const createComplaint = async (req, res) => {
  try {
    const { title, description, departmentId, longitude, latitude } = req.body;
    const reporter = req.user._id;

    const complaint = new Complaint({
      title,
      description,
      reporter,
      department: departmentId || undefined
    });

    if (longitude && latitude) {
      complaint.location = { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] };
    }

    const uploaded = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'citycare/complaints' });
        uploaded.push({ url: result.secure_url, public_id: result.public_id });
        fs.unlinkSync(file.path);
      }
      complaint.images = uploaded;
    }

    await complaint.save();
    const populated = await complaint.populate('reporter', 'name email').populate('department', 'name');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('reporter', 'name email').populate('department', 'name').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
