// app/api/todo/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    //  Check Authorization header
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
      console.error("JWT verification failed:", err);
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 403 }
      );
    }

    const userId = decoded.userId; // Must match payload key in login JWT
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token payload" },
        { status: 403 }
      );
    }

    // Parse todoId
    const todoId = parseInt(params.id);
    if (isNaN(todoId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    //  Delete only if todo belongs to this user
    const deletedTodo = await prisma.todo.deleteMany({
      where: { id: todoId, userId }, // ensures user can only delete their own todos
    });

    if (deletedTodo.count === 0) {
      return NextResponse.json(
        { error: "Todo not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("Delete failed:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
