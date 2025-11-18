import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Officer from "../models/Officer.js";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// export const registerOfficer = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ message: "Email already exists" });

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       email,
//       password: hashed,
//       role: "officer",
//       name: "Officer"
//     });

//     const token = generateToken(user._id);

//     res.status(201).json({
//       message: "Officer registered successfully",
//       token,
//       user: { id: user._id, email: user.email, role: user.role }
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// REGISTER OFFICER (direct approval)
export const registerOfficer = async (req, res) => {
  try {
    const { email, password, name, phone, departmentId } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      // name,
      email,
      password: hashed,
      role: "officer"
    });

    await Officer.create({
      user: user._id,
      phone,
      department: departmentId,
      approved: true
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Officer registered successfully",
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const officerOnboarding = async (req, res) => {
  try {
    const { phone, departmentId } = req.body;

    const existing = await Officer.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: "Request already submitted!" });

    const newRequest = await Officer.create({
      user: req.user._id,
      phone,
      department: departmentId,
      approved: false
    });

    res.status(201).json({ message: "Officer request submitted", newRequest });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// export const getOfficerProfile = async (req, res) => {
//   const officer = await Officer.findOne({ user: req.user._id })
//     .populate("department", "name")
//     .populate("user", "name email role");

//   res.json({ officer });
// };

// Officer profile
export const getOfficerProfile = async (req, res) => {
  const officer = await Officer.findOne({ user: req.user._id })
    .populate("department", "name")
    .populate("user", "name email role");

  res.json({ officer });
};

export const listOfficerRequests = async (req, res) => {
  const requests = await Officer.find()
    .populate("user", "email")
    .populate("department", "name");
  res.json({ requests });
};

export const approveOfficer = async (req, res) => {
  const officer = await Officer.findById(req.params.id);
  if (!officer) return res.status(404).json({ message: "Request not found" });

  officer.approved = true;
  await officer.save();

  await User.findByIdAndUpdate(officer.user, { role: "officer" });

  res.json({ message: "Approved", officer });
};

export const denyOfficer = async (req, res) => {
  const officer = await Officer.findById(req.params.id);
  if (!officer) return res.status(404).json({ message: "Not found" });

  await officer.deleteOne();
  res.json({ message: "Request deleted" });
};


export const solveComplaint = async (req, res) => {
  try {
    let complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    complaint.status = "Solved";
    await complaint.save();

    res.json({ success: true, message: "Complaint solved" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
