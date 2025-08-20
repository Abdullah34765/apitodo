// app/api/todo/route.ts (POST handler)
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { title, completed } = body;

    // Check Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1]?.trim();

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 403 }
      );
    }

    const userId = decoded.userId; 
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token payload" },
        { status: 401 }
      );
    }

    // Validate inputs
    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty title" },
        { status: 400 }
      );
    }
    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Completed must be boolean" },
        { status: 400 }
      );
    }

    // Create todo associated with this user
    const newTodo = await prisma.todo.create({
      data: {
        title: title.trim(),
        completed,
        userId,
      },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error(" Error creating todo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
