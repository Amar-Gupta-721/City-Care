// backend/models/Complaint.js
import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  images: [{ url: String, public_id: String }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lon, lat]
  }
}, { timestamps: true });

ComplaintSchema.index({ location: '2dsphere' });

export default mongoose.model('Complaint', ComplaintSchema);
