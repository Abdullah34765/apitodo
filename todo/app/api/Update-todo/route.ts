import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth"; // JWT helper

export async function PATCH(request: Request) {
  try {
    // Get userId from JWT token
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get data from request body
    const body = await request.json();
    const { id, title, completed } = body;

    if (typeof id !== "number") {
      return NextResponse.json(
        { error: "Todo id is required" },
        { status: 400 }
      );
    }

    // Check if todo exists and belongs to this user
    const existingTodo = await prisma.todo.findUnique({ where: { id } });

    if (!existingTodo || existingTodo.userId !== userId) {
      return NextResponse.json(
        { error: "Not found or not owned by user" },
        { status: 404 }
      );
    }

    // Update the todo
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(typeof completed === "boolean" ? { completed } : {}),
      },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
