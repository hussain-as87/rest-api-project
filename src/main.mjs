import express from "express";
import { api_route } from "./routes/app.mjs";
import { _app } from "../config.mjs";
import session from "cookie-session";
import { login_route } from "./routes/User.mjs";
import { Authorize } from "./middlewares/authorize.mjs";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: _app.secret_key,
  })
);
app.use("/api/auth", login_route);
app.use("/api", [Authorize, api_route]);



app.listen(_app.port, () => {
  console.clear();
  console.log(`start at http://${_app.connection_host}:${_app.port} `);
});
