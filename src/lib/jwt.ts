import jwt from "jsonwebtoken";
import { JWTpayload } from "@/types/user.type";

const JWT_SECRET = process.env.JWT;

export function generateToken(payload: JWTpayload) {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "2d" });
}

export function verifyToken(token: string): JWTpayload | null {
  try {
    let decoded = jwt.verify(token, JWT_SECRET!);
    return decoded as JWTpayload;
  } catch (error) {
    return null;
  }
}
