import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Always a bcrypt hash. Excluded from queries unless explicitly requested with .select('+password').
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
