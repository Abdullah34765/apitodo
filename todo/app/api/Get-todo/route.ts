// app/api/todo/route.ts (GET handler)
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Helper: Extract userId from JWT
function getUserIdFromToken(request: Request): number | null {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("Authorization header missing or invalid");
      return null;
    }
   
    const token = authHeader.split(" ")[1]?.trim();
    if (!token) {
      console.warn("Token missing in Authorization header");
      return null;
    }

    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      console.error("JWT_SECRET not defined in environment variables");
      return null;
    }

    const decoded = jwt.verify(token, secret) as { userId: number };
    if (!decoded?.userId) {
      console.warn("JWT decoded but userId missing");
      return null;
    }

    return Number(decoded.userId);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const userId = getUserIdFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { id: "desc" }, // latest first
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}
