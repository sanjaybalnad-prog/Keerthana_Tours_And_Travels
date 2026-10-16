import mongoose from 'mongoose';

// A lead exists only after a payment has been verified, so every lead is a successful booking.
// Package name and price are snapshots taken at purchase time.
const leadSchema = new mongoose.Schema(
  {
    customer: {
      email: {
        type: String,
        required: [true, 'Customer email is required'],
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Customer phone is required'],
        trim: true,
      },
    },
    package: {
      name: {
        type: String,
        required: [true, 'Package name is required'],
        trim: true,
      },
      price: {
        type: Number,
        required: [true, 'Package price is required'],
        min: [0, 'Package price cannot be negative'],
      },
    },
    leadStatus: {
      type: String,
      required: true,
      enum: ['unread', 'read'],
      default: 'unread',
    },
  },
  { timestamps: true, versionKey: false }
);

export const LEAD_STATUSES = ['unread', 'read'];

// Serves "filter by status, newest first" and "all leads, newest first".
leadSchema.index({ leadStatus: 1, createdAt: -1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
