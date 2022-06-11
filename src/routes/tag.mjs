import express from "express";
import { Tag } from "../models/Tag.mjs";
import { validationResult, check } from "express-validator";
import { user_permission } from "../middlewares/Permission.mjs";

const data = new Tag();

export const tag_route = express.Router();

//!fetch all
tag_route.get("/", user_permission(["admin"]), async (req, res) => {
  res.json(await data.index());
});

//!find one
tag_route.get("/:id", async (req, res) => {
  const id = req.params.id;
  const tag = await data.show(id);
  if (!tag) {
    return res.status(404).json("Not found !!");
  }
  res.json(tag);
});

//!find posts belongs to tag
tag_route.get("/:id/posts", async (req, res) => {
  const id = req.params.id;
  res.json(await data.show(id));
});

//!create
tag_route.post(
  "/",
  [check("name").notEmpty().isString(), check("user_id").notEmpty()],
  user_permission(["admin", "author"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const tag = req.body;
    res.json(await data.create(tag));
  }
);

//!update
tag_route.put(
  "/",
  [
    check("id").notEmpty(),
    check("name").notEmpty().isString(),
    check("user_id").notEmpty(),
  ],
  user_permission(["admin"]),
  async (req, res) => {
    const id = req.body.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const post = req.body;
    res.json(await data.update(id, post));
  }
);

//!delete
tag_route.delete("/", user_permission(["admin"]), async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).json({ message: "can not found !!" });
  }
  await data.destroy(id);
  res.json({ message: "deleted successfully!!" });
});
