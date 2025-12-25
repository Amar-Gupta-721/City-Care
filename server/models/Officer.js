// server/models/Officer.js
import mongoose from 'mongoose';

const OfficerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, default: null },
  phone: { type: String },
  sector: { type: String }, // <-- ADD THIS
  idImage: { type: String }, // <-- ADD THIS
  assignedComplaints: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }
  ],
  approved: { type: Boolean, default: false } // <-- default false
}, { timestamps: true });

export default mongoose.model('Officer', OfficerSchema);