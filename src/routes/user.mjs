import express from "express";
import { check, validationResult } from "express-validator";
import { User } from "../models/User.mjs";
import { v4 as uuidv4 } from "uuid";
import { user_permission } from "../middlewares/Permission.mjs";
import bcrypt from "bcrypt";
const data = new User();

const salt = await bcrypt.genSalt();

export const user_route = express.Router();
export const login_route = express.Router();
//!login
login_route.post(
  "/",
  [check("email").notEmpty().isEmail(), check("password").notEmpty()],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).json(error);
      return;
    }
    data.login(req, res);
  }
);

//!fetch all
user_route.get("/", user_permission(["admin"]), async (req, res) => {
  res.json(await data.index());
});

//!find one
user_route.get("/:id/posts", async (req, res) => {
  const id = req.params.id;
  const user = await data.show(id);
  res.json(user);
});

//!create
user_route.post(
  "/",
  [
    check("name").notEmpty().isString(),
    check("email").notEmpty(),
    check("password").notEmpty(),
    check("type").notEmpty(),
  ],
  user_permission(["admin"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const usr = req.body;
    usr._id = uuidv4();
    usr.password = await bcrypt.hash(req.body.password, salt);
    res.json(await data.create(usr));
  }
);

//!update
user_route.put(
  "/",
  [
    check("id").notEmpty(),
    check("name").notEmpty().isString(),
    check("email").notEmpty(),
    check("password").notEmpty(),
    check("type").notEmpty(),
  ],
  user_permission(["admin", "author"]),
  async (req, res) => {
    const id = req.body.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const usr = req.body;
    usr._id = id;
    usr.password = await bcrypt.hash(req.body.password, salt);
    res.json(await data.update(id, usr));
  }
);

//!delete
user_route.delete("/", user_permission(["admin"]), async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).json({ message: "this post can not be found !!" });
  }
  await data.destroy(id);
  res.json({ message: "deleted successfully!!" });
});
