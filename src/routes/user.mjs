import express from "express";
import { check, validationResult } from "express-validator";
import { User } from "../classes/User.mjs";
import { user_permission } from "../middlewares/Permission.mjs";

const user = new User();

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
    user.login(req, res);
  }
);

//!fetch all authers
user_route.get("/", user_permission(["admin"]),async (req, res) => {
  res.json(await user.index());
});

 //!find one auther
user_route.get("/:id", (req, res) => {
  const id = req.params.id;
});

//!create new auther
user_route.post(
  "/",
  [
    check("id").notEmpty().isInt(),
    check("f_name").notEmpty().isString(),
    check("l_name").notEmpty().isString(),
  ],
  (req, res, next) => {
    const id = req.body.id;
    const auther = data.find((b) => b.id == id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }

    if (auther) {
      res.status(404).json({
        message: "already exist !!",
      });
      return;
    }
    data.push(req.body);
    res.status(201).json(req.body);
    next();
  }
);

//!update the auther
user_route.put(
  "/",
  [
    check("id").notEmpty().isInt(),
    check("f_name").notEmpty().isString(),
    check("l_name").notEmpty().isString(),
  ],
  (req, res, next) => {
    const id = req.body.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i] = req.body;
        res.status(200).json(req.body);
        return;
      }
    }
    res.status(404).json({
      message: "not found !!",
    });
    next();
  }
);

//!delete the auther
user_route.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  const auther_books = books_data.filter((b) => b.a_id == id);
  if (auther_books.length <= 1) {
    // search inside books array for auther id then delete the auther
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data.splice(i, 1);
        res.status(200).json({
          message: "auther deleted successfully !!",
        });
        return;
      }
    }
  } else if (auther_books.length >= 1) {
    res.status(400).json({
      message: "can not delete it because of already exist in books !!",
    });
    return;
  }
  res.status(404).json({
    message: "The auther with the given id was not found !!",
  });

  next();
});

//!fetch all books belongsto the auther
user_route.get("/:id/books", (req, res, next) => {
  const id = req.params.id;
  const auther = data.find((b) => b.id == id);
  const auther_books = books_data.filter((b) => b.a_id == id);

  if (!auther || auther_books.length < 1) {
    res.status(404).json({
      message: "not found !!",
    });
    return;
  }
  res.json(auther_books);
  next();
});

