import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    let token =
      req.header("x-auth-token") ||
      req.header("authorization") ||
      req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    if (token.toLowerCase().startsWith("bearer ")) {
      token = token.slice(7).trim();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // IMPORTANT
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
}