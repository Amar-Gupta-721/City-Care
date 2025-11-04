// // backend/controllers/authController.js
// import { OAuth2Client } from 'google-auth-library';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import User from '../models/User.js';

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const generateToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// export const googleSignIn = async (req, res) => {
//   const { idToken } = req.body;
//   if (!idToken) return res.status(400).json({ message: 'idToken required' });

//   try {
//     const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
//     const payload = ticket.getPayload();
//     const { sub: googleId, email, name, picture } = payload;
//     let user = await User.findOne({ email });
//     if (!user) {
//       user = await User.create({ name, email, googleId, avatar: picture });
//     } else if (!user.googleId) {
//       user.googleId = googleId;
//       await user.save();
//     }
//     const token = generateToken(user);
//     res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
//   } catch (err) {
//     console.error('Google sign-in error', err);
//     res.status(401).json({ message: 'Invalid Google token' });
//   }
// };

// export const localRegister = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//     if (!email || !password) return res.status(400).json({ message: 'Email & password required' });
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: 'User already exists' });
//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(password, salt);
//     const user = await User.create({ name, email, password: hashed, role });
//     const token = generateToken(user);
//     res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
//   }
//   catch (err) {
//     console.error("REGISTER ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// export const localLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });
//     const valid = user.password ? await bcrypt.compare(password, user.password) : false;
//     if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
//     const token = generateToken(user);
//     res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };


// server/controllers/authController.js
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import { sendEmail } from '../utils/mailer.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// Local registration
// export const localRegister = async (req, res) => {
//   console.log("BODY RECEIVED AT /register:", req.body);
//   try {
//     const { name, email, password, role } = req.body;
//     if (!email || !password) return res.status(400).json({ message: 'Email & password required' });

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: 'User already exists' });

//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(password, salt);

//     const verificationToken = uuidv4();

//     const user = await User.create({
//       name,
//       email,
//       password: hashed,
//       role: role || 'citizen',
//       verificationToken,
//       isVerified: false
//     });

//     // send verification email
//     const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
//     const html = `<p>Hello ${name || email},</p>
//       <p>Click to verify your email: <a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>`;

//     try {
//       await sendEmail({ to: email, subject: 'Verify your CityCare email', html });
//     } catch (mailerErr) {
//       console.error('Mailer error:', mailerErr);
//     }

//     const token = generateToken(user);
//     res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

export const localRegister = async (req, res) => {
  console.log("user data is : ", req.body);
  try {
    const { name, email, password, role } = req.body;
    console.log("Inside try block user data is : ", req.body);
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed, role });
    console.log("user is : ", user);
    const token = generateToken(user);
    console.log("token is : ",token);

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
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

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
      user = await User.create({ name, email, googleId, avatar: picture, isVerified: true });
    } else if (!user.googleId) {
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
