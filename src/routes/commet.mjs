import express from "express";
import { Comment } from "../classes/Commet.mjs";
import { validationResult, check } from "express-validator";
import { user_permission } from "../middlewares/Permission.mjs";

const data = new Comment();

export const comment_route = express.Router();

//!fetch all 
comment_route.get("/", user_permission(["admin"]), async (req, res) => {
  
  res.json(await data.index());
});

//!find one 
comment_route.get("/:id", async (req, res) => {
  const id = req.params.id;
  const tag = await data.getById(id);
  if (!tag) {
    return res.status(404).json("Not found");
  }
  res.json(tag);
});

//!create  
comment_route.post(
  "/",
  [
    check("name").notEmpty().isString(),
    check("user_id").notEmpty(),
  ],
  user_permission(["admin"]),
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
comment_route.put(
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
comment_route.delete("/", user_permission(["admin"]), async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).json({ message: "this post can not be found !!" });
  }
  res.json(await data.destroy(id));
});
