// // backend/controllers/complaintController.js
// import Complaint from '../models/Complaint.js';
// import cloudinary from '../utils/cloudinary.js';
// import fs from 'fs';

// export const createComplaint = async (req, res) => {
//   try {
//     const { title, description, departmentId, longitude, latitude } = req.body;
//     const reporter = req.user._id;

//     const complaint = new Complaint({
//       title,
//       description,
//       reporter,
//       department: departmentId || undefined
//     });

//     if (longitude && latitude) {
//       complaint.location = { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] };
//     }

//     const uploaded = [];
//     if (req.files && req.files.length) {
//       for (const file of req.files) {
//         const result = await cloudinary.uploader.upload(file.path, { folder: 'citycare/complaints' });
//         uploaded.push({ url: result.secure_url, public_id: result.public_id });
//         fs.unlinkSync(file.path);
//       }
//       complaint.images = uploaded;
//     }

//     await complaint.save();
//     const populated = await complaint.populate('reporter', 'name email').populate('department', 'name');
//     res.status(201).json(populated);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getComplaints = async (req, res) => {
//   try {
//     const complaints = await Complaint.find().populate('reporter', 'name email').populate('department', 'name').sort({ createdAt: -1 });
//     res.json(complaints);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// server/controllers/complaintController.js
import Complaint from '../models/Complaint.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import crypto from "crypto";

// export const createComplaint = async (req, res) => {
//   try {
//     const { title, description, departmentId, longitude, latitude } = req.body;
//     const reporter = req.user._id;

//     const complaint = new Complaint({
//       title,
//       description,
//       reporter,
//       department: departmentId || undefined
//     });

//     if (longitude && latitude) {
//       complaint.location = { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] };
//     }

//     const uploaded = [];
//     if (req.files && req.files.length) {
//       for (const file of req.files) {
//         const result = await cloudinary.uploader.upload(file.path, { folder: 'citycare/complaints' });
//         uploaded.push({ url: result.secure_url, public_id: result.public_id });
//         // remove temp file
//         try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
//       }
//       complaint.images = uploaded;
//     }

//     await complaint.save();
//     const populated = await complaint.populate('reporter', 'name email').populate('department', 'name');
//     res.status(201).json(populated);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const createComplaint = async (req, res) => {
//   try {
//     const { Title, Department, Description, Latitude, Longitude } = req.body;
//     const mediaFiles = req.files || [];

//     const newComplaint = new Complaint({
//       User_id: req.user.id,           // from JWT
//       Title,
//       Department,
//       Description,
//       Latitude,
//       Longitude,
//       Media: mediaFiles.map(file => ({
//         fileName: file.originalname,
//         mimeType: file.mimetype,
//         size: file.size,
//       })),
//     });

//     await newComplaint.save();

//     console.log("BODY:", req.body);
//     console.log("FILES:", req.files);


//     return res.status(201).json({ message: "Complaint submitted successfully!" });
//   } catch (err) {
//     console.error("🛑 Error saving complaint:", err);
//     return res.status(500).json({ error: "Server error while saving complaint" });
//   }
// };



export const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      User_id: req.user._id,
      Title: req.body.Title,
      Department: req.body.Department,
      Description: req.body.Description,
      Latitude: req.body.Latitude,
      Longitude: req.body.Longitude,
      ComplaintCode: "CMP-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
      Media: req.files?.map(file => ({
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      })),
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('reporter', 'name email')
      .populate('department', 'name')
      .sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ User_id: req.user._id }).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedOfficerId } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status || complaint.status;
    if (assignedOfficerId) complaint.assignedOfficer = assignedOfficerId;

    await complaint.save();
    res.json({ complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
