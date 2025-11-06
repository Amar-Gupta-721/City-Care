// // backend/models/Complaint.js
// import mongoose from 'mongoose';

// const ComplaintSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
//   assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' },
//   status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
//   images: [{ url: String, public_id: String }],
//   location: {
//     type: { type: String, enum: ['Point'], default: 'Point' },
//     coordinates: { type: [Number], default: [0, 0] } // [lon, lat]
//   }
// }, { timestamps: true });

// ComplaintSchema.index({ location: '2dsphere' });

// export default mongoose.model('Complaint', ComplaintSchema);

// server/models/Complaint.js
// import mongoose from 'mongoose';

// const ComplaintSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
//   assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' },
//   status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
//   images: [{ url: String, public_id: String }],
//   location: {
//     type: { type: String, enum: ['Point'], default: 'Point' },
//     coordinates: { type: [Number], default: [0, 0] } // [lon, lat]
//   }
// }, { timestamps: true });

// ComplaintSchema.index({ location: '2dsphere' });

// export default mongoose.model('Complaint', ComplaintSchema);


// import mongoose from "mongoose";

// const complaintSchema = new mongoose.Schema({
//   User_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   Title: String,
//   Department: String,
//   Description: String,
//   Latitude: String,
//   Longitude: String,
//   Media: [
//     {
//       fileName: String,
//       mimeType: String,
//       size: Number,
//     },
//   ],
// }, { timestamps: true });

// export default mongoose.model("Complaint", complaintSchema);

import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  User_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  Title: String,
  Department: String,
  Description: String,
  Latitude: String,
  Longitude: String,
  Status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  ComplaintCode: { type: String, unique: true },
  Media: [
    {
      fileName: String,
      mimeType: String,
      size: Number,
    },
  ],
}, { timestamps: true }); // ✅ Adds createdAt & updatedAt automatically

export default mongoose.model("Complaint", complaintSchema);
