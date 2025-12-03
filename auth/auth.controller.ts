'use server'

import dbConnect from "@/lib/mongodb";
import { User } from "./user.model";
import jwt from "jsonwebtoken";

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerUser({ name, email, password }: { name: string, email: string, password: string }) {
  await dbConnect();

  if (!name || !email || !password) return { error: "Name, email, and password are required" };

  const normalizedEmail = email.trim().toLowerCase();
  if (!emailRegex.test(normalizedEmail)) return { error: "Invalid email format" };
  if (password.length < 6) return { error: "Password must be at least 6 characters long" };

  const existingUser = await User.findOne({ email: normalizedEmail }).exec();
  if (existingUser) return { error: "Email is already in use" };

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: password
  });

  return { user: JSON.parse(JSON.stringify(user)) };
}


export async function loginUser({ email, password }: { email: string, password: string }) {
  await dbConnect();

  if (!email || !password) return { error: "Email and password are required" };

  const user: any = await User.findOne({ email: email.trim().toLowerCase() }).exec();
  if (!user) return { error: "Invalid email or password" };



  const token = jwt.sign( 
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
  );


  const plainUser = JSON.parse(JSON.stringify(user));

  return {
    user: plainUser,
    token
  };
}
