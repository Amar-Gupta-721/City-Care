import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Officer from "../models/Officer.js";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

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
      // phone,
      // department: departmentId,
      approved: false
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
    // console.log("BODY:", req.body);
    // console.log("FILE:", req.file);

    const { name, phone, departmentId, sector } = req.body;

    const officer = await Officer.findOne({ user: req.user._id });

    if (!officer) {
      return res.status(404).json({ message: "Officer account not found!" });
    }

    // Update officer data
    officer.phone = phone;
    officer.department = departmentId;
    officer.sector = sector;
    officer.approved = true;
    if (req.file) {
      officer.idImage = req.file.filename;
    }

    // Update user name also
    await User.findByIdAndUpdate(req.user._id, { name });

    await officer.save();

    res.status(200).json({ 
      message: "Onboarding details saved successfully!", 
      officer 
      // officerId: officer._id   // ✅ FIX
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const officerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user
    const user = await User.findOne({ email, role: "officer" });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Check officer profile
    const officer = await Officer.findOne({ user: user._id });
    if (!officer) {
      return res.status(403).json({ message: "Officer profile not found" });
    }

    // 4. Token
    const token = generateToken(user._id);

    // 5. Approved check
    // ❗ Not approved → allow onboarding
    if (!officer.approved) {
      return res.status(200).json(
        { message: "Officer not approved yet",
          token,
          officer:{
            approved: false
          }
         }
      );
    }

    // ✅ Approved officer
    res.status(200).json({
      message: "Login successful",
      token,
      officer: {
        approved: true
      },
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Officer profile
// export const getOfficerProfile = async (req, res) => {
//   const officer = await Officer.findOne({ user: req.user._id })
//     .populate("department", "name")
//     .populate("user", "name email role");

//   res.json({ officer });
// };
export const getOfficerProfile = async (req, res) => {
  try {
    const officer = await Officer.findOne({ user: req.user._id })
      .populate("user", "name email role");

    if (!officer) {
      return res.status(404).json({ error: "Officer not found" });
    }

    res.status(200).json({
      id: officer._id,
      name: officer.user.name,
      email: officer.user.email,
      role: officer.user.role,
      department: officer.department,
      approved: officer.approved,
    });
  } catch (error) {
    console.error("Get officer profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
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
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    complaint.Status = "Resolved"; // ✅ match schema enum
    await complaint.save();

    // res.json({ success: true, message: "Complaint solved" });
     res.json({
      success: true,
      message: "Complaint marked as resolved",
      complaint,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
