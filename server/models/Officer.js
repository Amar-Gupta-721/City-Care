// server/models/Officer.js
import mongoose from 'mongoose';

const OfficerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  phone: { type: String },
  assignedComplaints: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }
  ],
  approved: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Officer', OfficerSchema);
