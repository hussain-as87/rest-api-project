import express from "express";
import { comment_route } from "./Commet.mjs";
import { post_route } from "./Post.mjs";
import { tag_route } from "./Tag.mjs";
import { user_route } from "./User.mjs";

export const api_route = express.Router();

api_route.use("/authors", user_route);
api_route.use("/tags", tag_route);
api_route.use("/posts", post_route);
api_route.use("/comments", comment_route);
