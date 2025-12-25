// server/models/Complaint.js
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
      ImageURL: {
          type: String,
          required: true, // stores saved filename
        },
      // fileName: String,
      OriginalName: String,
      mimeType: String,
      size: Number,
    },
  ],
}, { timestamps: true }); // ✅ Adds createdAt & updatedAt automatically

export default mongoose.model("Complaint", complaintSchema);
