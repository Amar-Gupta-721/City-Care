// server/controllers/adminController.js
// minimal admin helpers: get stats, accept/deny officer requests delegated to officerController
import Complaint from '../models/Complaint.js';
import Officer from '../models/Officer.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const open = await Complaint.countDocuments({ status: 'open' });
    const inProgress = await Complaint.countDocuments({ status: 'in-progress' });
    const closed = await Complaint.countDocuments({ status: 'closed' });

    const officersPending = await Officer.countDocuments({ approved: false });

    res.json({ totalComplaints, open, inProgress, closed, officersPending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
