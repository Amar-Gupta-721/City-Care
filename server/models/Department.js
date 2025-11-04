// // backend/models/Department.js
// import mongoose from 'mongoose';

// const DepartmentSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   description: { type: String }
// }, { timestamps: true });

// export default mongoose.model('Department', DepartmentSchema);

// server/models/Department.js
import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Department', DepartmentSchema);
