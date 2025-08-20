import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function getUserIdFromToken(request: Request | NextRequest): number | null {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { userId: number };

    return Number(decoded.userId);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}
