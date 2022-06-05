import express from "express";
import { Post } from "../classes/Post.mjs";
import { validationResult, check } from "express-validator";
import { user_permission } from "../middlewares/Permission.mjs";
import { Resize } from "../middlewares/UploadFile.mjs";
import path from "path";
const __dirname = "D:\\node project\\course\\final-project-2\\src\\";
const posts = new Post();

export const post_route = express.Router();

//!fetch all post
post_route.get(
  "/",
  user_permission(["admin", "auther", "user"]),
  async (req, res) => {
    res.json(await posts.index());
  }
);

//!find one post
post_route.get("/:id", async (req, res) => {
  const bookId = req.params.id;
  const p = await posts.getById(bookId);
  if (!p) {
    return res.status(404).json("Not found");
  }
  res.json(p);
});

//!create new post
post_route.post(
  "/",
  [
    check("title").notEmpty().isString(),
    check("content").notEmpty().isString(),
    check("image")
      .matches(/.*\.(gif|jpe?g|bmp|png)$/gim)
      .notEmpty(),
    check("auther").notEmpty(),
  ],
  user_permission(["admin", "auther"]),
  async (req, res) => {
    const imagePath = path.join(__dirname, "/images");
    const fileUpload = new Resize(imagePath);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const post = req.body;
    post.id = Math.ceil(Math.random(200) * 1000000000);
    post.publish_date = new Date();
    const filename = await fileUpload.save(req.body.image);
    post.image = filename;

    res.json(await posts.create(post));
  }
);

//!update the post
post_route.put(
  "/",
  [
    check("id").notEmpty(),
    check("title").notEmpty().isString(),
    check("content").notEmpty().isString(),
    check("image")
      .matches(/.*\.(gif|jpe?g|bmp|png)$/gim)
      .notEmpty(),
    check("auther").notEmpty(),
  ],
  user_permission(["admin", "auther"]),
  async (req, res) => {
    const imagePath = path.join(__dirname, "/images");
    const fileUpload = new Resize(imagePath);
    const id = req.body.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const post = req.body;
    post.id = id;
    post.publish_date = new Date();
    const filename = await fileUpload.save(req.body.image);
    post.image = filename;
    res.json(await posts.update(id, post));
  }
);

//!delete the post
post_route.delete(
  "/",
  user_permission(["admin", "auther"]),
  async (req, res) => {
    const id = req.body.id;
    if (!id) {
      res.status(400).json({ message: "this post can not be found !!" });
    }
    res.json(await posts.destroy(id));
  }
);
