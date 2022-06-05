import express from "express";
import { Post } from "../classes/Post.mjs";
import { validationResult, check } from "express-validator";
import { user_permission } from "../Permission.mjs";
import { v4 as uuidv4 } from "uuid";

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
    check("image").notEmpty(),
    check("auther").notEmpty(),
  ],
  user_permission(["admin", "auther"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const post = req.body;
    post.id = Math.ceil(Math.random(200) * 1000000000);
    post.publish_date = new Date();
    post.auther = req.body.auther;

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
    check("image").notEmpty(),
    check("auther").notEmpty(),
  ],
  user_permission(["admin", "auther"]),
  async (req, res) => {
    const id = req.body.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const post = req.body;
    post.id = id;
    post.publish_date = new Date();
    res.json(await posts.update(id,post));
  }
);

//!delete the post
post_route.delete(
  "/",
  user_permission(["admin", "auther"]),
  async (req, res) => {
    const id = req.body.id;
    if (!id) {
      res.status(400).json({message:"this post can not be found !!"})
    }
    res.json(await posts.destroy(id));
  }
);
