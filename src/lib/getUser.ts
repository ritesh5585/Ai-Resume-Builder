import { AppError} from "./error";
import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

const getUser = async () => {
  const cookieStore = await cookies();

  let token = cookieStore.get("token")?.value;
  if (!token) throw new AppError("Unauthorized: no token found ", 401);

  let decodedToken = verifyToken(token);
  if (!decodedToken) throw new AppError("Invalid Token", 401);

  return decodedToken.userId;
};

export default getUser;
