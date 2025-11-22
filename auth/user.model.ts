import { Schema, model, models } from 'mongoose';
import type { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  _id: any;
  role:string
}

export type UserModel = Model<IUser>;

const emailRegex = /^\S+@\S+\.\S+$/;

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      validate: {
        validator: (value: string) => emailRegex.test(value),
        message: 'Invalid email format',
      },
    },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

export const User: UserModel = models.User || model<IUser, UserModel>('User', userSchema);
