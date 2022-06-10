import jwt from "jsonwebtoken";
import { _app } from "../../config.mjs";

export function Authorize(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = !authHeader ? null : authHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "the token undefined !!" });
  }
  jwt.verify(token, _app.secret_key, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json();
    }
    console.log(user);
    req.user = user;
    next();
  });
}
