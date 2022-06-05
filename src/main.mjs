import express from "express";
import { api_route } from "./routes/app.mjs";
import { _app } from "../config.mjs";
import jwt from "jsonwebtoken";
import session from "cookie-session";
import { login_route } from "./routes/User.mjs";
const app = express();
app.use(express.json());
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: _app.secret_key,
  })
);
app.use("/api/auth", login_route);
app.use("/api", [Authorize, api_route]);

function Authorize(req, res, next) {
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
    /*  if (user.type != "admin") {
        res.json({message : "not allow this to you !!"});
        return;
    } */
    console.log(user);
    req.user = user;
    next();
  });
}

app.listen(_app.port, () => {
  console.clear();
  console.log(`start at http://${_app.connection_host}:${_app.port} `);
});
