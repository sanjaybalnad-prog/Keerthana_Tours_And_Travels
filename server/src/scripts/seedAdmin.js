import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';

const SALT_ROUNDS = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const seedAdmin = async () => {
  const uri = process.env.MONGODB_URI?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!uri || !email || !password) {
    throw new Error('MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file');
  }
  if (!EMAIL_PATTERN.test(email)) {
    throw new Error('ADMIN_EMAIL is not a valid email address');
  }
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters long');
  }

  await connectDB(uri);

  // Only one admin is allowed, so running the script again changes nothing.
  const existing = await Admin.findOne().select('email');
  if (existing) {
    console.log(`An admin account already exists (${existing.email}). Nothing to do.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await Admin.create({ email, password: hashedPassword });
  console.log(`Admin account created for ${email}`);
};

seedAdmin()
  .catch((error) => {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
