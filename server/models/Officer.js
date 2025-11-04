// // backend/models/Officer.js
// import mongoose from 'mongoose';

// const OfficerSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
//   phone: { type: String },
//   approved: { type: Boolean, default: false }
// }, { timestamps: true });

// export default mongoose.model('Officer', OfficerSchema);

// server/models/Officer.js
import mongoose from 'mongoose';

const OfficerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  phone: { type: String },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Officer', OfficerSchema);
