import express from "express";
import { Comment } from "../models/Comment.mjs";
import { validationResult, check } from "express-validator";
import { user_permission } from "../middlewares/Permission.mjs";
import { Authorize } from "../middlewares/authorize.mjs";
import { sequelize } from "../middlewares/connection.mjs";

const data = new Comment();

export const comment_route = express.Router();

//!fetch all
comment_route.get("/", async (req, res) => {
  res.json(await data.index());
});

//!find one
comment_route.get("/:id", async (req, res) => {
  const id = req.params.id;
  const tag = await data.getById(id);
  if (!tag) {
    return res.status(404).json("Not found !!");
  }
  res.json(tag);
});

//!create
comment_route.post(
  "/",
  [
    check("comment").notEmpty().isString(),
    check("name").notEmpty(),
    check("email").notEmpty().isEmail(),
    check("post_id").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const comm = req.body;
    res.json(await data.create(comm));
  }
);
/* 
//!update
comment_route.put(
  "/",
  [
    check("comment").notEmpty().isString(),
    check("name").notEmpty(),
    check("email").notEmpty().isEmail(),
    check("post_id").notEmpty(),
  ],
  async (req, res) => {
    const id = req.body.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const post = req.body;
    tag.id = id;
    res.json(await data.update(id, post));
  }
);
 */
//!delete
comment_route.delete(
  "/",
  Authorize,
  user_permission(["admin"]),
  async (req, res) => {
    const id = req.body.id;
    const com = sequelize.query(`select * from comments where id = ${id}`);
    if (com == undefined) {
      res.status(400).json({ message: "this post can not be found !!" });
    }
    await data.destroy(id);
    res.json({ message: "deleted successfully!!" });
  }
);
