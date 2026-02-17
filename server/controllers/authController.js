// server/controllers/authController.js
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const localRegister = async (req, res) => {
  console.log("user data is : ", req.body);
  try {
    const { name, email, password, role } = req.body;
    // console.log("Inside try block user data is : ", req.body);
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed, role });
    // console.log("user is : ", user);
    const token = generateToken(user);
    // console.log("token is : ",token);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// Local login
export const localLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // conssole.log("user on login is : ", user);
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const valid = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!valid) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Google sign-in (ID token from client)
export const googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken required' });

    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      // console.log("new user is created .");
      user = await User.create({ name, email, googleId, avatar: picture, isVerified: true });
    } else if (!user.googleId) {
      // console.log("user is updated by google login");
      user.googleId = googleId;
      user.isVerified = true;
      await user.save();
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Google sign-in error', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

// Verify email from link
export const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;
    if (!token || !email) return res.status(400).json({ message: 'Invalid verification link' });

    const user = await User.findOne({ email, verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid token or email' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // redirect to frontend success page if wanted
    return res.redirect(`${process.env.FRONTEND_URL}/verify-success`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user; // coming from protect middleware

    res.status(200).json({
      User_id: user._id,
      Name: user.name,
      Email: user.email,
      Role: user.role,
      verified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  console.log("forgot password user is : ", user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `
    You requested a password reset.
    Click here to reset your password:
    ${resetUrl}
    If you didn't request this, ignore this email.
  `;

  await sendEmail(user.email, "Password Reset - CityCare", message);

  res.json({ message: "Password reset link sent to email" });
};


export const resetPassword = async (req, res) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: "Password updated successfully" });
};
