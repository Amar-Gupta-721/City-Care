// // backend/models/User.js
// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   name: { type: String },
//   email: { type: String, required: true, unique: true },
//   password: { type: String }, // optional if user signed with Google
//   googleId: { type: String },
//   role: { type: String, enum: ['citizen', 'officer', 'admin'], default: 'citizen' },
//   avatar: { type: String }
// }, { timestamps: true });

// export default mongoose.model('User', UserSchema);

// server/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for Google users
  googleId: { type: String },
  role: { type: String, enum: ['citizen', 'officer', 'admin'], default: 'citizen' },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false }, // email verification
  verificationToken: { type: String } // optional: store token to validate
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
