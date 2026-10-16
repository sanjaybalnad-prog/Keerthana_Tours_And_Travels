import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import Admin from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { AUTH_COOKIE_NAME } from '../utils/cookies.js';

// Verifies the JWT in the HTTP-only cookie and loads the admin from the database.
// The admin identity always comes from the signed token, never from the client's request data.
export const requireAdmin = async (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
  } catch {
    throw new ApiError(401, 'Invalid or expired session');
  }

  const admin = await Admin.findById(payload.sub);
  if (!admin) {
    throw new ApiError(401, 'Invalid or expired session');
  }

  req.admin = admin;
  next();
};
