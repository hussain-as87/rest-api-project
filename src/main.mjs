import express from "express";
import { api_route } from "./routes/app.mjs";
import { _app } from "../config.mjs";
import session from "cookie-session";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import ejs from "ejs";
import { Post } from "./models/Post.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();
app.use("/public", express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/public/images"));
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

app.get("/posts", async (req, res) => {
  res.render("index", {
    posts: await posts.index(req.query.count, req.query.page, req.query.query),
    title: "posts",
  });
});

fetch("/post")
  .then((req, res) => {
    res.render("index", {
      posts: posts.index(
        req.query.count,
        req.query.page,
        req.query.query,
        req.query.tag
      ),
      title: "posts",
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  res.render("single-post", {
    post: await posts.show(id),
    title: "posts-single",
  });
});
fetch("/posts/:id")
  .then((req, res) => {
    const id = req.params.id;
    res.render("single-post", {
      post: posts.show(id),
      title: "posts-single",
    });
  })
  .catch((err) => {
    console.log(err);
  });
app.use("/api", api_route);

app.listen(_app.port, () => {
  console.clear();
  console.log(`start at http://${_app.connection_host}:${_app.port} `);
});
