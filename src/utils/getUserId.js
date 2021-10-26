import jwt from "jsonwebtoken";
export const getUserId = (request, requireAuth = true) => {
  const header = request.request.headers.authorization;

  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    return decoded.userId;
  }
  if (requireAuth) {
    throw new Error("Authentication required");
  }
};
