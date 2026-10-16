import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import Admin from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { clearAuthCookie, setAuthCookie } from '../utils/cookies.js';

const SALT_ROUNDS = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Compared against when the email is unknown, so response time doesn't reveal whether the account exists.
const DUMMY_HASH = await bcrypt.hash('not-a-real-password', SALT_ROUNDS);

const toAdminResponse = (admin) => ({ id: admin._id, email: admin.email });

export const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  // Type checks also prevent NoSQL operator injection such as { "email": { "$ne": null } }.
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new ApiError(400, 'Email and password are required');
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    throw new ApiError(400, 'Email and password are required');
  }
  if (!EMAIL_PATTERN.test(normalizedEmail) || normalizedEmail.length > 254) {
    throw new ApiError(400, 'Please provide a valid email address');
  }
  if (password.length > 128) {
    throw new ApiError(400, 'Password is too long');
  }

  const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');
  const passwordMatches = await bcrypt.compare(password, admin ? admin.password : DUMMY_HASH);

  if (!admin || !passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = jwt.sign({ sub: admin._id.toString() }, env.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: env.jwtExpiresInHours * 60 * 60, // seconds
  });
  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: toAdminResponse(admin),
  });
};

export const logout = async (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: toAdminResponse(req.admin) });
};
