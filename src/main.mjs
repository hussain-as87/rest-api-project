import express from "express";
import { api_route } from "./routes/app.mjs";
import { _app } from "../config.mjs";
import session from "cookie-session";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import ejs from "ejs";
import { Post } from "./classes/Post.mjs";
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use("/public",express.static(__dirname+'/public'));
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/images', express.static(__dirname + '/public/images'))

app.use(express.json());
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: _app.secret_key,
  })
);

app.use(expressLayouts);
app.set("layout", path.resolve("src/views/layouts/app"));
app.set("view engine", "ejs");
app.set("views", path.resolve("src/views"));
const posts = new Post();

app.get("/posts", async(req, res) => {
  res.render("index", {
    posts: await posts.index(req.query.count, req.query.page, req.query.query),
  });
});

app.use("/api",  api_route);

app.listen(_app.port, () => {
  console.clear();
  console.log(`start at http://${_app.connection_host}:${_app.port} `);
});
