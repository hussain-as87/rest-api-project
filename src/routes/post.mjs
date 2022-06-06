import express from "express";
import { Post } from "../classes/Post.mjs";
import { validationResult, check } from "express-validator";
import { check_user_id, user_permission } from "../middlewares/Permission.mjs";
import { Resize } from "../middlewares/UploadFile.mjs";
import path from "path";
const __dirname = "D:\\node project\\course\\final-project-2\\src\\";
const data = new Post();

export const post_route = express.Router();

//!fetch all
post_route.get(
  "/",
  user_permission(["admin", "author", "user"]),
  async (req, res) => {
    let query = req.query.query;
    let count = req.query.count;
    let page = req.query.page;
    res.json(await data.index(count, page, query));
  }
);

//!find one
post_route.get("/:id/comments", async (req, res) => {
  const id = req.params.id;
  const p = await data.show(id);
  res.json(p);
});

//!create
post_route.post(
  "/",
  [
    check("title").notEmpty().isString(),
    check("content").notEmpty().isString(),
    check("image")
      .matches(/.*\.(gif|jpe?g|bmp|png)$/gim)
      .notEmpty(),
    check("author").notEmpty(),
  ],
  user_permission(["author"]),
  async (req, res) => {
    const imagePath = path.join(__dirname, "/public/images");
    const fileUpload = new Resize(imagePath);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const post = req.body;
    post.id = Math.ceil(Math.random(200) * 1000000000);
    post.author = check_user_id;
    post.publish_date = new Date();
    const filename = await fileUpload.save(req.body.image);
    post.image = filename;
    await data.create(post);
    res.json({ message: "successfuly created !!" });
  }
);

//!update
post_route.put(
  "/",
  [
    check("id").notEmpty(),
    check("title").notEmpty().isString(),
    check("content").notEmpty().isString(),
    check("image")
      .matches(/.*\.(gif|jpe?g|bmp|png)$/gim)
      .notEmpty(),
    check("author").notEmpty(),
  ],
  user_permission(["author"]),
  async (req, res) => {
    const imagePath = path.join(__dirname, "/public/images");
    const fileUpload = new Resize(imagePath);
    const id = req.body.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const post = req.body;
    post.id = id;
    post.author = check_user_id;
    post.publish_date = new Date();
    const filename = await fileUpload.save(req.body.image);
    post.image = filename;
    await data.update(id, post);
    res.json({ message: "successfully updated !!" });
  }
);

//!delete
post_route.delete(
  "/",
  user_permission(["admin"]),
  async (req, res) => {
    const id = req.body.id;
    if (!id) {
      res.status(400).json({ message: "this post can not be found !!" });
    }
    await data.destroy(id);
    res.json({ message: "successfully deleted !!" });
  }
);
