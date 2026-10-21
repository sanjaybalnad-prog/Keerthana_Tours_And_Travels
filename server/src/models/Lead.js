
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
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
    packageName: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be a whole number',
      },
    },
    price: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Price cannot be negative'],
    },
    leadStatus: {
      type: String,
      required: true,
      enum: ['unread', 'read'],
      default: 'unread',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select:false
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const LEAD_STATUSES = ['unread', 'read'];

leadSchema.index({ leadStatus: 1, createdAt: -1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
