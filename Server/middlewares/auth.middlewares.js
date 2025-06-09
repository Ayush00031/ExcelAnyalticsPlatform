import { verify } from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.headers.aurhorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json("A token is required for authentication");
  }
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid Token" });
  }
}
