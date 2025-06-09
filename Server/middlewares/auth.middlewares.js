import { verify } from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("🚀 Received Authorization header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader;

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Failed:", err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
}
