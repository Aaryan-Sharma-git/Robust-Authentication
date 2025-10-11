import mongoose from 'mongoose';
import verificationTypes from '../constants/verificationType.js';

interface verificationCode extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: verificationTypes;
  createdAt: Date;
  expiresAt: Date;
}

const verificationSchema = new mongoose.Schema<verificationCode>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  type: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

const VerificationModel = mongoose.model('Verification', verificationSchema, 'verification_code');

export default VerificationModel;
