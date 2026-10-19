import { AppError } from "./error";
import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { NextRequest } from "next/server";

const getUser = async (req?: NextRequest) => {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;
  }

  if (!token) throw new AppError("Unauthorized: no token found", 401);

  let decodedToken = verifyToken(token);
  if (!decodedToken) throw new AppError("Invalid or expired token", 401);

  return decodedToken.userId;
};

export default getUser;
