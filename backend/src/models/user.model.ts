import mongoose from 'mongoose';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';

export interface userDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Pick<userDocument, '_id' | 'email' | 'verified' | 'createdAt' | 'updatedAt'>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const hashedPassword = await hashPassword(this.password);
  this.password = hashedPassword;
  return next();
});

userSchema.methods.comparePassword = async function (val: string) {
  return comparePassword(val, this.password);
};

userSchema.methods.omitPassword = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const UserModel = mongoose.model<userDocument>('User', userSchema);
export default UserModel;
