// server/controllers/complaintController.js
import Complaint from '../models/Complaint.js';
import Officer from '../models/Officer.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import path from "path";
import crypto from "crypto";


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
        ImageURL: file.filename,        // ✅ THIS IS THE KEY FIX
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

// export const getComplaintsByOfficerDepartment = async (req, res) => {
//   try {
//     const officer = await Officer.findById(req.params.officerId).populate("department");
//     if (!officer) return res.status(404).json({ error: "Officer not found" });

//     const complaints = await Complaint.find({ department: officer.department._id });
//     res.json(complaints);
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

export const getComplaintsByOfficerDepartment = async (req, res) => {
  try {
    const { officerId } = req.params;

    // 1. Find officer
    const officer = await Officer.findById(officerId);
    if (!officer) {
      return res.status(404).json({ error: "Officer not found" });
    }

    if (!officer.department) {
      return res.status(400).json({ error: "Officer department not assigned" });
    }

    // 2. Find complaints of same department
    // const complaints = await Complaint.find({
    //   Department: officer.department,
    // }).sort({ createdAt: -1 });

     // ✅ CASE-INSENSITIVE department match
    const complaints = await Complaint.find({
      Department: { $regex: `^${officer.department}$`, $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching department complaints:", error);
    res.status(500).json({ error: "Server error" });
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

export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 🗑️ Delete media files from server
    if (complaint.Media && complaint.Media.length > 0) {
      complaint.Media.forEach((media) => {
        if (media.ImageURL) {
          const filePath = path.join(
            process.cwd(),
            "tmp",
            "uploads",
            media.ImageURL
          );

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Delete complaint error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
