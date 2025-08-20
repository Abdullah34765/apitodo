import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Trim inputs
    const emailTrimmed = email.trim().toLowerCase();
    const usernameTrimmed = username.trim();

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email: emailTrimmed } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.users.create({
      data: { email: emailTrimmed, username: usernameTrimmed, password: hashedPassword },
    });

    // Generate JWT token with consistent payload
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Remove password from response
    const { password: _, ...safeUser } = newUser;

    // Return response with consistent key 'user'
    return NextResponse.json(
      { message: "User created successfully", user: safeUser, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
