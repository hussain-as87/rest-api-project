import express from "express";
import { Post } from "../models/Post.mjs";
import { validationResult, check } from "express-validator";
import { check_user_id, user_permission } from "../middlewares/Permission.mjs";
import { Resize } from "../middlewares/UploadFile.mjs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { _app } from "../../config.mjs";
const __dirname = "D:\\node project\\course\\final-project-2\\src\\";
const data = new Post();

export const post_route = express.Router();

//!fetch all
post_route.get(
  "/",
  user_permission(["admin", "author", "user"]),
  async (req, res) => {
    let fields,
      tag,
      query = req.query.query,
      limit = req.query.count,
      page = req.query.page,
      _tag = req.query.tag,
      _fields = req.query.fields,
      excerpt = req.query.excerpt;

    if (_tag) {
      tag = _tag.toString().split(",");
    }

    if (_fields) {
      fields = _fields.toString().split(",");
    }
    const posts = await data.index(limit, page, query, tag, fields, excerpt);
    let all_post = posts.map((p) => {
      return {
        post: p,
        "read more ..": `http://${_app.connection_host}:${_app.port}/posts/${p._id}`,
      };
    });
    res.json(all_post);
  }
);

//!find one
post_route.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.json(await data.show(id));
});

//!find one
post_route.get("/:id/comments", async (req, res) => {
  const id = req.params.id;
  const p = await data.showById(id);
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
    check("tag").isInt(),
  ],
  user_permission(["author"]),
  async (req, res) => {
    try {
      const imagePath = path.join(__dirname, "/public/images");
      const fileUpload = new Resize(imagePath);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
        return;
      }
      const post = req.body;
      post._id = uuidv4();
      post.author = check_user_id;
      post.publish_date = new Date();
      const filename = await fileUpload.save(req.body.image);
      post.image = filename;
      res.json(await data.create(post));
    } catch (error) {
      res.json({ message: error });
    }
  }
);

//!update
post_route.put(
  "/",
  [
    check("_id").notEmpty(),
    check("title").notEmpty().isString(),
    check("content").notEmpty().isString(),
    check("image")
      .matches(/.*\.(gif|jpe?g|bmp|png)$/gim)
      .notEmpty(),
    check("tag").isInt(),
  ],
  user_permission(["author"]),
  async (req, res) => {
    try {
      const imagePath = path.join(__dirname, "/public/images");
      const fileUpload = new Resize(imagePath);
      const id = req.body._id;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
        return;
      }
      const post = req.body;
      post._id = id;
      post.author = check_user_id;
      post.publish_date = new Date();
      const filename = await fileUpload.save(req.body.image);
      post.image = filename;
      res.json(await data.update(id, post));
    } catch (error) {
      res.json({ message: error });
    }
  }
);

//!delete
post_route.delete("/", user_permission(["admin"]), async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).json({ message: "this post can not be found !!" });
  }
  await data.destroy(id);
  res.json({ message: "deleted successfully!!" });
});
